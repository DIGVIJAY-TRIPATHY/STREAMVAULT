import { useRef } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { Camera } from "lucide-react";

import { userApi } from "../api/userApi";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import Avatar from "../components/common/Avatar";

import { useAppDispatch } from "../app/hooks";
import { setUser, selectCurrentUser } from "../features/auth/authSlice";
import { QUERY_KEYS } from "../utils/constants";

function AccountForm({ user }) {
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fullName: user?.fullName || "",
      email: user?.email || "",
    },
  });

  const mutation = useMutation({
    mutationFn: (values) => userApi.updateAccount(values),
    onSuccess: (data) => {
      dispatch(setUser(data.data));
      toast.success("Account details updated");
    },
    onError: (error) => {
      toast.error(error?.message || "Failed to update account");
    },
  });

  return (
    <form onSubmit={handleSubmit((values) => mutation.mutate(values))} className="space-y-4">
      <Input
        label="Full name"
        error={errors.fullName?.message}
        {...register("fullName", { required: "Full name is required" })}
      />
      <Input
        label="Email"
        type="email"
        error={errors.email?.message}
        {...register("email", { required: "Email is required" })}
      />
      <Button type="submit" isLoading={mutation.isPending}>
        Save changes
      </Button>
    </form>
  );
}

function PasswordForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: { oldPassword: "", newPassword: "" } });

  const mutation = useMutation({
    mutationFn: (values) => userApi.changePassword(values),
    onSuccess: () => {
      toast.success("Password changed successfully");
      reset();
    },
    onError: (error) => {
      toast.error(error?.message || "Failed to change password");
    },
  });

  return (
    <form onSubmit={handleSubmit((values) => mutation.mutate(values))} className="space-y-4">
      <Input
        label="Current password"
        type="password"
        error={errors.oldPassword?.message}
        {...register("oldPassword", { required: "Current password is required" })}
      />
      <Input
        label="New password"
        type="password"
        error={errors.newPassword?.message}
        {...register("newPassword", {
          required: "New password is required",
          minLength: { value: 8, message: "Must be at least 8 characters" },
        })}
      />
      <Button type="submit" isLoading={mutation.isPending}>
        Update password
      </Button>
    </form>
  );
}

function ImagesForm({ user }) {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const avatarInputRef = useRef(null);
  const coverInputRef = useRef(null);

  const avatarMutation = useMutation({
    mutationFn: (file) => userApi.updateAvatar(file),
    onSuccess: (data) => {
      dispatch(setUser(data.data));
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CURRENT_USER] });
      toast.success("Avatar updated");
    },
    onError: (error) => toast.error(error?.message || "Failed to update avatar"),
  });

  const coverMutation = useMutation({
    mutationFn: (file) => userApi.updateCoverImage(file),
    onSuccess: (data) => {
      dispatch(setUser(data.data));
      toast.success("Cover image updated");
    },
    onError: (error) => toast.error(error?.message || "Failed to update cover image"),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => avatarInputRef.current?.click()}
          className="group relative"
        >
          <Avatar src={user?.avatar} alt={user?.username || "User"} size="xl" />
          <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
            <Camera size={20} className="text-white" />
          </span>
        </button>

        <div>
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Avatar</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Click the image to upload a new avatar.
          </p>
        </div>

        <input
          ref={avatarInputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) avatarMutation.mutate(file);
          }}
        />
      </div>

      <div>
        <button
          type="button"
          onClick={() => coverInputRef.current?.click()}
          className="relative flex aspect-[16/4] w-full items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-slate-300 bg-slate-100 text-slate-400 hover:border-indigo-500 dark:border-slate-700 dark:bg-slate-800"
        >
          {user?.coverImage ? (
            <img src={user.coverImage} alt="Cover" className="h-full w-full object-cover" />
          ) : (
            <span className="text-sm">Click to add a cover image</span>
          )}
        </button>

        <input
          ref={coverInputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) coverMutation.mutate(file);
          }}
        />
      </div>
    </div>
  );
}

function Settings() {
  const user = useSelector(selectCurrentUser);

  return (
    <div className="mx-auto max-w-2xl space-y-10">
      <h1 className="text-xl font-bold text-slate-900 dark:text-white">Settings</h1>

      <section>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Profile images
        </h2>
        <ImagesForm user={user} />
      </section>

      <section>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Account details
        </h2>
        <AccountForm user={user} />
      </section>

      <section>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Change password
        </h2>
        <PasswordForm />
      </section>
    </div>
  );
}

export default Settings;
