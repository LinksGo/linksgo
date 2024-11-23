'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { ExternalLink, AlertTriangle, Smartphone } from 'lucide-react';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Theme configurations
const THEME_ASSETS = {
  light: {
    backgroundImage: 'none',
    backgroundColor: '#ffffff',
    overlayColor: 'rgba(255, 255, 255, 0)',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    accentColor: '#1f2937',
    textColor: '#111827',
    secondaryColor: '#4b5563',
    buttonBackground: '#f3f4f6',
    buttonBorder: '#e5e7eb',
    buttonText: '#111827',
    buttonHoverBackground: '#f9fafb'
  },
  dark: {
    backgroundImage: 'none',
    backgroundColor: '#000000',
    overlayColor: 'rgba(0, 0, 0, 0.5)',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    accentColor: '#f9fafb',
    textColor: '#f9fafb',
    secondaryColor: '#9ca3af',
    buttonBackground: 'rgba(17, 24, 39, 0.8)',
    buttonBorder: '#374151',
    buttonText: '#f9fafb'
  },
  valentine: {
    backgroundImage: 'linear-gradient(135deg, #f43f5e33 0%, #ec489933 100%)',
    backgroundColor: '#fda4af',
    overlayColor: 'rgba(255, 255, 255, 0.1)',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    accentColor: '#f43f5e',
    textColor: '#fff1f2',
    secondaryColor: '#ffe4e6',
    buttonBackground: 'rgba(255, 255, 255, 0.2)',
    buttonBorder: '#fecdd3',
    buttonText: '#fff1f2'
  },
  neon: {
    backgroundImage: 'linear-gradient(to bottom, #000000, #0a0a0a)',
    backgroundColor: '#000000',
    overlayColor: 'rgba(6, 182, 212, 0.1)',
    fontFamily: "'Orbitron', sans-serif",
    accentColor: '#22d3ee',
    textColor: '#22d3ee',
    secondaryColor: '#67e8f9',
    buttonBackground: 'rgba(0, 0, 0, 0.7)',
    buttonBorder: '#22d3ee',
    buttonText: '#22d3ee'
  },
  metal: {
    backgroundImage: 'linear-gradient(135deg, #334155 0%, #1e293b 100%)',
    backgroundColor: '#334155',
    overlayColor: 'rgba(0, 0, 0, 0.3)',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    accentColor: '#e2e8f0',
    textColor: '#f8fafc',
    secondaryColor: '#cbd5e1',
    buttonBackground: 'rgba(15, 23, 42, 0.8)',
    buttonBorder: '#475569',
    buttonText: '#f8fafc'
  },
  cyberpunk: {
    backgroundImage: 'url("https://i.pinimg.com/736x/72/fc/cc/72fccc4be2b895a4ef2c4969d1ac392f.jpg")',
    backgroundColor: '#000000',
    overlayColor: 'rgba(0, 0, 0, 0.5)',
    fontFamily: "'Rajdhani', sans-serif",
    accentColor: '#fcee0a',
    textColor: '#fcee0a',
    secondaryColor: '#fef9c3',
    buttonBackground: 'rgba(0, 0, 0, 0.7)',
    buttonBorder: '#fcee0a',
    buttonText: '#fcee0a',
    buttonHoverBackground: 'rgba(252, 238, 10, 0.1)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'fixed'
  },
  psychopath: {
    backgroundColor: 'transparent',
    overlayColor: 'transparent',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    accentColor: '#ffffff',
    textColor: '#ffffff',
    secondaryColor: 'rgba(255, 255, 255, 0.9)',
    buttonBackground: 'rgba(255, 255, 255, 0.1)',
    buttonBorder: 'rgba(255, 255, 255, 0.2)',
    buttonText: '#ffffff',
    buttonHoverBackground: 'rgba(255, 255, 255, 0.2)',
    backgroundSize: '400% 400%'
  },
  ajith: {
    backgroundImage: 'url("https://w0.peakpx.com/wallpaper/600/432/HD-wallpaper-thala-ajith-billa-movie-sidelook-actor-ajith-kumar.jpg")',
    backgroundColor: '#000000',
    overlayColor: 'rgba(0, 0, 0, 0.4)',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    accentColor: '#3b82f6',
    textColor: '#ffffff',
    secondaryColor: '#93c5fd',
    buttonBackground: 'rgba(0, 0, 0, 0.6)',
    buttonBorder: '#3b82f6',
    buttonText: '#ffffff'
  },
  vijay: {
    backgroundImage: 'url("https://i.pinimg.com/736x/8d/01/e8/8d01e8307ee0066b0425a90706de1a5f.jpg")',
    backgroundColor: '#000000',
    overlayColor: 'rgba(0, 0, 0, 0.4)',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    accentColor: '#eab308',
    textColor: '#ffffff',
    secondaryColor: '#fde047',
    buttonBackground: 'rgba(0, 0, 0, 0.6)',
    buttonBorder: '#eab308',
    buttonText: '#ffffff'
  },
  custom: {
    backgroundImage: 'none',
    backgroundColor: '#ffffff',
    overlayColor: 'rgba(0, 0, 0, 0.3)',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    accentColor: '#ffffff',
    textColor: '#ffffff',
    secondaryColor: '#e5e7eb',
    buttonBackground: 'rgba(255, 255, 255, 0.1)',
    buttonBorder: 'rgba(255, 255, 255, 0.2)',
    buttonText: '#ffffff',
    buttonHoverBackground: 'rgba(255, 255, 255, 0.2)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'fixed'
  },
};

