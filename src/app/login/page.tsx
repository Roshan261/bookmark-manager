// 'use client'
// import { supabase } from '@/lib/supabase';
// import { useSupabase } from '@/components/SupabaseProvider';
// import { useRouter } from 'next/navigation';
// import { useEffect } from 'react';

// export default function Login() {
//   const { user, loading } = useSupabase();
//   const router = useRouter();

//   useEffect(() => {
//     if (loading) return;
//     if (user) router.push('/dashboard');
//   }, [user, loading, router]);

//   const handleLogin = async () => {
//     await supabase.auth.signInWithOAuth({
//       provider: 'google',
//       options: { redirectTo: `${location.origin}/dashboard` },
//     });
//   };

//   if (loading) return <div>Loading...</div>;

//   return (
//     <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 px-6 text-center text-white">
//       <h1 className="text-4xl font-extrabold mb-4">
//         Bookmark Manager
//       </h1>
//       <p className="mb-8 max-w-md text-gray-300">
//         Save and manage your bookmarks privately.<br />
//         Sign in with Google to get started.
//       </p>
//       <button
//         onClick={handleLogin}
//         className="bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-400 text-white font-semibold rounded px-6 py-3 transition cursor-pointer shadow-md hover:brightness-110"
//       >
//         Sign in with Google
//       </button>
//     </div>
//   );
// }

'use client'
import { supabase } from '@/lib/supabase';
import { useSupabase } from '@/components/SupabaseProvider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Login() {
  const { user, loading } = useSupabase();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (user) router.push('/dashboard');
  }, [user, loading, router]);

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { 
        redirectTo: `${location.origin}/dashboard`,
        queryParams: { prompt: 'select_account' },  // <-- This forces account chooser
      },
    });
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 px-6 text-center text-white">
      <h1 className="text-4xl font-extrabold mb-4">
        Bookmark Manager
      </h1>
      <p className="mb-8 max-w-md text-gray-300">
        Save and manage your bookmarks privately.<br />
        Sign in with Google to get started.
      </p>
      <button
        onClick={handleLogin}
        className="bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-400 text-white font-semibold rounded px-6 py-3 transition cursor-pointer shadow-md hover:brightness-110"
      >
        Sign in with Google
      </button>
    </div>
  );
}