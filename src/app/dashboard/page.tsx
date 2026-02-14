// 'use client';
// import { useSupabase } from '@/components/SupabaseProvider';
// import { supabase } from '@/lib/supabase';
// import { useRouter } from 'next/navigation';
// import { useEffect } from 'react';
// import BookmarkList from '@/components/BookmarkList';

// export default function Dashboard() {
//   const { user, loading } = useSupabase();
//   const router = useRouter();

//   useEffect(() => {
//     if (loading) return;
//     if (!user) router.push('/login');
//   }, [user, loading, router]);

//   const handleLogout = async () => {
//     await supabase.auth.signOut();
//     router.push('/login');
//   };

//   if (loading) return <div>Loading...</div>;
//   if (!user) return null;

//   return (
//     <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-6 max-w-5xl mx-auto">
//         <h1 className="text-3xl font-bold">Dashboard</h1>
//         <button
//           onClick={handleLogout}
//           className="bg-gray-700 hover:bg-gray-600 transition px-4 py-2 rounded cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-500"
//         >
//           Logout
//         </button>
//       </div>

//       {/* Main content container */}
//       <main className="max-w-5xl mx-auto bg-gray-800 rounded-lg p-6 shadow-lg">
//         <BookmarkList />
//       </main>
//     </div>
//   );
// }
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
    // Removed router.push('/login') here.
    // The useEffect above will handle redirecting to /login once user becomes null.
  };

  if (loading) return <div>Loading...</div>;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex items-center space-x-4">
          {/* User email display */}
          <span className="text-gray-400 text-sm truncate max-w-xs" title={user.email}>
            Signed in as: {user.email}
          </span>
          {/* Logout button */}
          <button
            onClick={handleLogout}
            className="bg-gray-700 hover:bg-gray-600 transition px-4 py-2 rounded cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main content container */}
      <main className="max-w-5xl mx-auto bg-gray-800 rounded-lg p-6 shadow-lg">
        <BookmarkList />
      </main>
    </div>
  );
}