// 'use client';
// import { createContext, useContext, useEffect, useState } from 'react';
// import { Session, User } from '@supabase/supabase-js';
// import { supabase } from '@/lib/supabase';

// const SupabaseContext = createContext<{
//   session: Session | null;
//   user: User | null;
//   loading: boolean;
// }>({ session: null, user: null, loading: true });

// export const useSupabase = () => useContext(SupabaseContext);

// export function SupabaseProvider({ children }: { children: React.ReactNode }) {
//   const [session, setSession] = useState<Session | null>(null);
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     supabase.auth.getSession().then(({ data: { session } }) => {
//       setSession(session);
//       setUser(session?.user ?? null);
//       setLoading(false);
//     });

//     const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
//       setSession(session);
//       setUser(session?.user ?? null);
//       setLoading(false);
//     });

//     return () => subscription.unsubscribe();
//   }, []);

//   return (
//     <SupabaseContext.Provider value={{ session, user, loading }}>
//       {children}
//     </SupabaseContext.Provider>
//   );
// }

'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

const SupabaseContext = createContext<{
  session: Session | null;
  user: User | null;
  loading: boolean;
}>({ session: null, user: null, loading: true });

export const useSupabase = () => useContext(SupabaseContext);

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          // Handle errors like "Invalid Refresh Token" by resetting to null
          console.warn('Auth error (likely invalid token):', error.message); // Optional: Remove this line if you don't want console logging
          setSession(null);
          setUser(null);
        } else {
          setSession(session);
          setUser(session?.user ?? null);
        }
      } catch (err) {
        // Catch unexpected errors (e.g., network issues)
        console.error('Unexpected auth error:', err);
        setSession(null);
        setUser(null);
      }
      setLoading(false);
    };
    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <SupabaseContext.Provider value={{ session, user, loading }}>
      {children}
    </SupabaseContext.Provider>
  );
}