const PSYCHO_STYLES = `
.psycho-title {
  font-family: 'Plus Jakarta Sans', sans-serif;
  color: #ffffff !important;
  text-transform: uppercase;
  font-size: 2.8rem;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.7);
}

.psycho-link {
  background: rgba(255, 255, 255, 0.1) !important;
  border: 2px solid rgba(255, 255, 255, 0.2) !important;
  color: #ffffff !important;
  font-family: 'Plus Jakarta Sans', sans-serif;
  letter-spacing: 1px;
  transition: all 0.3s ease !important;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10px);
}

.psycho-link:hover {
  background: rgba(255, 255, 255, 0.2) !important;
  transform: scale(1.02);
}
`;

const THEME_STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Great+Vibes&family=Orbitron:wght@400;500;600&family=UnifrakturMaguntia&family=Rajdhani:wght@400;500;600&family=Nosifer&display=swap');

/* Valentine Theme Animations */
@keyframes heartbeat {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

/* Neon Theme Animations */
@keyframes neonPulse {
  0%, 100% { 
    text-shadow: 0 0 7px #22d3ee, 0 0 10px #22d3ee, 0 0 21px #22d3ee;
    box-shadow: 0 0 7px #22d3ee, 0 0 10px #22d3ee, 0 0 21px #22d3ee;
  }
  50% { 
    text-shadow: 0 0 4px #22d3ee, 0 0 7px #22d3ee, 0 0 18px #22d3ee;
    box-shadow: 0 0 4px #22d3ee, 0 0 7px #22d3ee, 0 0 18px #22d3ee;
  }
}

/* Cyberpunk Theme Animations */
@keyframes glitch {
  0% { transform: translate(0) skew(0deg); }
  20% { transform: translate(-2px, 2px) skew(2deg); }
  40% { transform: translate(-2px, -2px) skew(-2deg); }
  60% { transform: translate(2px, 2px) skew(2deg); }
  80% { transform: translate(2px, -2px) skew(-2deg); }
  100% { transform: translate(0) skew(0deg); }
}

@keyframes cyberpunkBorder {
  0% { border-color: #fcee0a; }
  33% { border-color: #ff2a6d; }
  66% { border-color: #00fff9; }
  100% { border-color: #fcee0a; }
}

/* Metal Theme Animations */
@keyframes metalShine {
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
}

/* Psychopath Theme Animations */
@keyframes psychoGradient {
  0% { background: linear-gradient(45deg, #ff0000, #ff00ff); }
  25% { background: linear-gradient(45deg, #ff00ff, #00ff00); }
  50% { background: linear-gradient(45deg, #00ff00, #ffff00); }
  75% { background: linear-gradient(45deg, #ffff00, #ff0000); }
  100% { background: linear-gradient(45deg, #ff0000, #ff00ff); }
}

@keyframes textDistort {
  0% { transform: scale(1) rotate(0deg); }
  25% { transform: scale(1.1) rotate(-2deg); }
  50% { transform: scale(0.9) rotate(2deg); }
  75% { transform: scale(1.1) rotate(-1deg); }
  100% { transform: scale(1) rotate(0deg); }
}

.valentine-title {
  font-family: 'Great Vibes', cursive;
  color: #ffffff !important;
  font-size: 3.5rem;
  font-weight: 400;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  animation: heartbeat 1.5s ease-in-out infinite;
}

.valentine-link {
  background: rgba(255, 255, 255, 0.2) !important;
  border: 1px solid rgba(255, 255, 255, 0.3) !important;
  color: #ffffff !important;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-weight: 500;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease !important;
}

.valentine-link:hover {
  background: rgba(255, 255, 255, 0.3) !important;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 51, 102, 0.3);
}

.neon-title {
  font-family: 'Orbitron', sans-serif;
  color: #22d3ee !important;
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 2px;
  animation: neonPulse 2s ease-in-out infinite;
}

.neon-link {
  background: rgba(0, 0, 0, 0.7) !important;
  border: 1px solid #22d3ee !important;
  color: #22d3ee !important;
  font-family: 'Orbitron', sans-serif;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: all 0.3s ease !important;
  animation: neonPulse 2s ease-in-out infinite;
}

.neon-link:hover {
  background: rgba(6, 182, 212, 0.2) !important;
  transform: translateY(-2px);
}

.cyberpunk-title {
  font-family: 'Rajdhani', sans-serif;
  color: #fcee0a !important;
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 2px;
  text-shadow: 2px 2px #ff2a6d;
  animation: glitch 3s infinite;
}

.cyberpunk-link {
  background: rgba(252, 238, 10, 0.1) !important;
  border: 2px solid #fcee0a !important;
  color: #fcee0a !important;
  font-family: 'Rajdhani', sans-serif;
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 1px;
  transition: all 0.3s ease !important;
  animation: cyberpunkBorder 4s infinite;
}

.cyberpunk-link:hover {
  background: rgba(252, 238, 10, 0.2) !important;
  box-shadow: 0 0 30px rgba(252, 238, 10, 0.3);
  transform: translateY(-2px) skew(-1deg);
}

.metal-title {
  font-family: 'UnifrakturMaguntia', cursive;
  color: #e2e8f0 !important;
  text-transform: uppercase;
  font-size: 3rem;
  background: linear-gradient(90deg, #4b5563, #e2e8f0, #4b5563);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: metalShine 3s linear infinite;
}

.metal-link {
  background: rgba(15, 23, 42, 0.8) !important;
  border: 1px solid #475569 !important;
  color: #e2e8f0 !important;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-weight: 500;
  letter-spacing: 1px;
  transition: all 0.3s ease !important;
}

.metal-link:hover {
  background: rgba(30, 41, 59, 0.9) !important;
  box-shadow: 0 0 20px rgba(71, 85, 105, 0.4);
  transform: scale(1.02);
}

.psycho-title {
  font-family: 'Nosifer', cursive;
  color: #ffffff !important;
  text-transform: uppercase;
  font-size: 2.5rem;
  text-shadow: 0 0 10px rgba(255, 0, 0, 0.7);
  animation: textDistort 4s infinite;
  background: linear-gradient(45deg, #ff0000, #ff00ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-size: 200% 200%;
  animation: psychoGradient 5s infinite;
}

.psycho-link {
  background: rgba(0, 0, 0, 0.8) !important;
  border: 2px solid #ff0000 !important;
  color: #ffffff !important;
  font-family: 'Nosifer', cursive;
  letter-spacing: 1px;
  transition: all 0.3s ease !important;
  position: relative;
  overflow: hidden;
  animation: psychoGradient 5s infinite;
}

.psycho-link:hover {
  transform: scale(1.03) skew(-2deg);
  box-shadow: 0 0 20px rgba(255, 0, 0, 0.5);
}

`;

export default function PublicProfileClient({ profile: initialProfile, links: initialLinks, appearance: initialAppearance, username }) {
  const [profile] = useState(initialProfile);
  const [links] = useState(initialLinks || []);
  const [appearance] = useState(initialAppearance || { theme: 'system' });
  const [currentTheme, setCurrentTheme] = useState(getThemePreference(appearance?.theme));
  const [showUnstableWarning, setShowUnstableWarning] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Show warning for unstable mobile themes
  useEffect(() => {
    if (appearance?.theme?.includes('mobile_unstable')) {
      setShowUnstableWarning(true);
      toast((t) => (
        <div className="flex items-center gap-2">
          <Smartphone className="w-4 h-4" />
          <span>Mobile Optimized Theme (Beta)</span>
        </div>
      ), { duration: 5000 });
    }
  }, [appearance?.theme]);

  // Handle system theme changes
  useEffect(() => {
    if (appearance?.theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      setCurrentTheme(e.matches ? 'dark' : 'light');
    };

    handleChange(mediaQuery);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [appearance?.theme]);

  // Handle time-based theme changes
  useEffect(() => {
    if (appearance?.theme !== 'smart') return;

    const updateTimeBasedTheme = () => {
      const hour = new Date().getHours();
      setCurrentTheme(hour >= 19 || hour < 7 ? 'dark' : 'light');
    };

    updateTimeBasedTheme();
    const interval = setInterval(updateTimeBasedTheme, 60000);
    return () => clearInterval(interval);
  }, [appearance?.theme]);

  // Record page view
  useEffect(() => {
    async function recordPageView() {
      if (!profile?.id) return;

      try {
        const { error } = await supabase
          .from('page_views')
          .insert({
            profile_id: profile.id,
            user_agent: window.navigator.userAgent,
            referrer: document.referrer || null,
            created_at: new Date().toISOString()
          });

        if (error) {
          console.error('Error recording page view:', error);
        }
      } catch (error) {
        console.error('Failed to record page view:', error);
      }
    }

    recordPageView();
  }, [profile?.id]);

  // Add psychopath theme styles
  useEffect(() => {
    if (appearance?.theme === 'psychopath') {
      const style = document.createElement('style');
      style.textContent = PSYCHO_STYLES;
      document.head.appendChild(style);
      return () => document.head.removeChild(style);
    }
  }, [appearance?.theme]);

  const copyProfileLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Profile link copied!');
    } catch (error) {
      console.error('Failed to copy link:', error);
      toast.error('Failed to copy link');
    }
  };

  const getTheme = (theme = 'light', originalTheme = 'light', appearanceSettings = null) => {
    const themeAssets = { ...THEME_ASSETS[theme] };
    
    // Handle custom theme with mobile background
    if (theme === 'custom' && appearanceSettings?.mobile_background_url) {
      themeAssets.backgroundImage = `url("${appearanceSettings.mobile_background_url}")`;
    }
    
    return themeAssets;
  };

  const themeConfig = getTheme(
    appearance?.theme || 'light',
    appearance?.theme || 'light',
    appearance
  );

  const isCustomTheme = appearance?.theme && (
    appearance.theme.startsWith('ajith') || 
    appearance.theme.startsWith('vijay') ||
    appearance.theme === 'psychopath' ||
    appearance.theme === 'valentine' ||
    appearance.theme === 'neon' ||
    appearance.theme === 'cyberpunk' ||
    appearance.theme === 'metal' ||
    appearance.theme === 'custom'
  );

  const isPsychoTheme = appearance?.theme === 'psychopath';

  return (
    <>
      {showUnstableWarning && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-4 right-4 bg-yellow-500 text-black px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2 z-50"
        >
          <Smartphone className="w-5 h-5" />
          <span>Mobile Optimized Theme (Beta)</span>
        </motion.div>
      )}
      <div
        className={`min-h-screen w-full py-8 px-4 sm:px-6 md:px-8 ${
          isPsychoTheme ? 'psycho-gradient' : ''
        }`}
        style={!isPsychoTheme ? {
          backgroundColor: themeConfig.backgroundColor,
          backgroundImage: themeConfig.backgroundImage,
          backgroundSize: themeConfig.backgroundSize || 'cover',
          backgroundPosition: themeConfig.backgroundPosition || 'center',
          backgroundRepeat: themeConfig.backgroundRepeat || 'no-repeat',
          backgroundAttachment: themeConfig.backgroundAttachment || 'fixed'
        } : {}}
      >
        {isCustomTheme && !isPsychoTheme && (
          <div
            className="absolute inset-0"
            style={{
              backgroundColor: themeConfig.overlayColor,
              zIndex: 1
            }}
          />
        )}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-lg mx-auto px-4 py-6 sm:py-12 relative z-10"
        >
          <div className="text-center mb-8">
            {profile.avatar_url ? (
              <motion.img
                src={profile.avatar_url}
                alt={profile.full_name || profile.username}
                className={`w-24 h-24 rounded-full mx-auto mb-4 object-cover ${isPsychoTheme ? 'psycho-avatar' : 'ring-2'}`}
                style={{
                  ringColor: !isPsychoTheme && (themeConfig.accentColor || (themeConfig === 'dark' ? '#4a5568' : '#e2e8f0'))
                }}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
              />
            ) : (
              <motion.div 
                className={`w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center text-white ${isPsychoTheme ? 'psycho-avatar' : 'ring-2'}`}
                style={{
                  background: `linear-gradient(135deg, ${stringToColor(profile.username)}, ${themeConfig.accentColor || stringToColor(profile.username + '_end')})`,
                  ringColor: !isPsychoTheme && (themeConfig.accentColor || (themeConfig === 'dark' ? '#4a5568' : '#e2e8f0'))
                }}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <span className="text-2xl font-bold">
                  {(profile.full_name || profile.username || '?')[0].toUpperCase()}
                </span>
              </motion.div>
            )}
            <motion.h1 
              className={`text-2xl font-bold mb-2 ${isPsychoTheme ? 'psycho-title' : ''} ${appearance.theme === 'valentine' ? 'valentine-title' : ''} ${appearance.theme === 'neon' ? 'neon-title' : ''} ${appearance.theme === 'cyberpunk' ? 'cyberpunk-title' : ''} ${appearance.theme === 'metal' ? 'metal-title' : ''}`}
              style={{ 
                color: !isPsychoTheme ? themeConfig.text : undefined,
                textShadow: isCustomTheme && !isPsychoTheme ? '2px 2px 4px rgba(0,0,0,0.5)' : 'none'
              }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {profile.full_name || profile.username}
            </motion.h1>
            {profile.bio && (
              <motion.p 
                className={`mb-4 ${isPsychoTheme ? 'psycho-bio' : ''}`}
                style={{ 
                  color: !isPsychoTheme ? themeConfig.textSecondary : undefined,
                  textShadow: isCustomTheme && !isPsychoTheme ? '1px 1px 2px rgba(0,0,0,0.5)' : 'none'
                }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                {profile.bio}
              </motion.p>
            )}
          </div>

          <div className="space-y-4">
            {links.map((link, index) => (
              <motion.a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * (index + 1) }}
                className={`group block w-full p-4 text-center rounded-lg border transition-all duration-300 ${isPsychoTheme ? 'psycho-link' : ''} ${appearance.theme === 'valentine' ? 'valentine-link' : ''} ${appearance.theme === 'neon' ? 'neon-link' : ''} ${appearance.theme === 'cyberpunk' ? 'cyberpunk-link' : ''} ${appearance.theme === 'metal' ? 'metal-link' : ''}`}
                style={!isPsychoTheme ? {
                  backgroundColor: themeConfig.buttonBackground,
                  borderColor: themeConfig.buttonBorder,
                  color: themeConfig.buttonText,
                  boxShadow: isCustomTheme 
                    ? '0 4px 12px rgba(0,0,0,0.3)' 
                    : (themeConfig === 'dark' ? '0 4px 6px -1px rgba(0, 0, 0, 0.3)' : 'none'),
                  backdropFilter: isCustomTheme ? 'blur(8px)' : 'none',
                  textShadow: isCustomTheme ? '1px 1px 2px rgba(0,0,0,0.5)' : 'none'
                } : undefined}
                whileHover={{
                  scale: isPsychoTheme ? 1 : 1.02,
                  boxShadow: isCustomTheme && !isPsychoTheme
                    ? '0 8px 16px rgba(0,0,0,0.4)'
                    : (themeConfig === 'dark' 
                      ? '0 8px 12px -2px rgba(0, 0, 0, 0.4)' 
                      : '0 4px 6px -1px rgba(0, 0, 0, 0.1)')
                }}
              >
                <div className="flex items-center justify-center">
                  <span>{link.title}</span>
                  <ExternalLink className="w-4 h-4 ml-2 opacity-50 group-hover:opacity-100 transition-opacity" />
                </div>
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </>
  );
}

function getThemePreference(theme = 'system') {
  if (theme === 'light' || theme === 'dark') return theme;
  if (theme === 'smart') {
    const hour = new Date().getHours();
    return hour >= 19 || hour < 7 ? 'dark' : 'light';
  }
  if (theme?.includes('mobile_unstable') || 
      theme === 'ajith' || 
      theme === 'vijay' ||
      theme === 'psychopath' ||
      theme === 'valentine' ||
      theme === 'neon' ||
      theme === 'cyberpunk' ||
      theme === 'metal' ||
      theme === 'custom') return theme;
  return 'light';
}

function stringToColor(str) {
  if (!str) return 'hsl(0, 70%, 50%)';
  
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = hash % 360;
  return `hsl(${hue}, 70%, 50%)`;
}
