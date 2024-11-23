'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const ThemeContext = createContext({
  lightTheme: 'light',
  darkTheme: 'dark',
  currentTheme: 'system',
  setLightTheme: () => {},
  setDarkTheme: () => {},
  setCurrentTheme: () => {},
});

export function ThemeProvider({ children }) {
  const supabase = createClientComponentClient();
  const [settings, setSettings] = useState({
    lightTheme: 'light',
    darkTheme: 'dark',
    currentTheme: 'system',
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
        .select('light_theme, dark_theme, current_theme')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading theme settings:', error);
        return;
      }

      if (data) {
        setSettings({
          lightTheme: data.light_theme,
          darkTheme: data.dark_theme,
          currentTheme: data.current_theme,
        });
      }
    } catch (error) {
      console.error('Error in loadSettings:', error);
    }
  };

  const updateSettings = async (updates) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('appearance_settings')
        .update(updates)
        .eq('user_id', user.id);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating theme settings:', error);
    }
  };

  const setLightTheme = async (theme) => {
    setSettings(prev => ({ ...prev, lightTheme: theme }));
    await updateSettings({ light_theme: theme });
  };

  const setDarkTheme = async (theme) => {
    setSettings(prev => ({ ...prev, darkTheme: theme }));
    await updateSettings({ dark_theme: theme });
  };

  const setCurrentTheme = async (theme) => {
    setSettings(prev => ({ ...prev, currentTheme: theme }));
    await updateSettings({ current_theme: theme });
  };

  return (
    <ThemeContext.Provider
      value={{
        ...settings,
        setLightTheme,
        setDarkTheme,
        setCurrentTheme,
      }}
    >
      <NextThemesProvider
        attribute="data-theme"
        defaultTheme="system"
        value={{
          light: settings.lightTheme,
          dark: settings.darkTheme,
          system: settings.currentTheme === 'system' ? undefined : settings.currentTheme,
        }}
      >
        {children}
      </NextThemesProvider>
    </ThemeContext.Provider>
  );
}

export const useThemeContext = () => useContext(ThemeContext);
