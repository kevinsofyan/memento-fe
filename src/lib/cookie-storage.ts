import Cookies from 'js-cookie';
import { PersistStorage } from 'zustand/middleware';

export function createCookieStorage<T>(): PersistStorage<T> {
  return {
    getItem: (name: string) => {
      const value = Cookies.get(name);
      return value ? JSON.parse(value) : null;
    },
    setItem: (name: string, value: any) => {
      Cookies.set(name, JSON.stringify(value), { expires: 7, sameSite: 'lax' });
    },
    removeItem: (name: string) => {
      Cookies.remove(name);
    },
  };
}

export const cookieStorage = createCookieStorage();

