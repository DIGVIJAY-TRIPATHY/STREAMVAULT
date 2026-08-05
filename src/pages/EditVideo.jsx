import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Trash2, Image as ImageIcon } from "lucide-react";

import { videoApi } from "../api/videoApi";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import ConfirmDialog from "../components/common/ConfirmDialog";
import Loader from "../components/common/Loader";

import { QUERY_KEYS } from "../utils/constants";

function EditVideo() {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const thumbnailInputRef = useRef(null);

  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.VIDEO, videoId],
    queryFn: () => videoApi.getVideoById(videoId),
    enabled: Boolean(videoId),
  });

  const video = data?.data;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: { title: "", description: "", thumbnail: null },
  });

  useEffect(() => {
    if (video) {
      reset({ title: video.title, description: video.description, thumbnail: null });
      setThumbnailPreview(video.thumbnail || "");
    }
  }, [video, reset]);

  const updateMutation = useMutation({
    mutationFn: (payload) => videoApi.updateVideo(videoId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.VIDEO, videoId] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DASHBOARD_VIDEOS] });
      toast.success("Video updated");
      navigate(`/watch/${videoId}`);
    },
    onError: (error) => {
      toast.error(error?.message || "Failed to update video");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => videoApi.deleteVideo(videoId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DASHBOARD_VIDEOS] });
      toast.success("Video deleted");
      navigate("/dashboard");
    },
    onError: (error) => {
      toast.error(error?.message || "Failed to delete video");
    },
  });

  const onSubmit = (values) => {
    updateMutation.mutate({
      title: values.title,
      description: values.description,
      thumbnail: values.thumbnail || video?.thumbnail,
    });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (!video) {
    return <p className="text-slate-500 dark:text-slate-400">Video not found.</p>;
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-xl font-bold text-slate-900 dark:text-white">Edit video</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5">
        <div>
          <button
            type="button"
            onClick={() => thumbnailInputRef.current?.click()}
            className="relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 text-slate-500 hover:border-indigo-500 dark:border-slate-700 dark:bg-slate-900"
          >
            {thumbnailPreview ? (
              <img src={thumbnailPreview} alt="Thumbnail" className="h-full w-full object-cover" />
            ) : (
              <ImageIcon size={28} />
            )}
          </button>

          <input
            ref={thumbnailInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (!file) return;
              setValue("thumbnail", file);
              setThumbnailPreview(URL.createObjectURL(file));
            }}
          />
        </div>

        <Input
          label="Title"
          error={errors.title?.message}
          {...register("title", { required: "Title is required" })}
        />

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Description
          </label>
          <textarea
            rows={4}
            className="w-full resize-none rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
            {...register("description", { required: "Description is required" })}
          />
          {errors.description && (
            <p className="mt-1 text-xs text-red-500">{errors.description.message}</p>
          )}
        </div>

        <div className="flex items-center gap-3">
          <Button type="submit" isLoading={updateMutation.isPending}>
            Save changes
          </Button>

          <Button
            type="button"
            variant="danger"
            leftIcon={<Trash2 size={16} />}
            onClick={() => setShowDeleteDialog(true)}
          >
            Delete video
          </Button>
        </div>
      </form>

      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={() => deleteMutation.mutateAsync()}
        title="Delete video?"
        message="This video will be permanently deleted. This action cannot be undone."
        confirmLabel="Delete"
        isDangerous
      />
    </div>
  );
}

export default EditVideo;
