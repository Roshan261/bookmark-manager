'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useSupabase } from './SupabaseProvider';

interface Bookmark {
  id: string;
  title: string;
  url: string;
  user_id: string;
  created_at: string;
}

export default function BookmarkList() {
  const { user } = useSupabase();
  const userId = user?.id;

  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');

  const fetchBookmarks = useCallback(async (uid: string) => {
    const { data, error } = await supabase
      .from('bookmarks')
      .select('*')
      .eq('user_id', uid)
      .order('created_at', { ascending: false });

    if (error) {
      console.error(error.message);
      return;
    }

    setBookmarks(data ?? []);
  }, []);

  useEffect(() => {
    if (!userId) return;

    fetchBookmarks(userId);

    const channel = supabase
      .channel(`bookmarks-${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookmarks',
          filter: `user_id=eq.${userId}`,
        },
        () => fetchBookmarks(userId)
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [userId, fetchBookmarks]);

  const addBookmark = async () => {
    if (!title || !url || !userId) return;

    const { error } = await supabase.from('bookmarks').insert({
      title,
      url,
      user_id: userId,
    });

    if (!error) {
      setTitle('');
      setUrl('');
      fetchBookmarks(userId);
    }
  };

  const deleteBookmark = async (id: string) => {
    if (!userId) return;

    await supabase.from('bookmarks').delete().eq('id', id);
    fetchBookmarks(userId);
  };

  return (
    <div className="w-full text-gray-100">

      {/* Form */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">

        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 rounded border border-gray-600 bg-gray-900"
        />

        <input
          type="url"
          placeholder="URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full px-3 py-2 rounded border border-gray-600 bg-gray-900"
        />

        <button
          onClick={addBookmark}
          className="w-full sm:w-auto bg-green-600 hover:bg-green-700 px-5 py-2 rounded"
        >
          Add Bookmark
        </button>

      </div>

      {/* List */}
      <ul className="space-y-3">

        {bookmarks.length === 0 ? (
          <li className="text-center text-gray-400">
            No bookmarks yet.
          </li>
        ) : (
          bookmarks.map((bookmark) => (
            <li
              key={bookmark.id}
              className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 bg-gray-700 p-4 rounded"
            >

              <a
                href={bookmark.url}
                target="_blank"
                className="text-indigo-400 break-all"
              >
                {bookmark.title}
              </a>

              <button
                onClick={() => deleteBookmark(bookmark.id)}
                className="w-full sm:w-auto bg-red-600 hover:bg-red-700 px-3 py-1 rounded"
              >
                Delete
              </button>

            </li>
          ))
        )}

      </ul>

    </div>
  );
}
