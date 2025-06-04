// pages/logout.tsx
import { useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useRouter } from 'next/router';

export default function Logout() {
  const router = useRouter();

  useEffect(() => {
    const logout = async () => {
      await supabase.auth.signOut();
      router.push('/login');
    };
    logout();
  }, [router]);

  return <p className="p-4">Logging out...</p>;
}
