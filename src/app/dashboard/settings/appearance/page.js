'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useTheme } from 'next-themes';
import { InfoCircledIcon } from "@radix-ui/react-icons";

const themes = [
  { id: 'light', name: 'Light' },
  { id: 'dark', name: 'Dark' },
  { id: 'metal', name: 'Metal' },
  { id: 'neon', name: 'Neon' },
  { id: 'valentine', name: 'Valentine' },
  { id: 'system', name: 'System' },
];

export default function AppearanceSettings() {
  const supabase = createClientComponentClient();
  const { theme: currentTheme, setTheme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState({
    light_theme: 'light',
    dark_theme: 'dark',
    current_theme: 'system',
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('appearance_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setSettings(data);
        // Only set theme if it's not system, otherwise let system preference take over
        if (data.current_theme !== 'system') {
          setTheme(data.current_theme);
        }
      } else {
        // Create default settings if none exist
        const { error: insertError } = await supabase
          .from('appearance_settings')
          .insert({
            user_id: user.id,
            light_theme: 'light',
            dark_theme: 'dark',
            current_theme: 'system'
          });

        if (insertError) throw insertError;
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      toast.error('Failed to load appearance settings');
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (updates) => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { error } = await supabase
        .from('appearance_settings')
        .update(updates)
        .eq('user_id', user.id);

      if (error) throw error;

      setSettings(prev => ({ ...prev, ...updates }));
      
      // Update the current theme if it's being changed
      if (updates.current_theme) {
        setTheme(updates.current_theme);
      }

      toast.success('Appearance settings updated');
    } catch (error) {
      console.error('Error updating settings:', error);
      toast.error('Failed to update appearance settings');
    } finally {
      setLoading(false);
    }
  };

  const handleThemeChange = (themeId, type) => {
    const updates = {};
    
    if (type === 'current') {
      updates.current_theme = themeId;
    } else if (type === 'light') {
      updates.light_theme = themeId;
      // If currently using light theme, update it
      if (settings.current_theme === 'light') {
        updates.current_theme = themeId;
      }
    } else if (type === 'dark') {
      updates.dark_theme = themeId;
      // If currently using dark theme, update it
      if (settings.current_theme === 'dark') {
        updates.current_theme = themeId;
      }
    }

    updateSettings(updates);
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
      <h1 className="text-3xl font-bold">Appearance Settings</h1>

      {/* Theme Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Theme Settings</CardTitle>
          <CardDescription>Customize how LinksGo looks</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Theme Sync Info */}
          <div className="bg-primary/10 rounded-lg p-4 flex items-start gap-3">
            <InfoCircledIcon className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <p className="text-sm">
              ✨ Your theme preferences will automatically sync with your visitors' devices! 
              When they visit your profile, it'll match their system's light/dark mode using your chosen themes. 
              No extra setup needed! 🎨
            </p>
          </div>

          {/* Current Theme */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">Current Theme</h3>
              <p className="text-sm text-gray-500">Choose your preferred theme mode</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {themes.map((theme) => (
                <Button
                  key={theme.id}
                  variant={settings.current_theme === theme.id ? "default" : "outline"}
                  className="w-full"
                  onClick={() => handleThemeChange(theme.id, 'current')}
                >
                  {theme.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Light Theme */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">Light Theme</h3>
              <p className="text-sm text-gray-500">Choose your preferred light theme style</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {themes.filter(t => t.id !== 'system').map((theme) => (
                <Button
                  key={theme.id}
                  variant={settings.light_theme === theme.id ? "default" : "outline"}
                  className="w-full"
                  onClick={() => handleThemeChange(theme.id, 'light')}
                >
                  {theme.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Dark Theme */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">Dark Theme</h3>
              <p className="text-sm text-gray-500">Choose your preferred dark theme style</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {themes.filter(t => t.id !== 'system').map((theme) => (
                <Button
                  key={theme.id}
                  variant={settings.dark_theme === theme.id ? "default" : "outline"}
                  className="w-full"
                  onClick={() => handleThemeChange(theme.id, 'dark')}
                >
                  {theme.name}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
