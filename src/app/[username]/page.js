'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import {
  Card,
  CardBody,
  Avatar,
  Button,
  Link,
  Tooltip,
} from "@nextui-org/react"
import { FaInstagram, FaTwitter, FaGithub, FaLinkedin } from 'react-icons/fa'
import useUserStore from '@/store/userStore'
import Image from 'next/image'

const socialPlatforms = {
  twitter: <FaTwitter className="text-xl" />,
  instagram: <FaInstagram className="text-xl" />,
  github: <FaGithub className="text-xl" />,
  linkedin: <FaLinkedin className="text-xl" />,
}

const validateUrl = (url) => {
  if (!url) return '';
  
  try {
    // Try to create a URL object to validate
    const urlObject = new URL(url);
    return urlObject.href;
  } catch {
    // If URL is invalid, try adding https://
    try {
      const urlWithProtocol = new URL(`https://${url}`);
      return urlWithProtocol.href;
    } catch {
      console.error('Invalid URL:', url);
      return '';
    }
  }
};

export default function UserLinksPage({ params }) {
  const { username } = params;
  const userData = useUserStore((state) => state.userData);
  const { publicProfiles, setPublicProfile } = useUserStore();
  const { theme } = useTheme();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // If viewing current user's profile
        if (userData.username === username) {
          // Don't need to set public profile for current user
          setLoading(false);
          return;
        }

        // Check if we have cached profile
        if (publicProfiles[username]) {
          setLoading(false);
          return;
        }

        // Simulating API call with mock data for now
        const mockProfile = {
          name: "John Doe",
          username: username,
          bio: "Welcome to my links page!",
          backgroundImage: "",
          backgroundBlur: true,
          socialLinks: {
            twitter: "twitter.com/johndoe",
            instagram: "instagram.com/johndoe",
            github: "github.com/johndoe",
            linkedin: "linkedin.com/in/johndoe"
          },
          links: [
            { id: 1, title: "My Blog", url: "blog.example.com", active: true },
            { id: 2, title: "Portfolio", url: "portfolio.example.com", active: true }
          ]
        };

        setPublicProfile(username, mockProfile);
        setLoading(false);
      } catch (error) {
        console.error('Error loading profile:', error);
        setError("Failed to load profile");
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [username, userData.username, publicProfiles, setPublicProfile]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-t-2 border-b-2 border-primary-600 rounded-full animate-spin"></div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center">
      <Card>
        <CardBody>
          <p className="text-center text-default-600">{error}</p>
        </CardBody>
      </Card>
    </div>
  );

  // Get the correct profile data
  const profile = userData.username === username ? userData : publicProfiles[username];
  
  if (!profile) return (
    <div className="min-h-screen flex items-center justify-center">
      <Card>
        <CardBody>
          <p className="text-center text-default-600">Profile not found</p>
        </CardBody>
      </Card>
    </div>
  );

  const handleLinkClick = async (link, active) => {
    if (!active) return;
    const validUrl = validateUrl(link.url);
    if (validUrl) {
      // Increment click count locally
      useUserStore.getState().incrementLinkClicks(link.id);
      
      // If it's a one-time link, deactivate it
      if (link.isOneTime) {
        useUserStore.getState().updateLink(link.id, { active: false });
      }
      
      // Send click event to API
      try {
        await fetch('/api/links/click', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            linkId: link.id,
            isOneTime: link.isOneTime 
          })
        });
      } catch (error) {
        console.error('Error recording click:', error);
      }
      
      window.open(validUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleSocialClick = (platform, url) => {
    if (!url) return;
    let validUrl = validateUrl(url);
    if (!validUrl) {
      // Try platform-specific URL formatting
      switch (platform) {
        case 'twitter':
          validUrl = `https://twitter.com/${url.replace('@', '')}`;
          break;
        case 'instagram':
          validUrl = `https://instagram.com/${url.replace('@', '')}`;
          break;
        case 'github':
          validUrl = `https://github.com/${url.replace('@', '')}`;
          break;
        case 'linkedin':
          validUrl = url.includes('linkedin.com') ? `https://${url}` : `https://linkedin.com/in/${url}`;
          break;
        default:
          validUrl = `https://${url}`;
      }
    }
    window.open(validUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen w-full">
      <div 
        className={`relative min-h-screen w-full ${
          !profile.backgroundImage ? 'bg-black' : 'bg-gradient-to-b from-primary-100 to-primary-50 dark:from-primary-900 dark:to-primary-950'
        }`}
        style={profile.backgroundImage ? {
          backgroundImage: `url('${profile.backgroundImage}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        } : undefined}
      >
        <div className={`absolute inset-0 ${
          profile.backgroundImage 
            ? `bg-black/30 ${profile.backgroundBlur ? 'backdrop-blur-sm' : ''}`
            : ''
        }`} />
        <div className="relative z-10 container mx-auto px-4 py-8 flex flex-col items-center">
          <div className="w-full max-w-3xl mx-auto space-y-6">
            {/* Profile Header */}
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold text-white">
                {profile.name || profile.username}
              </h1>
              {profile.bio && (
                <p className="text-lg text-white/90">
                  {profile.bio}
                </p>
              )}
            </div>

            {/* Social Links */}
            <div className="flex justify-center gap-4">
              {Object.entries(profile.socialLinks || {}).map(([platform, url]) => {
                if (!url) return null;
                return (
                  <Button
                    key={platform}
                    isIconOnly
                    variant="flat"
                    className="text-white hover:text-primary-200 transition-colors"
                    onClick={() => handleSocialClick(platform, url)}
                  >
                    {socialPlatforms[platform]}
                  </Button>
                );
              })}
            </div>

            {/* Links */}
            <div className="space-y-4">
              {(profile.links || []).map((link) => (
                <Button
                  key={link.id}
                  color="default"
                  variant="flat"
                  className={`w-full h-auto min-h-[3rem] p-4 rounded-lg bg-white/10 backdrop-blur-md 
                    hover:bg-white/20 transition-all transform hover:scale-[1.02]
                    text-white text-center font-medium
                    ${!link.active && 'opacity-50'}`}
                  onClick={() => handleLinkClick(link, link.active)}
                  disabled={!link.active}
                >
                  {link.title}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
