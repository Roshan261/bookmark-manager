'use client';

import { useSupabase } from '@/components/SupabaseProvider';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import BookmarkList from '@/components/BookmarkList';

export default function Dashboard() {
  const { user, loading } = useSupabase();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) router.push('/login');
  }, [user, loading, router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 px-4 sm:px-6 lg:px-8 py-6">

  
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 max-w-5xl mx-auto">

        <h1 className="text-2xl sm:text-3xl font-bold text-center sm:text-left">
          Dashboard
        </h1>

        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">

          <span className="text-gray-400 text-xs sm:text-sm break-all text-center sm:text-right">
            Signed in as: {user.email}
          </span>

          <button
            onClick={handleLogout}
            className="w-full sm:w-auto bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded transition"
          >
            Logout
          </button>

        </div>

      </div>

     
      <main className="w-full max-w-5xl mx-auto bg-gray-800 rounded-lg p-4 sm:p-6 shadow-lg">
        <BookmarkList />
      </main>

    </div>
  );
}
