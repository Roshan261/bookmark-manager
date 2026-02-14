
# 🚀 Smart Bookmark App

A full-stack, realtime bookmark manager built with **Next.js (App Router), Supabase, and Tailwind CSS**.

This project demonstrates authentication, realtime database subscriptions, responsive UI design, and production deployment workflows.

---

## 🌐 Live Demo

🔗 [https://bookmark-manager-jruo.vercel.app/]

---

## ✨ Features

* 🔐 Secure user authentication (Supabase Auth)
* 📌 Add & delete bookmarks
* ⚡ Realtime sync across multiple tabs
* 📱 Fully responsive UI (mobile → desktop)
* 🧠 Per-user data isolation (Row Level Security)
* 🚀 Deployed on Vercel with automatic CI/CD

---

## 🛠 Tech Stack

**Frontend**

* Next.js 14 (App Router)
* React (Client Components)
* TypeScript
* Tailwind CSS

**Backend / Database**

* Supabase (Postgres + Auth + Realtime)
* Row Level Security (RLS)

**Deployment**

* Vercel (connected to GitHub)

---

## 🧩 Architecture Overview

* Supabase handles authentication and database
* Each user’s bookmarks are protected using RLS policies
* Realtime channels subscribe to Postgres changes
* React hooks manage subscription lifecycle
* Tailwind handles responsive UI scaling

---

# 🐛 Challenges Faced & How They Were Solved


## 1️⃣ Realtime WebSocket kept timing out

### Issue

```
WebSocket is closed before the connection is established
REALTIME STATUS: TIMED_OUT
```

### Root Cause

Using the new `sb_publishable_` key caused unstable realtime channel joins in this setup.

### Solution

Switched to the classic Supabase **anon JWT key** (`eyJ...`) in `.env.local`.

```
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

Restarted the dev server.

### Result

Realtime connection became stable.

---

## 2️⃣ Realtime subscribed then immediately closed

### Issue

```
SUBSCRIBED → CLOSED
```

### Root Cause

React `useEffect` depended on the full `user` object. Since objects change reference, React re-ran the effect and unsubscribed the channel repeatedly.

### Solution

Used a stable primitive dependency:

```ts
const userId = user?.id
```

```ts
useEffect(() => {
  ...
}, [userId])
```

Proper cleanup:

```ts
return () => {
  channel.unsubscribe()
}
```

### Result

Realtime subscription lifecycle became stable.

---

## 3️⃣ DELETE events not syncing across tabs

### Issue

Insert worked in realtime, but delete did not.

### Root Cause

Postgres DELETE events do not include full row data by default, so the filter `user_id=eq.<id>` could not match.

### Solution

Enabled full replica identity:

```sql
ALTER TABLE public.bookmarks REPLICA IDENTITY FULL;
```

### Result

DELETE events synced instantly across tabs.

---

## 4️⃣ UI not fully responsive initially

### Issue

Layout overflow and inconsistent scaling on smaller screens.

### Solution

Used responsive Tailwind patterns:

```html
max-w-5xl mx-auto
flex flex-col sm:flex-row
w-full sm:w-auto
break-all
overflow-x-hidden
```

### Result

Clean scaling across:

* Mobile
* Tablet
* Desktop

---

# 🔐 Security Considerations

* Row Level Security (RLS) enabled on `bookmarks` table
* Users can only access their own bookmarks
* Supabase Auth handles session tokens securely
* No sensitive keys exposed to frontend

---

# 🧠 Lessons Learned

* Importance of stable React dependencies
* How Supabase realtime works internally
* How Postgres replica identity affects delete events
* Managing WebSocket lifecycle in React
* Debugging distributed systems behavior
* Building production-ready responsive UI

---

# 📦 Installation & Setup

Clone the repository:

```bash
git clone https://github.com/Roshan261/bookmark-manager.git
cd bookmark-manager
npm install
```

Create `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=your_SUPABASE_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

Run locally:

```bash
npm run dev
```

Open:

```
http://localhost:3000
```

---

# 🚀 Deployment

* Connected GitHub to Vercel
* Automatic deployment on push to `main`
* Environment variables configured in Vercel dashboard

---

# 👨‍💻 Author

**Roshan Ahmed**

GitHub: [https://github.com/Roshan261]
Email: [i15roshanza@gmail.com]
---

# ⭐ Why This Project Matters

This project demonstrates:

* Full-stack integration
* Realtime architecture
* Authentication flows
* Debugging production-like issues
* Clean UI/UX implementation
* Deployment pipeline understanding

---



