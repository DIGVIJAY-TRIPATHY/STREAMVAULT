import { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Plus, ListVideo } from "lucide-react";

import { playlistApi } from "../api/playlistApi";
import { selectCurrentUser } from "../features/auth/authSlice";

import Loader from "../components/common/Loader";
import EmptyState from "../components/common/EmptyState";
import Modal from "../components/common/Modal";
import Input from "../components/common/Input";
import Button from "../components/common/Button";

import { QUERY_KEYS } from "../utils/constants";

function CreatePlaylistModal({ isOpen, onClose }) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: { name: "", description: "" } });

  const mutation = useMutation({
    mutationFn: (values) => playlistApi.createPlaylist(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PLAYLISTS] });
      toast.success("Playlist created");
      reset();
      onClose();
    },
    onError: (error) => toast.error(error?.message || "Failed to create playlist"),
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create playlist" size="sm">
      <form
        onSubmit={handleSubmit((values) => mutation.mutate(values))}
        className="space-y-4"
      >
        <Input
          label="Name"
          error={errors.name?.message}
          {...register("name", { required: "Name is required" })}
        />

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Description
          </label>
          <textarea
            rows={3}
            className="w-full resize-none rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
            {...register("description", { required: "Description is required" })}
          />
          {errors.description && (
            <p className="mt-1 text-xs text-red-500">{errors.description.message}</p>
          )}
        </div>

        <Button type="submit" className="w-full" isLoading={mutation.isPending}>
          Create playlist
        </Button>
      </form>
    </Modal>
  );
}

function Playlists() {
  const user = useSelector(selectCurrentUser);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.PLAYLISTS, user?._id],
    queryFn: () => playlistApi.getUserPlaylists(user._id),
    enabled: Boolean(user?._id),
  });

  const playlists = data?.data || [];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">Your playlists</h1>

        <Button leftIcon={<Plus size={16} />} onClick={() => setIsModalOpen(true)}>
          New playlist
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-10">
          <Loader />
        </div>
      ) : playlists.length === 0 ? (
        <EmptyState
          icon={ListVideo}
          title="No playlists yet"
          description="Create a playlist to organize videos you want to watch later."
          action={{ label: "New playlist", onClick: () => setIsModalOpen(true) }}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {playlists.map((playlist) => (
            <Link
              key={playlist._id}
              to={`/playlist/${playlist._id}`}
              className="rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:border-indigo-400 dark:border-slate-800 dark:bg-slate-900"
            >
              <h3 className="font-semibold text-slate-900 dark:text-white">{playlist.name}</h3>
              <p className="mt-1 line-clamp-2 text-sm text-slate-500 dark:text-slate-400">
                {playlist.description}
              </p>
            </Link>
          ))}
        </div>
      )}

      <CreatePlaylistModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

export default Playlists;
