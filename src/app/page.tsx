'use client';
import { useSupabase } from '@/components/SupabaseProvider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Page() {
  const { user, loading } = useSupabase();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (user) router.push('/dashboard');
    else router.push('/login');
  }, [user, loading, router]);

  return <div>Loading...</div>;
}
