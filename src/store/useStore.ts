import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { MonitoredUser, TwitterConfig } from '../types';

interface State {
  users: MonitoredUser[];
  twitterConfig: TwitterConfig | null;
  addUser: (user: MonitoredUser) => void;
  removeUser: (id: string) => void;
  toggleMonitor: (id: string, type: 'tweets' | 'retweets') => void;
  setTwitterConfig: (config: TwitterConfig) => void;
  getLatestTweet: (username: string) => Promise<string>;
}

export const useStore = create<State>()(
  persist(
    (set, get) => ({
      users: [],
      twitterConfig: null,
      addUser: (user) => set((state) => ({ users: [...state.users, user] })),
      removeUser: (id) => set((state) => ({ users: state.users.filter((u) => u.id !== id) })),
      toggleMonitor: (id, type) =>
        set((state) => ({
          users: state.users.map((user) =>
            user.id === id
              ? {
                  ...user,
                  [type === 'tweets' ? 'monitorTweets' : 'monitorRetweets']:
                    !user[type === 'tweets' ? 'monitorTweets' : 'monitorRetweets'],
                }
              : user
          ),
        })),
      setTwitterConfig: (config) => set({ twitterConfig: config }),
      getLatestTweet: async (username) => {
        const config = get().twitterConfig;
        if (!config) {
          throw new Error('Twitter API not configured');
        }

        try {
          const response = await fetch(`https://api.twitter.com/2/users/by/username/${username}`, {
            headers: {
              'Authorization': `Bearer ${config.apiKey}`,
            },
          });
          
          if (!response.ok) {
            throw new Error('Failed to fetch user');
          }

          const userData = await response.json();
          const userId = userData.data.id;

          const tweetsResponse = await fetch(
            `https://api.twitter.com/2/users/${userId}/tweets?max_results=1`,
            {
              headers: {
                'Authorization': `Bearer ${config.apiKey}`,
              },
            }
          );

          if (!tweetsResponse.ok) {
            throw new Error('Failed to fetch tweets');
          }

          const tweetsData = await tweetsResponse.json();
          return tweetsData.data[0]?.text || '无最新推文';
        } catch (error) {
          console.error('Error fetching tweet:', error);
          throw new Error('获取推文失败');
        }
      },
    }),
    {
      name: 'twitter-monitor-storage',
    }
  )
);