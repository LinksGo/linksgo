'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Plus, Link as LinkIcon } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import toast from '@/lib/toast';

export default function LinksPage() {
  const [links, setLinks] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    description: '',
  });

  const supabase = createClientComponentClient();

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('Please sign in to view links');
        return;
      }

      const { data: links, error } = await supabase
        .from('links')
        .select('*')
        .eq('user_id', user.id)
        .order('position');

      if (error) throw error;
      setLinks(links || []);
    } catch (error) {
      console.error('Error fetching links:', error);
      toast.error(error.message || 'Failed to load links');
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      toast.error('Title is required');
      return false;
    }
    if (!formData.url.trim()) {
      toast.error('URL is required');
      return false;
    }
    try {
      new URL(formData.url);
    } catch (e) {
      toast.error('Please enter a valid URL');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('Please sign in to add links');
        return;
      }

      // Check link limit
      if (links.length >= 5) {
        toast.error('Maximum limit of 5 links reached');
        return;
      }

      // Add new link
      const { data, error } = await supabase
        .from('links')
        .insert([
          {
            user_id: user.id,
            title: formData.title,
            url: formData.url,
            description: formData.description,
            position: links.length,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      setLinks([...links, data]);
      setIsFormOpen(false);
      setFormData({ title: '', url: '', description: '' });
      toast.success('Link added successfully');
    } catch (error) {
      console.error('Error adding link:', error);
      toast.error(error.message || 'Failed to add link');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this link?')) {
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`/api/links?id=${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete link');
      }

      toast.success('Link deleted successfully');
      fetchLinks();
    } catch (error) {
      console.error('Error deleting link:', error);
      toast.error(error.message || 'Failed to delete link');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container py-8 max-w-2xl mx-auto">
      <div className="space-y-6">
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

        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Your Links</h1>
          <Button
            onClick={() => {
              if (links.length >= 5) {
                toast.error('Maximum limit of 5 links reached');
                return;
              }
              setFormData({
                title: '',
                url: '',
                description: '',
              });
              setIsFormOpen(true);
            }}
            className="gap-2"
            disabled={links.length >= 5}
          >
            <Plus className="h-4 w-4" />
            Add Link
          </Button>
        </div>

        {links.length === 0 && !isFormOpen && (
          <div className="text-center py-12 bg-muted/10 rounded-lg border border-dashed">
            <div className="rounded-full bg-primary/10 p-3 mb-4 inline-block">
              <LinkIcon className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-medium mb-1">No links yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Add up to 5 links to share with your audience
            </p>
            <Button
              onClick={() => {
                setFormData({
                  title: '',
                  url: '',
                  description: '',
                });
                setIsFormOpen(true);
              }}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Your First Link
            </Button>
          </div>
        )}

        {/* Add Link Form */}
        <AnimatePresence>
          {isFormOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-8 p-6 bg-card rounded-lg border"
            >
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="Enter link title"
                    disabled={isLoading}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="url">URL</Label>
                  <Input
                    id="url"
                    value={formData.url}
                    onChange={(e) =>
                      setFormData({ ...formData, url: e.target.value })
                    }
                    placeholder="Enter URL"
                    disabled={isLoading}
                    required
                    type="url"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description (optional)</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Enter link description"
                    disabled={isLoading}
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsFormOpen(false)}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Adding...' : 'Add Link'}
                  </Button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Links List */}
        <div className="space-y-4">
          {links.map((link) => (
            <div
              key={link.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-card rounded-lg border gap-4"
            >
              <div className="space-y-1 min-w-0">
                <h3 className="font-medium truncate pr-4">{link.title}</h3>
                <p className="text-sm text-muted-foreground break-all">{link.url}</p>
                {link.description && (
                  <p className="text-sm text-muted-foreground mt-1 break-words">
                    {link.description}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2 self-end sm:self-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(link.url);
                    toast.success('Link copied to clipboard');
                  }}
                  className="h-9 px-3"
                >
                  Copy
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(link.id)}
                  disabled={isLoading}
                  className="h-9 px-3"
                >
                  Delete
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  asChild
                  className="h-9 px-3"
                >
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center"
                  >
                    Visit
                  </a>
                </Button>
              </div>
            </div>
          ))}
          {!isLoading && links.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              No links added yet. Click "Add Link" to create your first link.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
