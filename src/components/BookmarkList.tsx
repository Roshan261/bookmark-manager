'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useSupabase } from './SupabaseProvider'

interface Bookmark {
  id: string
  title: string
  url: string
  user_id: string
  created_at: string
}

export default function BookmarkList() {
  const { user } = useSupabase()
  const userId = user?.id

  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')

  // Fetch user bookmarks
  const fetchBookmarks = useCallback(async (uid: string) => {
    const { data, error } = await supabase
      .from('bookmarks')
      .select('*')
      .eq('user_id', uid)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('fetchBookmarks error:', error.message)
      return
    }

    setBookmarks(data ?? [])
  }, [])

  useEffect(() => {
    if (!userId) return

    fetchBookmarks(userId)

    // Subscribe to realtime changes filtered by user_id
    const channel = supabase
      .channel(`bookmarks-${userId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'bookmarks', filter: `user_id=eq.${userId}` },
        () => fetchBookmarks(userId)
      )
      .subscribe((status) => {
        console.log('REALTIME STATUS:', status)
      })

    return () => {
      channel.unsubscribe()
    }
  }, [userId, fetchBookmarks])

  // Add Bookmark handler
  const addBookmark = async () => {
    if (!userId || !title || !url) return

    const { error } = await supabase.from('bookmarks').insert({
      user_id: userId,
      title,
      url,
    })

    if (error) {
      console.error('addBookmark error:', error.message)
      return
    }

    setTitle('')
    setUrl('')
    fetchBookmarks(userId)
  }

  // Delete bookmark handler
  const deleteBookmark = async (id: string) => {
    if (!userId) return

    const { error } = await supabase.from('bookmarks').delete().eq('id', id)

    if (error) {
      console.error('deleteBookmark error:', error.message)
      return
    }

    fetchBookmarks(userId)
  }

  return (
    <div className="max-w-4xl mx-auto bg-gray-800 p-6 rounded-lg shadow-md text-gray-100">
      {/* Form for adding bookmarks */}
      <div className="flex gap-3 items-center mb-6">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="flex-1 px-3 py-2 rounded border border-gray-600 bg-gray-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-gray-200"
        />
        <input
          type="url"
          placeholder="URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-1 px-3 py-2 rounded border border-gray-600 bg-gray-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-gray-200"
        />
        <button
          onClick={addBookmark}
          className="bg-green-600 hover:bg-green-700 px-5 py-2 rounded text-white font-semibold cursor-pointer transition focus:outline-none focus:ring-4 focus:ring-green-400"
        >
          Add Bookmark
        </button>
      </div>

      {/* Bookmarks list */}
      <ul className="space-y-3 max-h-[60vh] overflow-y-auto">
        {bookmarks.length === 0 ? (
          <li className="text-center text-gray-400">No bookmarks yet.</li>
        ) : (
          bookmarks.map((bookmark) => (
            <li
              key={bookmark.id}
              className="flex justify-between items-center bg-gray-700 p-4 rounded shadow"
            >
              <a
                href={bookmark.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-400 hover:underline break-words max-w-[80%]"
              >
                {bookmark.title}
              </a>
              <button
                onClick={() => deleteBookmark(bookmark.id)}
                className="bg-red-600 hover:bg-red-700 text-white rounded px-3 py-1 text-sm cursor-pointer transition focus:outline-none focus:ring-2 focus:ring-red-400"
                aria-label={`Delete bookmark titled ${bookmark.title}`}
              >
                Delete
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  )
}