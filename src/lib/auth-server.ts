import { cookies } from 'next/headers';
import { User } from '@/types/auth';

export async function getServerAuthToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get('memento-auth-storage');
  
  if (!authCookie) return null;
  
  try {
    const authData = JSON.parse(authCookie.value);
    return authData?.state?.access_token || null;
  } catch (e) {
    return null;
  }
}

export async function getServerUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get('user-storage');
  
  if (!userCookie) return null;
  
  try {
    const userData = JSON.parse(userCookie.value);
    return userData?.state?.user || null;
  } catch (e) {
    return null;
  }
}

