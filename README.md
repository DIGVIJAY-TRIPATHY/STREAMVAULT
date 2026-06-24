<div align="center">

<img src="https://img.shields.io/badge/StreamVault-v1.0.0-6366f1?style=for-the-badge&logo=youtube&logoColor=white" alt="StreamVault" />

# 🎬 StreamVault

### Full-stack video sharing platform built with the MERN stack.
### Features JWT authentication with silent token refresh, Cloudinary video/image uploads,
### React Query for server state, and a complete creator studio dashboard.

<br/>

[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://mongodb.com)
[![Redux](https://img.shields.io/badge/Redux-Toolkit-764ABC?style=flat-square&logo=redux&logoColor=white)](https://redux-toolkit.js.org)
[![React Query](https://img.shields.io/badge/TanStack-Query_v5-FF4154?style=flat-square&logo=reactquery&logoColor=white)](https://tanstack.com/query)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-Media_CDN-3448C5?style=flat-square&logo=cloudinary&logoColor=white)](https://cloudinary.com)

<br/>

<!-- [**Live Demo**](https://streamvault.vercel.app) &nbsp;·&nbsp; -->
[**Backend Repo**](https://github.com/DIGVIJAY-TRIPATHY/STREAMVAULT-BACKEND) &nbsp;·&nbsp;
[**Report a Bug**](https://github.com/digvijay-tripathy/streamvault/issues) &nbsp;·&nbsp;
[**Request Feature**](https://github.com/digvijay-tripathy/streamvault/issues)

<br/>

<img src="https://img.shields.io/github/stars/digvijay-tripathy/streamvault?style=social" />
&nbsp;
<img src="https://img.shields.io/github/forks/digvijay-tripathy/streamvault?style=social" />

</div>

---

## 📸 Screenshots

<div align="center">

| Home Feed | Watch Page | Creator Studio |
|:---------:|:----------:|:--------------:|
| ![Home](https://placehold.co/380x220/0f172a/6366f1?text=Home+Feed&font=montserrat) | ![Watch](https://placehold.co/380x220/0f172a/6366f1?text=Watch+Page&font=montserrat) | ![Studio](https://placehold.co/380x220/0f172a/6366f1?text=Creator+Studio&font=montserrat) |

| Login | Channel Profile | Playlists |
|:-----:|:---------------:|:---------:|
| ![Login](https://placehold.co/380x220/0f172a/6366f1?text=Login&font=montserrat) | ![Channel](https://placehold.co/380x220/0f172a/6366f1?text=Channel+Profile&font=montserrat) | ![Playlist](https://placehold.co/380x220/0f172a/6366f1?text=Playlists&font=montserrat) |

</div>

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 🔐 Authentication
- JWT access + refresh tokens via **httpOnly cookies**
- Silent token refresh on 401 — users never get logged out unexpectedly
- Protected and public-only route guards
- Session restored on page refresh via `/current-user`

### 🎥 Video
- Upload video + thumbnail (Multer → Cloudinary)
- Real-time upload progress bar
- Custom HTML5 video player with full keyboard controls
- Toggle publish / draft status
- Edit title, description, thumbnail

### 💬 Engagement
- Paginated comments with inline edit & delete
- Polymorphic like system (videos, comments, tweets)
- Optimistic UI updates with automatic rollback on failure

</td>
<td width="50%">

### 📺 Channel & Subscriptions
- Public channel profile with cover image & stats
- Subscribe / unsubscribe with live count update
- Subscription feed — latest from channels you follow

### 📋 Playlists & Community
- Create, edit, delete playlists
- Add / remove videos from any playlist on the watch page
- Community posts (tweets) — text updates on your channel

### 📊 Creator Studio
- Dashboard with total views, subscribers, likes, video count
- Video management table — toggle publish, edit, delete
- Account settings — update profile, change password, swap avatar & cover image

</td>
</tr>
</table>

---

## 🏗️ Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| **React 18** | UI library — concurrent rendering, Suspense |
| **Vite 6** | Build tool — instant HMR, optimised production bundles |
| **Tailwind CSS v4** | Styling — CSS-first config, no `tailwind.config.js` needed |
| **Redux Toolkit** | Client state — auth session + UI flags only |
| **TanStack Query v5** | Server state — caching, pagination, optimistic updates |
| **Axios** | HTTP client — interceptors handle auth + silent refresh |
| **React Router v6** | Routing — nested routes + layout shells |
| **React Hook Form + Yup** | Forms — uncontrolled inputs + schema validation |
| **react-hot-toast** | Notifications — success/error feedback on every mutation |
| **lucide-react** | Icons — tree-shakeable stroke-based icon set |
| **dayjs** | Dates — "3 days ago" relative timestamps |

### Backend *(separate repo)*
| Technology | Purpose |
|-----------|---------|
| **Node.js + Express** | REST API server |
| **MongoDB + Mongoose** | Database + ODM with aggregation pipelines |
| **JWT** | Access tokens (15m) + refresh tokens (7d) |
| **Multer + Cloudinary** | File upload pipeline for video and images |
| **bcrypt** | Password hashing |

---

## 🗂️ Project Structure

```
streamvault/
├── public/
│   └── favicon.svg
└── src/
    ├── api/                    # Every Axios call grouped by resource
    │   ├── axiosInstance.js    # Base client + 401 silent-refresh interceptor
    │   ├── authApi.js
    │   ├── userApi.js
    │   ├── videoApi.js
    │   ├── commentApi.js
    │   ├── likeApi.js
    │   ├── playlistApi.js
    │   ├── subscriptionApi.js
    │   ├── tweetApi.js
    │   └── dashboardApi.js
    ├── app/
    │   ├── store.js            # Redux store — auth + ui slices only
    │   └── queryClient.js      # Shared TanStack QueryClient
    ├── features/
    │   ├── auth/authSlice.js
    │   └── ui/uiSlice.js
    ├── components/
    │   ├── common/             # Button, Input, Modal, Skeleton, Loader...
    │   ├── layout/             # Header, Sidebar, MainLayout, AuthLayout
    │   ├── video/              # VideoCard, VideoPlayer, VideoActions...
    │   ├── comment/            # CommentList, CommentItem, CommentForm
    │   ├── channel/            # ChannelHeader, SubscribeButton, ChannelTabs
    │   ├── playlist/           # PlaylistCard, AddToPlaylistModal
    │   ├── tweet/              # TweetCard, TweetForm, TweetList
    │   ├── dashboard/          # StatsCard, VideoTable
    │   └── settings/           # UpdateAccountForm, ChangePasswordForm...
    ├── pages/                  # One file per route
    │   ├── Home.jsx
    │   ├── WatchVideo.jsx
    │   ├── ChannelProfile.jsx
    │   ├── Dashboard.jsx
    │   └── ...13 pages total
    ├── hooks/                  # useAuth, useDebounce, useInfiniteScroll
    ├── routes/AppRoutes.jsx    # Full route table with lazy loading
    ├── utils/                  # formatTime, formatViews, formatDate, constants
    ├── styles/index.css        # Tailwind v4 @import + @theme config
    ├── App.jsx
    └── main.jsx
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js `v18+`
- npm `v9+`
- The [backend server](https://github.com/digvijay-tripathy/streamvault-backend) running on `http://localhost:8000`

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/digvijay-tripathy/streamvault.git
cd streamvault
```

**2. Install dependencies**
```bash
npm install
```

**3. Set up environment variables**
```bash
cp .env.sample .env.local
```

```env
# .env.local
# Only needed for production builds
# In development, Vite proxy handles all /api requests
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

**4. Start the development server**
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

> **Note:** The Vite dev server proxies all `/api` requests to `http://localhost:8000` automatically — no CORS issues in development.

---

## 📡 API Reference

This frontend consumes the StreamVault REST API. All endpoints require authentication via httpOnly cookies unless marked **Public**.

<details>
<summary><b>👤 User Endpoints</b></summary>

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/users/register` | Public | Register with avatar + cover image |
| `POST` | `/users/login` | Public | Login → sets access + refresh cookies |
| `POST` | `/users/logout` | 🔒 | Clear cookies + invalidate refresh token |
| `POST` | `/users/refresh-token` | Cookie | Silent token rotation |
| `GET` | `/users/current-user` | 🔒 | Get logged-in user (used on app boot) |
| `PATCH` | `/users/update-account` | 🔒 | Update name / email |
| `PATCH` | `/users/avatar` | 🔒 | Update avatar image |
| `PATCH` | `/users/cover-image` | 🔒 | Update cover image |
| `GET` | `/users/c/:username` | 🔒 | Public channel profile + subscriber stats |
| `GET` | `/users/history` | 🔒 | Watch history |

</details>

<details>
<summary><b>🎥 Video Endpoints</b></summary>

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/videos` | 🔒 | Paginated feed — `page, limit, query, sortBy, sortType, userId` |
| `POST` | `/videos` | 🔒 | Upload video + thumbnail (multipart) |
| `GET` | `/videos/:videoId` | 🔒 | Single video — increments views + adds to history |
| `PATCH` | `/videos/:videoId` | 🔒 | Edit title / description / thumbnail |
| `DELETE` | `/videos/:videoId` | 🔒 | Hard delete (owner only) |
| `PATCH` | `/videos/toggle/publish/:videoId` | 🔒 | Toggle draft ↔ published |

</details>

<details>
<summary><b>💬 Comment, ❤️ Like, 📋 Playlist, 🔔 Subscription, 🐦 Tweet, 📊 Dashboard</b></summary>

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/comments/:videoId` | Paginated comments |
| `POST` | `/comments/:videoId` | Add comment |
| `PATCH` | `/comments/c/:commentId` | Edit comment (owner) |
| `DELETE` | `/comments/c/:commentId` | Delete comment (owner) |
| `POST` | `/likes/toggle/v/:videoId` | Toggle video like |
| `POST` | `/likes/toggle/c/:commentId` | Toggle comment like |
| `POST` | `/likes/toggle/t/:tweetId` | Toggle tweet like |
| `GET` | `/likes/videos` | All liked videos |
| `POST` | `/playlist` | Create playlist |
| `GET` | `/playlist/:playlistId` | Playlist with videos |
| `PATCH` | `/playlist/add/:videoId/:playlistId` | Add video to playlist |
| `PATCH` | `/playlist/remove/:videoId/:playlistId` | Remove video from playlist |
| `GET` | `/playlist/user/:userId` | User's playlists |
| `POST` | `/subscriptions/c/:channelId` | Toggle subscribe |
| `GET` | `/subscriptions/u/:subscriberId` | Subscribed channels |
| `POST` | `/tweets` | Create community post |
| `GET` | `/tweets/user/:userId` | User's posts |
| `GET` | `/dashboard/stats` | Channel aggregate stats |
| `GET` | `/dashboard/videos` | Channel videos (incl. drafts) |

</details>

---

## 🏛️ Architecture

### State Management

```
┌─────────────────────────────────────────────┐
│              React Components               │
└──────────┬────────────────────┬─────────────┘
           │ useSelector        │ useQuery
           ▼ useDispatch        ▼ useMutation
┌──────────────────┐  ┌────────────────────────┐
│  Redux Toolkit   │  │   TanStack Query Cache  │
│  (client state)  │  │   (server state)        │
│                  │  │                         │
│  • authSlice     │  │  • ['videos', filters]  │
│    user session  │  │  • ['video', id]        │
│    isAuthenticated│  │  • ['comments', id]    │
│                  │  │  • ['channel', username]│
│  • uiSlice       │  │  • ['playlists', uid]  │
│    sidebarOpen   │  │  • ['dashboardStats']   │
│    theme         │  │  • ...                  │
└──────────────────┘  └────────────────────────┘
```

> **Rule:** Server data **never** goes into Redux. Redux holds session + UI state only.

### Authentication Flow

```
Login → httpOnly cookies set by server
     ↓
App boots → GET /current-user → dispatch(setUser)
     ↓
Protected route renders
     ↓
API call with expired accessToken → 401
     ↓
Axios interceptor → POST /refresh-token
     ↓                        ↓
  Success               Failure (refresh expired)
  Retry original         dispatch(clearUser)
  request                navigate('/login')
     ↓
  User never noticed
```

---

## 📜 Available Scripts

```bash
npm run dev        # Start development server on :5173
npm run build      # Production build → dist/
npm run preview    # Preview production build locally
npm run lint       # Run ESLint
npm run format     # Run Prettier
npm run test       # Run Vitest unit tests
npm run coverage   # Test coverage report
```

---

## 🌍 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import repo in [vercel.com](https://vercel.com)
3. Framework: **Vite** (auto-detected)
4. Add environment variable: `VITE_API_BASE_URL=https://your-backend.com/api/v1`
5. Add `vercel.json` for SPA routing:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

### Netlify

Add `public/_redirects`:
```
/* /index.html 200
```

### Self-hosted (Nginx)

```nginx
server {
  listen 80;
  server_name yourdomain.com;
  root /var/www/streamvault/dist;
  index index.html;

  location / {
    try_files $uri $uri/ /index.html;
  }

  location /api/ {
    proxy_pass http://localhost:8000;
    proxy_set_header Host $host;
  }
}
```

---

## 🤝 Contributing

Contributions are what make the open source community amazing. Any contributions you make are **greatly appreciated**.

1. Fork the project
2. Create your feature branch — `git checkout -b feature/AmazingFeature`
3. Commit your changes — `git commit -m 'Add AmazingFeature'`
4. Push to the branch — `git push origin feature/AmazingFeature`
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See [`LICENSE`](LICENSE) for more information.

---

## 🙏 Acknowledgements

- [**Hitesh Choudhary**](https://github.com/hiteshchoudhary) — for the backend architecture taught in the *Chai aur Backend* series that this project is built on
- [**TanStack Query**](https://tanstack.com/query) — for making server state management actually enjoyable
- [**Tailwind CSS**](https://tailwindcss.com) — for making UI development fast without sacrificing quality
- [**Cloudinary**](https://cloudinary.com) — for the video and image delivery pipeline

---

<div align="center">

Made with ❤️ by [**Digvijay Tripathy**](https://github.com/DIGVIJAY-TRIPATHY)

<br/>

⭐ **Star this repo if you found it helpful!** ⭐

</div>