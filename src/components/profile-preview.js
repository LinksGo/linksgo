'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { User } from 'lucide-react';
import Image from 'next/image';

export function ProfilePreview({ profile, links, customization }) {
  const getThemeClasses = () => {
    const baseClasses = cn(
      'relative overflow-hidden rounded-lg p-6 md:p-8'
    );

    switch (customization.theme) {
      case 'light':
        return cn(baseClasses, 'bg-white text-gray-900 border border-gray-200');
      case 'dark':
        return cn(baseClasses, 'bg-black text-gray-50 border border-gray-800 shadow-inner shadow-gray-800/50');
      case 'valentine':
        return cn(
          baseClasses, 
          'bg-gradient-to-br from-rose-500/30 via-pink-500/20 to-red-500/30 text-rose-50',
          'border-2 border-rose-300/50 dark:border-rose-500/50',
          'shadow-lg shadow-rose-500/20'
        );
      case 'neon':
        return cn(
          baseClasses, 
          'bg-black/90 text-cyan-400',
          'border-2 border-cyan-500',
          'shadow-[0_0_30px_rgba(6,182,212,0.5)]',
          'after:absolute after:inset-0 after:bg-gradient-to-br after:from-cyan-500/10 after:to-purple-500/10 after:opacity-50'
        );
      case 'metal':
        return cn(baseClasses, 'bg-gradient-to-br from-slate-700 to-zinc-800 text-slate-100 border border-slate-600 shadow-inner');
      case 'ajith':
        return cn(
          baseClasses,
          'relative text-white border border-blue-500/50',
          'before:absolute before:inset-0 before:bg-[url("/images/ajith.jpg")] before:bg-cover before:bg-[center_40%] before:bg-no-repeat before:z-0',
          'after:absolute after:inset-0 after:bg-black/30 after:z-0',
          '[&>*]:relative [&>*]:z-10'
        );
      case 'vijay':
        return cn(
          baseClasses,
          'relative text-white border border-yellow-500/50',
          'before:absolute before:inset-0 before:bg-[url("/images/vijay.jpg")] before:bg-cover before:bg-center before:z-0',
          'after:absolute after:inset-0 after:bg-black/30 after:z-0',
          '[&>*]:relative [&>*]:z-10'
        );
      case 'cyberpunk':
        return cn(
          baseClasses,
          'relative bg-black text-[#fcee0a]',
          'border-2 border-[#fcee0a]',
          'shadow-[0_0_30px_rgba(252,238,10,0.3)]',
          'after:absolute after:inset-0 after:bg-[linear-gradient(45deg,transparent_25%,rgba(252,238,10,0.1)_50%,transparent_75%)] after:bg-[length:250%_250%] after:animate-cyberpunk-grid',
          'before:absolute before:inset-0 before:bg-gradient-to-br before:from-[#00ffff]/10 before:to-[#ff0055]/10 before:opacity-50'
        );
      case 'psychopath':
        return cn(
          baseClasses,
          'psycho-gradient min-h-[200px]',
          'text-white',
          'shadow-lg shadow-white/10',
          'border border-white/20',
          'relative overflow-hidden'
        );
      case 'custom':
        return cn(
          baseClasses,
          'relative min-h-[200px] overflow-hidden',
          'text-white',
          'border border-white/20',
          'shadow-lg',
          customization.mobileBackgroundUrl && [
            'before:absolute before:inset-0 before:bg-cover before:bg-center before:z-0',
            'before:bg-[image:var(--mobile-bg)]',
            'after:absolute after:inset-0 after:bg-black/30 after:z-0',
            '[&>*]:relative [&>*]:z-10'
          ]
        );
      default:
        return cn(baseClasses, 'bg-background');
    }
  };

  const getLinkClasses = (index) => {
    const baseClasses = 'flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200';
    
    switch (customization.theme) {
      case 'light':
        return cn(baseClasses, 'bg-gray-50 hover:bg-gray-100 text-gray-900');
      case 'dark':
        return cn(baseClasses, 'bg-gray-950 hover:bg-gray-900 text-gray-100 border border-gray-800');
      case 'valentine':
        return cn(
          baseClasses,
          'bg-rose-950/20 hover:bg-rose-900/30',
          'text-rose-100 dark:text-rose-50',
          'border border-rose-300/30 hover:border-rose-300/50',
          'hover:shadow-[0_0_15px_rgba(244,63,94,0.2)]'
        );
      case 'neon':
        return cn(
          baseClasses,
          'bg-black/60 hover:bg-black/80',
          'text-cyan-400 hover:text-cyan-300',
          'border border-cyan-500/50 hover:border-cyan-400',
          'hover:shadow-[0_0_20px_rgba(34,211,238,0.3)]',
          'transition-all duration-300'
        );
      case 'metal':
        return cn(baseClasses, 'bg-slate-800/50 hover:bg-slate-700/50 text-slate-100 border border-slate-600/50');
      case 'ajith':
        return cn(
          baseClasses,
          'relative bg-black/30 text-white border border-blue-500/30',
          'hover:bg-black/40 hover:border-blue-400/50',
          'hover:shadow-[0_0_15px_rgba(37,99,235,0.2)]'
        );
      case 'vijay':
        return cn(
          baseClasses,
          'relative bg-black/30 text-white border border-yellow-500/30',
          'hover:bg-black/40 hover:border-yellow-400/50',
          'hover:shadow-[0_0_15px_rgba(234,179,8,0.2)]'
        );
      case 'cyberpunk':
        return cn(
          baseClasses,
          'relative bg-black/80 text-[#fcee0a] font-medium',
          'border border-[#fcee0a]/50 hover:border-[#fcee0a]',
          'hover:bg-[#fcee0a]/10',
          'hover:shadow-[0_0_20px_rgba(252,238,10,0.3)]',
          'hover:scale-[1.02] transition-all duration-300',
          'after:absolute after:inset-0 after:bg-[linear-gradient(45deg,transparent_25%,rgba(252,238,10,0.05)_50%,transparent_75%)] after:bg-[length:200%_200%] after:animate-cyberpunk-grid'
        );
      case 'psychopath':
        return cn(
          baseClasses,
          'psycho-gradient',
          'text-white',
          'border border-white/20',
          'hover:scale-[1.02]',
          'transition-all duration-300'
        );
      case 'custom':
        return cn(
          baseClasses,
          'bg-white/10 backdrop-blur-sm',
          'text-white',
          'border border-white/20',
          'hover:bg-white/20 hover:scale-[1.02]',
          'transition-all duration-300'
        );
      default:
        return cn(baseClasses, 'bg-muted hover:bg-muted/80 text-foreground');
    }
  };

  const containerStyle = {
    ...(customization.theme === 'custom' && customization.backgroundImage ? {
      backgroundImage: `url(${customization.backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    } : {}),
  };

  const overlayStyle = {
    ...(customization.theme === 'custom' && customization.backgroundImage ? {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: `rgba(0, 0, 0, ${(100 - customization.backgroundOpacity) / 100})`,
      backdropFilter: `blur(${customization.backgroundBlur}px)`,
    } : {}),
  };

  const mobileBackgroundStyle = customization.theme === 'custom' && customization.mobileBackgroundUrl ? {
    '--mobile-bg': `url(${customization.mobileBackgroundUrl})`
  } : {};

  return (
    <div className={getThemeClasses()} style={mobileBackgroundStyle}>
      {customization.theme === 'custom' && customization.backgroundImage && (
        <div style={overlayStyle} />
      )}
      
      <div className="relative z-10">
        <div className="flex flex-col items-center text-center space-y-6">
          <Avatar className="w-24 h-24 ring-2 ring-border">
            <AvatarImage
              src={profile.avatar_url}
              alt={profile.full_name || 'Profile'}
            />
            <AvatarFallback>
              <User className="w-12 h-12 text-muted-foreground" />
            </AvatarFallback>
          </Avatar>
          
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight">
              {profile.full_name || 'Your Name'}
            </h1>
            <p className="text-muted-foreground max-w-[35ch] mx-auto">
              {profile.bio || 'Your bio goes here'}
            </p>
          </div>
        </div>

        <div className={cn('mt-8 space-y-4')}>
          {links.map((link, index) => (
            <motion.div
              key={link.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                className={getLinkClasses(index)}
              >
                <div className="flex items-center space-x-4">
                  {link.icon && (
                    <div className="flex-shrink-0">
                      <Image
                        src={link.icon}
                        alt=""
                        width={32}
                        height={32}
                        className="rounded"
                      />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">
                      {link.title}
                    </p>
                    {link.description && (
                      <p className="truncate text-sm text-muted-foreground">
                        {link.description}
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
