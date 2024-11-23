'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ProfilePreview } from '@/components/profile-preview';
import { motion, AnimatePresence } from 'framer-motion';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { Upload, Image as ImageIcon, Eye, InfoIcon } from 'lucide-react';

const themes = [
  { 
    id: 'light', 
    name: 'Light',
    description: 'Clean and minimal',
    gradientFrom: 'from-gray-50',
    gradientTo: 'to-gray-100',
    accentColor: 'text-gray-900'
  },
  { 
    id: 'dark', 
    name: 'Dark',
    description: 'High contrast dark theme',
    gradientFrom: 'from-gray-900',
    gradientTo: 'to-background'
  },
  { 
    id: 'valentine', 
    name: 'Valentine',
    description: 'Romantic pink and red theme',
    gradientFrom: 'from-pink-400/20',
    gradientTo: 'to-red-400/20',
    accentColor: 'text-pink-500'
  },
  { 
    id: 'neon', 
    name: 'Neon',
    description: 'Vibrant cyberpunk style',
    gradientFrom: 'from-cyan-400/20',
    gradientTo: 'to-purple-400/20',
    accentColor: 'text-cyan-400'
  },
  { 
    id: 'metal', 
    name: 'Metal',
    description: 'Industrial metallic finish',
    gradientFrom: 'from-slate-700',
    gradientTo: 'to-zinc-800',
    accentColor: 'text-slate-300'
  },
  { 
    id: 'ajith', 
    name: 'Ajith',
    description: 'Thala inspired theme',
    gradientFrom: 'from-blue-600/20',
    gradientTo: 'to-gray-900',
    accentColor: 'text-blue-500'
  },
  { 
    id: 'vijay', 
    name: 'Vijay',
    description: 'Thalapathy style (groovy)',
    gradientFrom: 'from-yellow-400/20',
    gradientTo: 'to-red-500/20',
    accentColor: 'text-yellow-500'
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    description: 'Night City style',
    gradientFrom: 'from-[#fcee0a]',
    gradientTo: 'to-[#00ffff]',
    accentColor: 'text-[#fcee0a]',
    secondaryAccent: 'text-[#00ffff]'
  },
  {
    id: 'psychopath',
    name: 'Psychopath',
    description: 'Mind-bending color shifts',
    gradientFrom: 'from-purple-600',
    gradientTo: 'to-red-500',
    accentColor: 'text-white',
    isAnimated: true
  },
  { 
    id: 'custom', 
    name: 'Custom (Mobile)',
    description: 'Mobile-only background theme',
    isCustom: true,
    mobileOnly: true
  }
];

