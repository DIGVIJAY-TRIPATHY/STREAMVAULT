import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Edit2, Trash2, ChevronLeft, ChevronRight, Eye, ThumbsUp } from 'lucide-react';

const PAGE_SIZE = 10;

function formatDate(dateString) {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}

export default function VideoTable({ videos = [], onTogglePublish, onDelete }) {
    // Local video state to handle optimistic toggle updates
    const [videoList, setVideoList] = useState(videos);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        setVideoList(videos);
    }, [videos]);

    // Handle Optimistic Toggle Switch
    const handleToggle = async (videoId, currentStatus) => {
        // 1. Optimistic Update
        setVideoList(prev =>
            prev.map(v => (v._id === videoId ? { ...v, isPublished: !currentStatus } : v))
        );

        try {
            // 2. Parent Handler Request
            if (onTogglePublish) {
                await onTogglePublish(videoId);
            }
        } catch (error) {
            // 3. Rollback on API Error
            console.error("Failed to toggle publish status:", error);

            setVideoList(prev =>
                prev.map(v => (v._id === videoId ? { ...v, isPublished: currentStatus } : v))
            );
        }
    };

    // Pagination Controls
    const totalPages = Math.ceil(videoList.length / PAGE_SIZE) || 1;
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const paginatedVideos = videoList.slice(startIndex, startIndex + PAGE_SIZE);

    return (
        <div className="w-full">
            {/* ---------------- DESKTOP TABLE VIEW (>= md) ---------------- */}
            <div className="hidden overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-slate-900 md:block">
                <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
                    <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-slate-800 dark:text-gray-300">
                        <tr>
                            <th scope="col" className="px-6 py-4">
                                Video
                            </th>
                            <th scope="col" className="px-6 py-4">
                                Date Uploaded
                            </th>
                            <th scope="col" className="px-6 py-4">
                                Views
                            </th>
                            <th scope="col" className="px-6 py-4">
                                Likes
                            </th>
                            <th scope="col" className="px-6 py-4">
                                Status
                            </th>
                            <th scope="col" className="px-6 py-4 text-right">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                        {paginatedVideos.map(video => (
                            <tr
                                key={video._id}
                                className="transition-colors hover:bg-gray-50/50 dark:hover:bg-slate-800/50"
                            >
                                {/* Thumbnail + Title */}
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={video.thumbnail || '/placeholder-thumbnail.jpg'}
                                            alt={video.title}
                                            className="h-12 w-20 rounded-md object-cover bg-gray-100 dark:bg-gray-800"
                                        />
                                        <span className="line-clamp-2 max-w-xs font-semibold text-gray-900 dark:text-white">
                                            {video.title}
                                        </span>
                                    </div>
                                </td>

                                {/* Date */}
                                <td className="whitespace-nowrap px-6 py-4 text-xs">
                                    {formatDate(video.createdAt)}
                                </td>

                                {/* Views */}
                                <td className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-gray-200">
                                    {video.views?.toLocaleString() || 0}
                                </td>

                                {/* Likes */}
                                <td className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-gray-200">
                                    {video.likes?.toLocaleString() || 0}
                                </td>

                                {/* Status Toggle */}
                                <td className="whitespace-nowrap px-6 py-4">
                                    <label className="relative inline-flex cursor-pointer items-center">
                                        <input
                                            type="checkbox"
                                            checked={video.isPublished}
                                            onChange={() =>
                                                handleToggle(video._id, video.isPublished)
                                            }
                                            className="peer sr-only"
                                        />
                                        <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-indigo-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none dark:bg-gray-700 dark:peer-focus:ring-indigo-800" />
                                        <span className="ms-2 text-xs font-medium text-gray-600 dark:text-gray-300">
                                            {video.isPublished ? 'Published' : 'Unpublished'}
                                        </span>
                                    </label>
                                </td>

                                {/* Actions */}
                                <td className="whitespace-nowrap px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <Link
                                            to={`/video/edit/${video._id}`}
                                            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-slate-800 dark:hover:text-gray-200"
                                            title="Edit Video"
                                        >
                                            <Edit2 className="h-4 w-4" />
                                        </Link>
                                        <button
                                            onClick={() => onDelete(video._id)}
                                            className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40 dark:hover:text-red-400"
                                            title="Delete Video"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* ---------------- MOBILE CARD STACK VIEW (< md) ---------------- */}
            <div className="flex flex-col gap-4 md:hidden">
                {paginatedVideos.map(video => (
                    <div
                        key={video._id}
                        className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-slate-900"
                    >
                        <div className="flex gap-3">
                            <img
                                src={video.thumbnail || '/placeholder-thumbnail.jpg'}
                                alt={video.title}
                                className="h-16 w-28 rounded-lg object-cover bg-gray-100 dark:bg-gray-800"
                            />
                            <div className="flex-1">
                                <h4 className="line-clamp-2 text-sm font-semibold text-gray-900 dark:text-white">
                                    {video.title}
                                </h4>
                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                    {formatDate(video.createdAt)}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 border-t border-b border-gray-100 dark:border-gray-800 py-2">
                            <span className="flex items-center gap-1">
                                <Eye className="h-3.5 w-3.5" />
                                {video.views?.toLocaleString() || 0}
                            </span>
                            <span className="flex items-center gap-1">
                                <ThumbsUp className="h-3.5 w-3.5" />
                                {video.likes?.toLocaleString() || 0}
                            </span>
                        </div>

                        <div className="flex items-center justify-between pt-1">
                            {/* Mobile Status Toggle */}
                            <label className="relative inline-flex cursor-pointer items-center">
                                <input
                                    type="checkbox"
                                    checked={video.isPublished}
                                    onChange={() => handleToggle(video._id, video.isPublished)}
                                    className="peer sr-only"
                                />
                                <div className="peer h-5 w-9 rounded-full bg-gray-200 after:absolute after:start-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-indigo-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none dark:bg-gray-700" />
                                <span className="ms-2 text-xs font-medium text-gray-600 dark:text-gray-300">
                                    {video.isPublished ? 'Published' : 'Unpublished'}
                                </span>
                            </label>

                            {/* Mobile Actions */}
                            <div className="flex items-center gap-1">
                                <Link
                                    to={`/video/edit/${video._id}`}
                                    className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-slate-800"
                                >
                                    <Edit2 className="h-4 w-4" />
                                </Link>
                                <button
                                    onClick={() => onDelete(video._id)}
                                    className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* ---------------- PAGINATION CONTROLS ---------------- */}
            {videoList.length > 0 && (
                <div className="mt-4 flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm dark:border-gray-800 dark:bg-slate-900">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                        <span className="font-medium">
                            {Math.min(startIndex + PAGE_SIZE, videoList.length)}
                        </span>{' '}
                        of <span className="font-medium">{videoList.length}</span> videos
                    </p>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                            disabled={currentPage === 1}
                            className="inline-flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-slate-800"
                        >
                            <ChevronLeft className="h-3.5 w-3.5" /> Previous
                        </button>
                        <button
                            onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="inline-flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-slate-800"
                        >
                            Next <ChevronRight className="h-3.5 w-3.5" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
