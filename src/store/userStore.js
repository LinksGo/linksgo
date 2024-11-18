'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useUserStore = create(
  persist(
    (set) => ({
      userData: {
        initialized: false,
        username: '',
        name: '',
        bio: '',
        avatar: '',
        backgroundImage: '',
        backgroundBlur: true,
        socialLinks: {
          instagram: '',
          twitter: '',
          github: '',
          linkedin: ''
        },
        links: []
      },
      publicProfiles: {}, // Store for caching other users' profiles
      updateUserData: (data) => {
        // Create a clean copy of the data to prevent circular references
        const cleanData = {
          name: data.name || '',
          username: data.username || '',
          bio: data.bio || '',
          backgroundImage: data.backgroundImage || '',
          backgroundBlur: data.backgroundBlur ?? true,
          socialLinks: {
            instagram: data.socialLinks?.instagram || '',
            twitter: data.socialLinks?.twitter || '',
            github: data.socialLinks?.github || '',
            linkedin: data.socialLinks?.linkedin || ''
          }
        };

        set((state) => ({
          userData: { 
            ...state.userData, 
            ...cleanData,
            // Preserve existing links if not explicitly provided
            links: Array.isArray(data.links) ? data.links : state.userData.links
          }
        }));
      },
      addLink: (link) => set((state) => {
        const newLink = {
          id: Date.now(), // Use timestamp as a simple unique ID
          title: link.title || '',
          url: link.url || '',
          description: link.description || '',
          clicks: 0,
          active: true,
          createdAt: new Date()
        };
        return {
          userData: {
            ...state.userData,
            links: [...(state.userData.links || []), newLink]
          }
        };
      }),
      updateLink: (linkId, updatedLink) => set((state) => ({
        userData: {
          ...state.userData,
          links: (state.userData.links || []).map(link => 
            link.id === linkId ? { ...link, ...updatedLink } : link
          )
        }
      })),
      deleteLink: (linkId) => set((state) => ({
        userData: {
          ...state.userData,
          links: (state.userData.links || []).filter(link => link.id !== linkId)
        }
      })),
      incrementLinkClicks: (linkId) => set((state) => {
        const now = new Date();
        const oneDayAgo = new Date(now - 24 * 60 * 60 * 1000);
        const sevenDaysAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
        const thirtyDaysAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);

        return {
          userData: {
            ...state.userData,
            links: (state.userData.links || []).map(link => {
              if (link.id === linkId) {
                // Initialize analytics if they don't exist
                const clickHistory = link.clickHistory || [];
                clickHistory.push(now.toISOString());

                // Calculate time-based metrics
                const last24h = clickHistory.filter(date => new Date(date) > oneDayAgo).length;
                const last7days = clickHistory.filter(date => new Date(date) > sevenDaysAgo).length;
                const last30days = clickHistory.filter(date => new Date(date) > thirtyDaysAgo).length;

                return {
                  ...link,
                  clicks: (link.clicks || 0) + 1,
                  clickHistory,
                  last24h,
                  last7days,
                  last30days
                };
              }
              return link;
            })
          }
        };
      }),
      setPublicProfile: (username, profile) => set((state) => ({
        publicProfiles: {
          ...state.publicProfiles,
          [username]: {
            ...profile,
            links: Array.isArray(profile.links) ? profile.links : []
          }
        }
      }))
    }),
    {
      name: 'user-storage',
      version: 1,
    }
  )
)

export default useUserStore
