import { Routes, Route } from 'react-router-dom';

import MainLayout from '../components/layout/MainLayout';
import AuthLayout from '../components/layout/AuthLayout';
import ProtectedRoute from '../components/common/ProtectedRoute';
import PublicOnlyRoute from '../components/common/PublicOnlyRoute';
import RoleProtectedRoute from '../components/common/RoleProtectedRoute';

import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Watch from '../pages/Watch';
import Channel from '../pages/Channel';
import Upload from '../pages/Upload';
import EditVideo from '../pages/EditVideo';
import Dashboard from '../pages/Dashboard';
import Search from '../pages/Search';
import Settings from '../pages/Settings';
import LikedVideos from '../pages/LikedVideos';
import History from '../pages/History';
import Playlists from '../pages/Playlists';
import PlaylistDetail from '../pages/PlaylistDetail';
import NotFound from '../pages/NotFound';
import Verification from '../pages/Verification';

function AppRoutes() {
    return (
        <Routes>
            {/* Public-only auth pages (redirect away if already signed in) */}
            <Route element={<PublicOnlyRoute />}>
                <Route element={<AuthLayout />}>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                </Route>
            </Route>

            {/* Main app shell - everything here requires authentication */}
            <Route element={<MainLayout />}>
                {/* Public - anyone can browse and watch without logging in */}
                <Route path="/" element={<Home />} />
                <Route path="/watch/:videoId" element={<Watch />} />
                <Route path="/channel/:username" element={<Channel />} />
                <Route path="/search" element={<Search />} />
                <Route path="/playlist/:playlistId" element={<PlaylistDetail />} />

                {/* Protected - requires an account */}
                <Route element={<ProtectedRoute />}>
                    <Route path="/upload" element={<Upload />} />
                    <Route path="/video/edit/:videoId" element={<EditVideo />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/liked-videos" element={<LikedVideos />} />
                    <Route path="/history" element={<History />} />
                    <Route path="/playlists" element={<Playlists />} />
                </Route>

                {/* highCommand-only */}
                <Route element={<RoleProtectedRoute allowedRoles={['highCommand']} />}>
                    <Route path="/verification" element={<Verification />} />
                </Route>

                <Route path="*" element={<NotFound />} />
            </Route>
        </Routes>
    );
}

export default AppRoutes;
