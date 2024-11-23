'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useForm } from "react-hook-form";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { getConfig } from '@/lib/config';

export default function SettingsPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState('');
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    linkPreviews: true,
    analyticsTracking: true
  });
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const form = useForm({
    defaultValues: {
      displayName: "",
      bio: "",
    }
  });

  // Load user profile data
  useEffect(() => {
    const loadProfile = async () => {
      try {
        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;
        if (!user) {
          router.push('/auth/signin');
          return;
        }

        setUserId(user.id);

        // Get profile data
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError) throw profileError;

        setUsername(profile.username);
        
        // Update form with profile data
        form.reset({
          displayName: profile.full_name || '',
          bio: profile.bio || '',
        });

      } catch (error) {
        console.error('Error loading profile:', error);
        toast.error('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [supabase, router, form]);

  const handlePreferenceChange = (key) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    toast.success(`${key} preference updated`);
  };

  const handleDeleteAccount = async () => {
    try {
      setIsDeleting(true);
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please sign in to delete your account');
        return;
      }

      // Delete all user data in sequence
      const deleteUserData = async () => {
        // Delete appearance settings
        await supabase
          .from('appearance_settings')
          .delete()
          .eq('user_id', user.id);

        // Delete links
        await supabase
          .from('links')
          .delete()
          .eq('user_id', user.id);

        // Delete profile
        await supabase
          .from('profiles')
          .delete()
          .eq('id', user.id);

        // Delete any storage files
        const { data: storageFiles } = await supabase
          .storage
          .from('avatars')
          .list(`${user.id}`);

        if (storageFiles?.length) {
          await supabase
            .storage
            .from('avatars')
            .remove(storageFiles.map(file => `${user.id}/${file.name}`));
        }

        // Delete from backgrounds bucket if exists
        const { data: bgFiles } = await supabase
          .storage
          .from('backgrounds')
          .list(`${user.id}`);

        if (bgFiles?.length) {
          await supabase
            .storage
            .from('backgrounds')
            .remove(bgFiles.map(file => `${user.id}/${file.name}`));
        }
      };

      // Delete user data first
      await deleteUserData();

      // Delete the auth account
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) throw signOutError;

      toast.success('Account deleted successfully');
      router.push('/');
    } catch (error) {
      console.error('Error deleting account:', error);
      toast.error(error.message || 'Failed to delete account');
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      
      if (!userId) {
        throw new Error('User not authenticated');
      }

      // Update profile in database
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          full_name: data.displayName,
          bio: data.bio,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (updateError) throw updateError;

      toast.success('Profile updated successfully');
      router.refresh();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Error updating profile: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Settings</h1>
      
      {/* Profile Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
          <CardDescription>Manage your profile information and preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-1">Your Profile URL</h3>
            <p className="text-sm text-gray-500">
              {window.location.origin}/{username}
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="displayName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your display name" {...field} />
                    </FormControl>
                    <FormDescription>This is your public display name.</FormDescription>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Tell us about yourself" {...field} />
                    </FormControl>
                    <FormDescription>A brief description about you.</FormDescription>
                  </FormItem>
                )}
              />

              <div className="flex justify-end">
                <Button type="submit" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
          <CardDescription>Customize your experience</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <FormLabel>Email Notifications</FormLabel>
              <FormDescription>Receive email updates about your account</FormDescription>
            </div>
            <Switch
              checked={preferences.emailNotifications}
              onCheckedChange={() => handlePreferenceChange('emailNotifications')}
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <FormLabel>Link Previews</FormLabel>
              <FormDescription>Show previews when hovering over links</FormDescription>
            </div>
            <Switch
              checked={preferences.linkPreviews}
              onCheckedChange={() => handlePreferenceChange('linkPreviews')}
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <FormLabel>Analytics Tracking</FormLabel>
              <FormDescription>Allow us to collect usage data to improve our service</FormDescription>
            </div>
            <Switch
              checked={preferences.analyticsTracking}
              onCheckedChange={() => handlePreferenceChange('analyticsTracking')}
            />
          </div>
        </CardContent>
      </Card>

      {/* Delete Account Section */}
      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="text-destructive">Delete Account</CardTitle>
          <CardDescription>
            Permanently delete your account and all associated data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              <p className="mb-2">This action will:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Delete your profile and all personal information</li>
                <li>Remove all your links and customizations</li>
                <li>Delete your appearance settings and themes</li>
                <li>Don't Do this Please 😭</li>
              </ul>
            </div>
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  Delete Account
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription className="space-y-3">
                    <p>
                      This action cannot be undone. This will permanently delete your
                      account and remove all your data from our servers.
                    </p>
                    <div className="space-y-2">
                      <p className="font-medium">
                        Type <span className="font-mono bg-muted px-1 rounded">{username}</span> to confirm:
                      </p>
                      <Input 
                        value={deleteConfirmText}
                        onChange={(e) => setDeleteConfirmText(e.target.value)}
                        placeholder="Enter your username"
                        className="font-mono"
                      />
                    </div>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteAccount}
                    disabled={deleteConfirmText !== username || isDeleting}
                    className="bg-destructive hover:bg-destructive/90"
                  >
                    {isDeleting ? 'Deleting...' : 'Delete Account'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