export default function Customize() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [customization, setCustomization] = useState({
    theme: 'light',
    roundedCorners: true,
    showShadow: true,
    glassmorphism: false,
    backgroundImage: null,
    mobileBackgroundUrl: ''
  });

  const [profile, setProfile] = useState({
    full_name: '',
    username: '',
    avatar_url: '',
    bio: ''
  });
  const [links, setLinks] = useState([]);
  const supabase = createClientComponentClient();

  useEffect(() => {
    async function fetchProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        if (profile) {
          setProfile(profile);
        }
      }
    }

    async function fetchLinks() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: links } = await supabase
          .from('links')
          .select('*')
          .eq('user_id', user.id)
          .order('position');
        if (links) {
          setLinks(links);
        }
      }
    }

    async function fetchCustomization() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data, error } = await supabase
            .from('appearance_settings')
            .select('*')
            .eq('user_id', user.id)
            .single();
          
          if (error && error.code !== 'PGRST116') {
            throw error;
          }

          if (data) {
            setCustomization({
              theme: data.theme || 'light',
              roundedCorners: true,
              showShadow: true,
              glassmorphism: false,
              backgroundImage: data.background_image || null,
              mobileBackgroundUrl: data.mobile_background_url || ''
            });
          }
        }
      } catch (error) {
        console.error('Error fetching customization:', error);
        toast.error('Failed to load customization settings');
      }
    }

    fetchProfile();
    fetchLinks();
    fetchCustomization();
  }, [supabase]);

  const updateCustomization = (key, value) => {
    console.log('Updating customization:', { key, value, before: customization[key] }); // Debug log
    setCustomization(prev => {
      const newState = { ...prev, [key]: value };
      console.log('New customization state:', newState); // Debug log
      return newState;
    });
  };

  const uploadBackgroundImage = async (event) => {
    try {
      setIsLoading(true);
      const file = event.target.files[0];
      if (!file) return;

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/background-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('backgrounds')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('backgrounds')
        .getPublicUrl(filePath);

      updateCustomization('backgroundImage', publicUrl);
      toast.success('Background image uploaded successfully!');
    } catch (error) {
      console.error('Error uploading background image:', error);
      toast.error('Error uploading background image');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMobileBackgroundUrl = async (url) => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please sign in to update background');
        return;
      }

      // First get existing settings
      const { data: existingSettings, error: fetchError } = await supabase
        .from('appearance_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Error fetching settings:', fetchError);
        throw fetchError;
      }

      const updateData = {
        user_id: user.id,
        theme: 'custom', // Always set to custom when using mobile background
        mobile_background_url: url
      };

      if (existingSettings) {
        // Update existing settings
        const { error: updateError } = await supabase
          .from('appearance_settings')
          .update({
            mobile_background_url: url,
            theme: 'custom'
          })
          .eq('user_id', user.id);

        if (updateError) {
          console.error('Update error:', updateError);
          throw updateError;
        }
      } else {
        // Insert new settings
        const { error: insertError } = await supabase
          .from('appearance_settings')
          .insert({
            ...updateData,
            rounded_corners: true,
            show_shadow: true,
            glassmorphism: false
          });

        if (insertError) {
          console.error('Insert error:', insertError);
          throw insertError;
        }
      }

      setCustomization(prev => ({
        ...prev,
        theme: 'custom',
        mobileBackgroundUrl: url
      }));
      
      toast.success('Mobile background updated successfully');
    } catch (error) {
      console.error('Full error object:', error);
      toast.error(error.message || 'Failed to update mobile background');
    } finally {
      setIsLoading(false);
    }
  };

  const saveCustomization = async () => {
    try {
      setIsLoading(true);
      console.log('Starting save process...');

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please sign in to save customization');
        return;
      }

      // Log current customization state
      console.log('Current customization:', customization);

      // First try to get existing settings
      const { data: existingSettings, error: fetchError } = await supabase
        .from('appearance_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      console.log('Existing settings:', existingSettings);
      if (fetchError) {
        console.log('Fetch error:', fetchError);
      }

      // Prepare update data with all necessary fields
      const updateData = {
        user_id: user.id,
        theme: customization.theme || 'light',
        rounded_corners: customization.roundedCorners,
        show_shadow: customization.showShadow,
        glassmorphism: customization.glassmorphism
      };

      // Preserve existing values if they exist
      if (customization.theme === 'custom' && existingSettings?.mobile_background_url) {
        updateData.mobile_background_url = existingSettings.mobile_background_url;
      }
      if (existingSettings?.background_image) {
        updateData.background_image = existingSettings.background_image;
      }

      console.log('Attempting update with:', updateData);

      const { error: saveError } = await supabase
        .from('appearance_settings')
        .upsert(updateData, {
          onConflict: 'user_id'
        });

      if (saveError) {
        console.error('Save error:', saveError);
        throw saveError;
      }

      toast.success('Settings saved successfully');
      router.refresh();
    } catch (error) {
      console.error('Full error object:', error);
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error code:', error.code);
      console.error('Error details:', error.details);
      toast.error(error.message || 'Failed to save settings');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container py-8">
      <div className="grid gap-8 lg:grid-cols-[1fr,400px]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Theme</CardTitle>
              <CardDescription>Choose a theme for your profile page</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <Label>Select Theme</Label>
                  <Button 
                    onClick={saveCustomization} 
                    disabled={isLoading}
                    variant="outline"
                    className="ml-2"
                  >
                    {isLoading ? 'Saving...' : 'Save Theme'}
                  </Button>
                </div>

                {/* Smart Theme Info Message */}
                <div className="flex items-start gap-3 p-4 rounded-lg bg-primary/10 text-sm">
                  <InfoIcon className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium mb-1">✨ Smart Theme Adaptation</p>
                    <p>
                      The theme you choose here will automatically adapt to your visitors' device preferences! 
                      When someone visits your profile in dark mode, they'll see your dark theme version, 
                      and in light mode, they'll see your light theme version. Magic! 🎨
                    </p>
                  </div>
                </div>

                {/* Theme Selection */}
                <RadioGroup
                  value={customization.theme}
                  onValueChange={(value) => updateCustomization('theme', value)}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  {themes.map((theme) => (
                    <div key={theme.id}>
                      <RadioGroupItem
                        value={theme.id}
                        id={theme.id}
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor={theme.id}
                        className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                      >
                        <div className="mb-2 rounded-md bg-background p-2 text-foreground/60">
                          {theme.name}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {theme.description}
                        </p>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>

                {/* Mobile Background URL Input for Custom Theme */}
                {customization.theme === 'custom' && (
                  <div className="mt-4 space-y-2">
                    <Label htmlFor="mobileBackgroundUrl">Mobile Background URL</Label>
                    <div className="flex gap-2">
                      <Input
                        id="mobileBackgroundUrl"
                        placeholder="Enter image URL"
                        value={customization.mobileBackgroundUrl}
                        onChange={(e) => updateCustomization('mobileBackgroundUrl', e.target.value)}
                      />
                      <Button
                        onClick={() => handleMobileBackgroundUrl(customization.mobileBackgroundUrl)}
                        disabled={isLoading}
                        variant="secondary"
                      >
                        Apply
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Music Card */}
          <Card>
            <CardHeader className="relative">
              <div className="absolute -top-2 right-0 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-medium">
                Coming Soon 🎵
              </div>
              <CardTitle>Background Music</CardTitle>
              <CardDescription>Add music to your profile page</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 rounded-lg bg-muted text-sm">
                  <InfoIcon className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium mb-1">🎶 Profile Music</p>
                    <p>
                      Soon you'll be able to add background music to your profile! 
                      Upload your favorite tracks or use Spotify integration to share your musical vibe with visitors.
                      Stay tuned for this exciting feature! 
                    </p>
                  </div>
                </div>
                <div className="opacity-60 pointer-events-none">
                  <Label>Music Source</Label>
                  <RadioGroup
                    value="upload"
                    className="grid grid-cols-2 gap-4 mt-2"
                  >
                    <div>
                      <RadioGroupItem
                        value="upload"
                        id="upload"
                        className="peer sr-only"
                        disabled
                      />
                      <Label
                        htmlFor="upload"
                        className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-not-allowed"
                      >
                        <Upload className="w-4 h-4 mb-2" />
                        <span>Upload Music</span>
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem
                        value="spotify"
                        id="spotify"
                        className="peer sr-only"
                        disabled
                      />
                      <Label
                        htmlFor="spotify"
                        className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-not-allowed"
                      >
                        <svg viewBox="0 0 24 24" className="w-4 h-4 mb-2 fill-current">
                          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                        </svg>
                        <span>Spotify</span>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preview Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Preview</h2>
          <ProfilePreview 
            profile={profile} 
            links={links} 
            customization={customization}
          />
        </div>
      </div>
    </div>
  );
}
