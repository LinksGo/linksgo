'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { ExternalLink, ShareIcon } from 'lucide-react';
import toast from '@/lib/toast';
import Image from 'next/image';

export default function PublicProfile({ profile, links, appearance }) {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const supabase = createClientComponentClient();

  useEffect(() => {
    setMounted(true);
    setTheme(appearance?.theme || 'system');
  }, [appearance?.theme, setTheme]);

  if (!mounted) return null;

  const handleCopyLink = async (link) => {
    try {
      await navigator.clipboard.writeText(link);
      toast.success('Link copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  const handleLinkClick = async (linkId) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const device = {
        mobile: /iPhone|iPad|iPod|Android/i.test(navigator.userAgent),
        tablet: /(iPad|Android(?!.*Mobile))/i.test(navigator.userAgent),
        desktop: !(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent))
      };

      const deviceType = device.mobile ? 'mobile' : device.tablet ? 'tablet' : 'desktop';

      await supabase.from('link_clicks').insert({
        link_id: linkId,
        user_id: user?.id,
        device_type: deviceType,
        browser: navigator.userAgent,
        country: 'Unknown'
      });
    } catch (error) {
      console.error('Error logging click:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="w-full max-w-lg mx-auto px-4 py-6 sm:py-8">
        {/* Profile Header */}
        <div className="text-center space-y-4 mb-8">
          {profile.avatar_url && (
            <div className="relative w-24 h-24 mx-auto">
              <Image
                src={profile.avatar_url}
                alt={profile.full_name || profile.username}
                width={96}
                height={96}
                className="rounded-full object-cover w-full h-full"
                priority
              />
            </div>
          )}
          <h1 className="text-xl sm:text-2xl font-bold">{profile.full_name || profile.username}</h1>
          {profile.bio && (
            <p className="text-sm sm:text-base text-muted-foreground px-4">
              {profile.bio}
            </p>
          )}
        </div>

        {/* Links */}
        <div className="space-y-3">
          {links.map((link) => (
            <div
              key={link.id}
              className="relative group bg-card hover:bg-accent rounded-lg transition-all"
            >
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleLinkClick(link.id)}
                className="block p-4 sm:p-5"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {link.icon && (
                      <div className="flex-shrink-0 w-8 h-8">
                        <Image
                          src={link.icon}
                          alt=""
                          width={32}
                          height={32}
                          className="w-full h-full object-contain"
                          priority
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h2 className="text-sm sm:text-base font-medium truncate">
                        {link.title}
                      </h2>
                      {link.description && (
                        <p className="text-xs sm:text-sm text-muted-foreground truncate mt-0.5">
                          {link.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <ExternalLink className="w-4 h-4 text-muted-foreground" />
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleCopyLink(link.url);
                      }}
                      className="p-2 hover:bg-background/50 rounded-full transition-colors"
                      aria-label="Copy link"
                    >
                      <ShareIcon className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>
                </div>
              </a>
            </div>
          ))}

          {links.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No links available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
