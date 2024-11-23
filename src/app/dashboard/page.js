'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { BarChart3, Users, Link as LinkIcon, Plus, Trash2, GripVertical, ExternalLink, Copy, Check } from 'lucide-react';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { OtherServices } from "@/components/other-services";
import { HowToUse } from "@/components/how-to-use";
import AnalyticsSection from './analytics-section';
import { getConfig, getProfileUrl } from '@/lib/config';

// Dynamically import DragDropContext with SSR disabled
const DragDropContext = dynamic(
  () => import('react-beautiful-dnd').then(mod => mod.DragDropContext),
  { ssr: false }
);

const Droppable = dynamic(
  () => import('react-beautiful-dnd').then(mod => mod.Droppable),
  { ssr: false }
);

const Draggable = dynamic(
  () => import('react-beautiful-dnd').then(mod => mod.Draggable),
  { ssr: false }
);

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
        statsData.viewRate = (statsData.totalViews / daysDiff).toFixed(2);
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

  const stats_items = [
    {
      name: 'Total Views',
      value: stats.totalViews,
      icon: Users,
      change: loading ? '...' : `${stats.totalViews > 0 ? '+' : ''}${stats.totalViews}`,
      changeType: 'positive',
    },
    {
      name: 'Views/Day',
      value: stats.viewRate,
      icon: BarChart3,
      change: loading ? '...' : `${stats.viewRate} avg`,
      changeType: 'positive',
    },
    {
      name: 'Total Links',
      value: stats.totalLinks,
      icon: LinkIcon,
      change: loading ? '...' : `${stats.totalLinks}`,
      changeType: 'positive',
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="space-y-8">
        {/* How to Use Section */}
        <HowToUse />

        {/* Profile Link Card */}
        <Card className="col-span-full bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="space-y-2 text-center sm:text-left">
                <h3 className="text-xl font-semibold tracking-tight">Your LinksGo Profile</h3>
                <p className="text-muted-foreground">
                  Share your profile link with your audience
                </p>
                <p className="text-sm font-medium text-primary">
                  {getConfig().domain}/{profile?.username || '...'}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="lg"
                  className="gap-2 min-w-[140px] h-12 shadow-lg hover:shadow-xl transition-all duration-200"
                  onClick={async () => {
                    setCopying(true);
                    try {
                      await navigator.clipboard.writeText(getProfileUrl(profile?.username));
                      toast.success('Profile link copied to clipboard!');
                    } catch (err) {
                      toast.error('Failed to copy link');
                    }
                    setTimeout(() => setCopying(false), 1000);
                  }}
                >
                  {copying ? (
                    <>
                      <Check className="h-5 w-5" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-5 w-5" />
                      Copy Link
                    </>
                  )}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="gap-2 h-12"
                  asChild
                >
                  <a
                    href={getProfileUrl(profile?.username)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-5 w-5" />
                    Visit
                  </a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Section */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalViews}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">View Rate</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.viewRate}%</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Links</CardTitle>
              <LinkIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalLinks}</div>
            </CardContent>
          </Card>
        </div>

        {/* Other Services Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold tracking-tight">Other Services</h2>
          <OtherServices />
        </div>

        {/* Links Section */}
        <div className="mt-8 space-y-4">
          <h2 className="text-xl font-bold mb-4">Your Links</h2>

          {/* Link Limit Card */}
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-primary/10 p-2">
                  <LinkIcon className="h-4 w-4 text-primary" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-medium">Link Limit</h3>
                  <p className="text-sm text-muted-foreground">
                    You can add up to 5 links to your profile. You have used {links.length} of 5 links.
                  </p>
                  <div className="w-full bg-primary/10 rounded-full h-2 mt-2">
                    <div
                      className="bg-primary rounded-full h-2 transition-all duration-300"
                      style={{ width: `${(links.length / 5) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Links Management Card */}
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle>Manage Links</CardTitle>
                  <CardDescription>Drag to reorder, tap to edit</CardDescription>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 w-full sm:w-auto"
                    onClick={() => {
                      if (links.length >= 5) {
                        toast.error('Maximum limit of 5 links reached');
                        return;
                      }
                      router.push('/dashboard/links');
                    }}
                    disabled={links.length >= 5}
                  >
                    <Plus className="h-4 w-4" />
                    Add Link
                  </Button>
                  <Button
                    onClick={() => {
                      if (links.length >= 5) {
                        toast.error('Maximum limit of 5 links reached');
                        return;
                      }
                      router.push('/dashboard/links');
                    }}
                    className="gap-2 w-full sm:w-auto"
                    disabled={links.length >= 5}
                  >
                    <Plus className="h-4 w-4" />
                    Add Link
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {links.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="rounded-full bg-primary/10 p-3 mb-4">
                    <LinkIcon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-medium mb-1">No links yet</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Add up to 5 links to share with your audience
                  </p>
                  <Button
                    onClick={() => {
                      router.push('/dashboard/links');
                    }}
                    className="gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Your First Link
                  </Button>
                </div>
              ) : (
                <DragDropContext
                  onDragEnd={async ({ destination, source }) => {
                    if (!destination) return;
                    
                    const items = Array.from(links);
                    const [reorderedItem] = items.splice(source.index, 1);
                    items.splice(destination.index, 0, reorderedItem);
                    
                    setLinks(items);
                    
                    // Update positions in database
                    const updates = items.map((link, index) => ({
                      id: link.id,
                      position: index,
                    }));
                    
                    try {
                      const response = await fetch('/api/links/reorder', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ updates }),
                      });
                      
                      if (!response.ok) {
                        throw new Error('Failed to update link positions');
                      }
                      
                      toast.success('Links reordered successfully');
                    } catch (error) {
                      console.error('Error reordering links:', error);
                      toast.error(error.message);
                      // Revert the state on error
                      await fetchData();
                    }
                  }}
                >
                  <Droppable droppableId="links">
                    {(provided) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="space-y-4"
                      >
                        {links.map((link, index) => (
                          <Draggable
                            key={link.id}
                            draggableId={link.id.toString()}
                            index={index}
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-card rounded-lg border gap-4"
                              >
                                <div className="flex items-start sm:items-center gap-4 w-full sm:w-auto">
                                  <div {...provided.dragHandleProps} className="mt-1 sm:mt-0">
                                    <GripVertical className="h-4 w-4 text-gray-500" />
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <h3 className="font-medium truncate">{link.title}</h3>
                                    <p className="text-sm text-muted-foreground truncate">{link.url}</p>
                                    {link.description && (
                                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                        {link.description}
                                      </p>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 ml-8 sm:ml-0">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDeleteLink(link.id)}
                                    className="hover:bg-destructive/10 hover:text-destructive"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                    <span className="sr-only">Delete</span>
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    asChild
                                    className="hover:bg-primary/10 hover:text-primary"
                                  >
                                    <a
                                      href={link.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      aria-label="Open link in new tab"
                                    >
                                      <ExternalLink className="h-4 w-4" />
                                      <span className="sr-only">Open</span>
                                    </a>
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      navigator.clipboard.writeText(link.url);
                                      toast.success('Link copied to clipboard');
                                    }}
                                    className="hover:bg-primary/10 hover:text-primary"
                                  >
                                    <Copy className="h-4 w-4" />
                                    <span className="sr-only">Copy</span>
                                  </Button>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
