import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { UploadCloud, Film, Image as ImageIcon } from "lucide-react";

import { videoApi } from "../api/videoApi";
import Input from "../components/common/Input";
import Button from "../components/common/Button";

function Upload() {
  const navigate = useNavigate();
  const videoInputRef = useRef(null);
  const thumbnailInputRef = useRef(null);

  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [videoFileName, setVideoFileName] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [apiError, setApiError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      videoFile: null,
      thumbnail: null,
    },
  });

  const thumbnailFile = watch("thumbnail");

  useEffect(() => {
    if (!thumbnailFile) {
      setThumbnailPreview("");
      return;
    }

    const url = URL.createObjectURL(thumbnailFile);
    setThumbnailPreview(url);

    return () => URL.revokeObjectURL(url);
  }, [thumbnailFile]);

  const uploadMutation = useMutation({
    mutationFn: (formData) => {
      setUploadProgress(0);
      return videoApi.uploadVideo(formData, setUploadProgress);
    },

    onSuccess: (data) => {
      toast.success(
        data?.message || "Video submitted for review. It will be visible once approved."
      );
      navigate("/dashboard");
    },

    onError: (error) => {
      setApiError(error?.message || "Failed to upload video. Please try again.");
    },
  });

  const onSubmit = (values) => {
    if (!values.videoFile) {
      toast.error("Please select a video file");
      return;
    }

    if (!values.thumbnail) {
      toast.error("Please select a thumbnail image");
      return;
    }

    setApiError("");

    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("description", values.description);
    formData.append("videoFile", values.videoFile);
    formData.append("thumbnail", values.thumbnail);

    uploadMutation.mutate(formData);
  };

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-xl font-bold text-slate-900 dark:text-white">
        Upload a video
      </h1>

      {apiError && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
          {apiError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5">
        {/* Video file */}
        <div>
          <button
            type="button"
            onClick={() => videoInputRef.current?.click()}
            className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 py-10 text-slate-500 transition-colors hover:border-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400"
          >
            <Film size={32} />
            <span className="text-sm">
              {videoFileName || "Click to select a video file"}
            </span>
          </button>

          <input
            ref={videoInputRef}
            type="file"
            accept="video/*"
            hidden
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (!file) return;
              setVideoFileName(file.name);
              setValue("videoFile", file, { shouldValidate: true });
            }}
          />
        </div>

        {/* Thumbnail */}
        <div>
          <button
            type="button"
            onClick={() => thumbnailInputRef.current?.click()}
            className="relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 text-slate-500 transition-colors hover:border-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400"
          >
            {thumbnailPreview ? (
              <img
                src={thumbnailPreview}
                alt="Thumbnail preview"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center gap-2">
                <ImageIcon size={28} />
                <span className="text-sm">Select a thumbnail</span>
              </div>
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
              setValue("thumbnail", file, { shouldValidate: true });
            }}
          />
        </div>

        <Input
          label="Title"
          placeholder="Give your video a title"
          error={errors.title?.message}
          {...register("title", { required: "Title is required" })}
        />

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Description
          </label>
          <textarea
            rows={4}
            placeholder="Tell viewers about your video"
            className="w-full resize-none rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
            {...register("description", { required: "Description is required" })}
          />
          {errors.description && (
            <p className="mt-1 text-xs text-red-500">{errors.description.message}</p>
          )}
        </div>

        {uploadMutation.isPending && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400">Uploading...</span>
              <span className="font-medium text-indigo-600 dark:text-indigo-400">
                {uploadProgress}%
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
              <div
                className="h-full rounded-full bg-indigo-600 transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        <Button
          type="submit"
          size="lg"
          className="w-full"
          leftIcon={<UploadCloud size={18} />}
          isLoading={uploadMutation.isPending}
          disabled={uploadMutation.isPending}
        >
          Publish video
        </Button>
      </form>
    </div>
  );
}

export default Upload;
