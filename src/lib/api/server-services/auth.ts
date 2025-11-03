import { serverApiClient } from '../server-client';
import { User } from '@/types/auth';

export const authServerService = {
  me: async (): Promise<User | null> => {
    try {
      return await serverApiClient.get<User>('/auth/me');
    } catch (error) {
      console.error('Failed to fetch user:', error);
      return null;
    }
  },
};

