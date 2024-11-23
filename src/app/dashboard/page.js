'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { BarChart3, Users, Link as LinkIcon, Plus, Trash2, GripVertical, ExternalLink, Copy, Check } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { OtherServices } from "@/components/other-services";
import { HowToUse } from "@/components/how-to-use";
import AnalyticsSection from './analytics-section';
import { getConfig, getProfileUrl } from '@/lib/config';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function SortableLink({ link, onDelete }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: link.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <div className="flex items-center justify-between p-4 bg-card rounded-lg border mb-2">
        <div className="flex items-center gap-3 flex-1">
          <button className="cursor-grab active:cursor-grabbing" {...listeners}>
            <GripVertical className="w-5 h-5 text-muted-foreground" />
          </button>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium truncate">{link.title}</h3>
            <p className="text-sm text-muted-foreground truncate">{link.url}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => window.open(link.url, '_blank')}
            >
              <ExternalLink className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(link.id)}
              className="text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  // Stats state
  const [stats, setStats] = useState({
    totalViews: 0,
    viewRate: 0,
    totalLinks: 0,
  });

  // Links state
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [profile, setProfile] = useState(null);
  const [copying, setCopying] = useState(false);
  const supabase = createClientComponentClient();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError('Not authenticated');
        return;
      }

      // Fetch profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      setProfile(profileData);

      // Fetch links
      const { data: linksData, error: linksError } = await supabase
        .from('links')
        .select('*')
        .eq('user_id', user.id)
        .order('position');

      if (linksError) throw linksError;

      // Fetch analytics data
      const [clicksResponse, viewsResponse] = await Promise.all([
        supabase
          .from('link_clicks')
          .select('link_id, device_type, country')
          .in('link_id', linksData?.map(l => l.id) || []),
        supabase
          .from('page_views')
          .select('profile_id')
          .eq('profile_id', user.id)
      ]);

      // Calculate stats
      const statsData = {
        totalViews: viewsResponse.data?.length || 0,
        viewRate: 0,
        totalLinks: linksData?.length || 0,
      };

      // Calculate view rate (views per day)
      if (viewsResponse.data && viewsResponse.data.length > 0) {
        const oldestView = new Date(Math.min(...viewsResponse.data.map(v => new Date(v.created_at))));
        const now = new Date();
        const daysDiff = Math.max(1, Math.ceil((now - oldestView) / (1000 * 60 * 60 * 24)));
        statsData.viewRate = Number((statsData.totalViews / daysDiff).toFixed(2)) || 0;
      }

      // Add click counts to links data
      const linksWithStats = linksData?.map(link => ({
        ...link,
        clicks: clicksResponse.data?.filter(click => click.link_id === link.id).length || 0
      }));

      setStats(statsData);
      setLinks(linksWithStats || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteLink(id) {
    try {
      const response = await fetch(`/api/links?id=${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete link');
      }

      setLinks(links.filter(link => link.id !== id));
      toast.success('Link deleted successfully');
      await fetchData(); // Refresh data to get updated stats
    } catch (error) {
      console.error('Error deleting link:', error);
      toast.error(error.message);
    }
  }

  async function copyProfileLink() {
    if (!profile?.username) {
      toast.error("Username not found. Please set up your profile first.");
      return;
    }

    try {
      setCopying(true);
      const profileUrl = getProfileUrl(profile.username);
      await navigator.clipboard.writeText(profileUrl);
      toast.success("Profile link copied to clipboard!");
    } catch (error) {
      toast.error("Failed to copy link to clipboard");
    } finally {
      setCopying(false);
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      setLinks((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        
        const newItems = arrayMove(items, oldIndex, newIndex);
        
        // Update positions in the database
        updateLinkPositions(newItems);
        
        return newItems;
      });
    }
  };

  const updateLinkPositions = async (newLinks) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('Please sign in to update links');
        return;
      }

      const updates = newLinks.map((link, index) => ({
        id: link.id,
        position: index,
      }));

      const { error } = await supabase
        .from('links')
        .upsert(updates, { onConflict: 'id' });

      if (error) throw error;
    } catch (error) {
      console.error('Error updating link positions:', error);
      toast.error('Failed to update link order');
    }
  };

  const stats_items = [
    {
      name: 'Total Views',
      value: stats.totalViews,
      change: '',
      icon: BarChart3,
    },
    {
      name: 'View Rate',
      value: stats.viewRate,
      change: '',
      icon: Users,
    },
    {
      name: 'Total Links',
      value: stats.totalLinks,
      change: '',
      icon: LinkIcon,
    },
  ];

  if (loading && !mounted) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-full overflow-x-hidden">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          {error}
        </div>
      )}

      <div className="grid gap-6">
        {/* Quick Start Guide */}
        <div className="grid gap-4 md:grid-cols-2">
          <HowToUse />
        </div>

        {/* Stats Overview */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {stats_items.map((item) => (
            <Card key={item.name}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {item.name}
                </CardTitle>
                <item.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{item.value}</div>
                <p className="text-xs text-muted-foreground">
                  {item.change}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-4 grid-cols-1 lg:grid-cols-7">
          <Card className="col-span-1 lg:col-span-4">
            <CardHeader>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <CardTitle>Links</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyProfileLink}
                  disabled={copying || !profile?.username}
                  className="gap-2 w-full sm:w-auto"
                >
                  {copying ? (
                    <>
                      <Check className="w-4 h-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy Profile Link
                    </>
                  )}
                </Button>
              </div>
              <CardDescription>
                Drag and drop to reorder your links
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={links.map(link => link.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-2">
                      {links.map((link) => (
                        <SortableLink
                          key={link.id}
                          link={link}
                          onDelete={handleDeleteLink}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              )}
            </CardContent>
          </Card>

          <Card className="col-span-1 lg:col-span-3">
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
              <CardDescription>Track your link performance</CardDescription>
            </CardHeader>
            <CardContent>
              <AnalyticsSection links={links} />
            </CardContent>
          </Card>
        </div>

        {/* Other Services */}
        <div className="grid gap-4 md:grid-cols-2">
          <OtherServices />
        </div>
      </div>
    </div>
  );
}
