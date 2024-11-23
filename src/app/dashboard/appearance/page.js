'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { HexColorPicker } from 'react-colorful';
import { toast } from 'react-hot-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";

const themes = [
  { id: 'system', name: 'System' },
  { id: 'light', name: 'Light' },
  { id: 'dark', name: 'Dark' },
  { id: 'cyberpunk', name: 'Cyberpunk' }
];

const fonts = [
  { id: 'Inter', name: 'Inter' },
  { id: 'Roboto', name: 'Roboto' },
  { id: 'Poppins', name: 'Poppins' },
  { id: 'Open Sans', name: 'Open Sans' }
];

const buttonStyles = [
  { id: 'rounded', name: 'Rounded' },
  { id: 'square', name: 'Square' },
  { id: 'pill', name: 'Pill' }
];

const defaultAppearance = {
  theme: 'system',
  primary_color: '#FF0080', 
  background_image: '',
  background_color: '#1A1A2E', 
  font_family: 'Inter',
  button_style: 'rounded'
};

export default function Appearance() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showBgColorPicker, setShowBgColorPicker] = useState(false);
  const supabase = createClientComponentClient();

  const form = useForm({
    defaultValues: defaultAppearance
  });

  useEffect(() => {
    fetchAppearanceSettings();
  }, []);

  async function fetchAppearanceSettings() {
    try {
      setLoading(true);
      setError(null);

      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) throw userError;
      if (!user) throw new Error('Not authenticated');

      const { data, error: settingsError } = await supabase
        .from('appearance_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (settingsError && settingsError.code !== 'PGRST116') {
        throw settingsError;
      }

      if (data) {
        // Reset form with existing data
        form.reset({
          theme: data.theme || defaultAppearance.theme,
          primary_color: data.primary_color || defaultAppearance.primary_color,
          background_color: data.background_color || defaultAppearance.background_color,
          background_image: data.background_image || defaultAppearance.background_image,
          font_family: data.font_family || defaultAppearance.font_family,
          button_style: data.button_style || defaultAppearance.button_style
        });
      } else {
        // If no data exists, create default settings
        const { error: insertError } = await supabase
          .from('appearance_settings')
          .insert({
            user_id: user.id,
            ...defaultAppearance
          });

        if (insertError) throw insertError;
      }
    } catch (err) {
      console.error('Error fetching appearance settings:', err);
      setError(err.message);
      toast.error('Failed to load appearance settings');
    } finally {
      setLoading(false);
    }
  }

  async function saveTheme(theme) {
    try {
      setLoading(true);
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) throw userError;

      // First, get existing settings
      const { data: existingSettings, error: fetchError } = await supabase
        .from('appearance_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      // Prepare settings with existing values or defaults
      const settings = {
        ...defaultAppearance,
        ...(existingSettings || {}),
        theme,
        user_id: user.id,
        updated_at: new Date().toISOString()
      };

      const { error: upsertError } = await supabase
        .from('appearance_settings')
        .upsert(settings);

      if (upsertError) throw upsertError;

      // Update form with new settings
      form.reset(settings);
      
      toast.success('Theme saved successfully');
    } catch (err) {
      console.error('Error saving theme:', err);
      toast.error('Failed to save theme');
    } finally {
      setLoading(false);
    }
  }

  async function onSubmit(values) {
    try {
      setLoading(true);
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) throw userError;

      const settings = {
        ...values,
        user_id: user.id,
        updated_at: new Date().toISOString()
      };

      const { error: upsertError } = await supabase
        .from('appearance_settings')
        .upsert(settings);

      if (upsertError) throw upsertError;

      // Update form with new settings
      form.reset(settings);
      
      toast.success('Appearance settings saved successfully');
    } catch (err) {
      console.error('Error saving appearance settings:', err);
      toast.error('Failed to save appearance settings');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container max-w-2xl py-6">
      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>
            Customize how your LinksGo page looks and feels.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="theme"
                  render={({ field }) => (
                    <FormItem className="space-y-4">
                      <div className="flex justify-between items-center">
                        <FormLabel className="text-base">Theme</FormLabel>
                        <Button
                          type="button"
                          onClick={() => saveTheme(field.value)}
                          disabled={loading}
                          variant="outline"
                          className="ml-2"
                        >
                          {loading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            'Save Theme'
                          )}
                        </Button>
                      </div>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="grid grid-cols-2 sm:grid-cols-4 gap-4"
                        >
                          {themes.map((theme) => (
                            <div key={theme.id}>
                              <RadioGroupItem
                                value={theme.id}
                                id={theme.id}
                                className="peer sr-only"
                              />
                              <label
                                htmlFor={theme.id}
                                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-background p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                              >
                                <span className="font-semibold">{theme.name}</span>
                              </label>
                            </div>
                          ))}
                        </RadioGroup>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="primary_color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Primary Color</FormLabel>
                    <FormControl>
                      <div className="space-y-4">
                        <div
                          className="h-10 w-full rounded-md border cursor-pointer"
                          style={{ backgroundColor: field.value }}
                          onClick={() => setShowColorPicker(!showColorPicker)}
                        />
                        {showColorPicker && (
                          <div className="absolute z-10">
                            <div
                              className="fixed inset-0"
                              onClick={() => setShowColorPicker(false)}
                            />
                            <HexColorPicker
                              color={field.value}
                              onChange={field.onChange}
                            />
                          </div>
                        )}
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="font_family"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Font Family</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="grid grid-cols-2 gap-4"
                      >
                        {fonts.map((font) => (
                          <div key={font.id}>
                            <RadioGroupItem
                              value={font.id}
                              id={font.id}
                              className="peer sr-only"
                            />
                            <label
                              htmlFor={font.id}
                              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-background p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                              style={{ fontFamily: font.id }}
                            >
                              <span className="font-semibold">{font.name}</span>
                            </label>
                          </div>
                        ))}
                      </RadioGroup>
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="button_style"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Button Style</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="grid grid-cols-3 gap-4"
                      >
                        {buttonStyles.map((style) => (
                          <div key={style.id}>
                            <RadioGroupItem
                              value={style.id}
                              id={style.id}
                              className="peer sr-only"
                            />
                            <label
                              htmlFor={style.id}
                              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-background p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                            >
                              <span className="font-semibold">{style.name}</span>
                            </label>
                          </div>
                        ))}
                      </RadioGroup>
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="background_color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Background Color</FormLabel>
                    <FormControl>
                      <div className="space-y-4">
                        <div
                          className="h-10 w-full rounded-md border cursor-pointer"
                          style={{ backgroundColor: field.value }}
                          onClick={() => setShowBgColorPicker(!showBgColorPicker)}
                        />
                        {showBgColorPicker && (
                          <div className="absolute z-10">
                            <div
                              className="fixed inset-0"
                              onClick={() => setShowBgColorPicker(false)}
                            />
                            <HexColorPicker
                              color={field.value}
                              onChange={field.onChange}
                            />
                          </div>
                        )}
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="background_image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Background Image</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="https://example.com/background.jpg"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
