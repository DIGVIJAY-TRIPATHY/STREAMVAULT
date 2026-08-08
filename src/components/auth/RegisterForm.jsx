import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import {
    Camera,
    Eye,
    EyeOff,
    Image as ImageIcon,
    Lock,
    Mail,
    User,
} from "lucide-react";

import Input from "../common/Input";
import Button from "../common/Button";

import { authApi } from "../../services/authApi";
import { setUser } from "../../features/auth/authSlice";
import { useAppDispatch } from "../../app/hooks";
import { consumePendingAction } from "../../utils/pendingAction";


// ===============================
// Validation Schema
// ===============================

const registerSchema = yup.object({
    fullName: yup
        .string()
        .min(3, "Full name must be at least 3 characters")
        .required("Full name is required"),

    username: yup
        .string()
        .min(3, "Username must be at least 3 characters")
        .max(20, "Username cannot exceed 20 characters")
        .matches(
            /^[a-z0-9_]+$/,
            "Username can only contain lowercase letters, numbers and underscores"
        )
        .required("Username is required"),

    email: yup
        .string()
        .email("Please enter a valid email address")
        .required("Email is required"),

    password: yup
        .string()
        .min(8, "Password must be at least 8 characters")
        .required("Password is required"),

    confirmPassword: yup
        .string()
        .oneOf(
            [yup.ref("password")],
            "Passwords must match"
        )
        .required("Please confirm your password"),

    avatar: yup
        .mixed()
        .required("Avatar is required")
        .test(
            "fileExists",
            "Avatar is required",
            (value) => value instanceof File
        )
        .test(
            "fileSize",
            "Avatar must be less than 2MB",
            (value) => {
                if (!value) return true;

                return value.size <= 2 * 1024 * 1024;
            }
        )
        .test(
            "fileType",
            "Avatar must be an image",
            (value) => {
                if (!value) return true;

                return value.type?.startsWith("image/");
            }
        ),

    coverImage: yup
        .mixed()
        .nullable()
        .test(
            "fileSize",
            "Cover image must be less than 5MB",
            (value) => {
                if (!value) return true;

                return value.size <= 5 * 1024 * 1024;
            }
        )
        .test(
            "fileType",
            "Cover image must be an image",
            (value) => {
                if (!value) return true;

                return value.type?.startsWith("image/");
            }
        ),
});


// ===============================
// Component
// ===============================

function RegisterForm() {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useAppDispatch();

    const avatarInputRef = useRef(null);
    const coverInputRef = useRef(null);

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);

    const [avatarPreview, setAvatarPreview] = useState("");
    const [coverPreview, setCoverPreview] = useState("");

    const [uploadProgress, setUploadProgress] = useState(0);
    const [apiError, setApiError] = useState("");

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(registerSchema),
        defaultValues: {
            fullName: "",
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
            avatar: null,
            coverImage: null,
        },
    });

    const avatarFile = watch("avatar");
    const coverFile = watch("coverImage");


    // ===============================
    // Avatar Preview
    // ===============================

    useEffect(() => {
        if (!avatarFile) {
            setAvatarPreview("");
            return;
        }

        const url = URL.createObjectURL(avatarFile);

        setAvatarPreview(url);

        return () => {
            URL.revokeObjectURL(url);
        };
    }, [avatarFile]);


    // ===============================
    // Cover Preview
    // ===============================

    useEffect(() => {
        if (!coverFile) {
            setCoverPreview("");
            return;
        }

        const url = URL.createObjectURL(coverFile);

        setCoverPreview(url);

        return () => {
            URL.revokeObjectURL(url);
        };
    }, [coverFile]);


    // ===============================
    // Register Mutation
    // ===============================

    const registerMutation = useMutation({
        mutationFn: (formData) => {
            setUploadProgress(0);

            return authApi.register(
                formData,
                (progressEvent) => {
                    if (!progressEvent.total) return;

                    const progress = Math.round(
                        (progressEvent.loaded /
                            progressEvent.total) *
                            100
                    );

                    setUploadProgress(progress);
                }
            );
        },

        onSuccess: (data) => {
            const user = data.data;

            setUploadProgress(100);
            setApiError("");

            dispatch(setUser(user));

            // Automatically finish whatever the guest was trying to do
            // (e.g. Like/Subscribe) instead of making them click it again.
            const pendingAction = consumePendingAction();
            pendingAction?.();

            toast.success(
                `Account created! Welcome, ${user.fullName}`
            );

            navigate(location.state?.from?.pathname || "/", {
                replace: true,
            });
        },

        onError: (error) => {
            setUploadProgress(0);

            setApiError(
                error?.message ||
                    "Registration failed. Please try again."
            );
        },
    });


    // ===============================
    // File Handlers
    // ===============================

    const handleAvatarChange = (event) => {
        const file = event.target.files?.[0];

        if (!file) return;

        setValue("avatar", file, {
            shouldValidate: true,
            shouldDirty: true,
        });
    };

    const handleCoverChange = (event) => {
        const file = event.target.files?.[0];

        if (!file) return;

        setValue("coverImage", file, {
            shouldValidate: true,
            shouldDirty: true,
        });
    };


    // ===============================
    // Submit
    // ===============================

    const onSubmit = (values) => {
        setApiError("");
        setUploadProgress(0);

        const formData = new FormData();

        formData.append("fullName", values.fullName);
        formData.append("username", values.username);
        formData.append("email", values.email);
        formData.append("password", values.password);
        formData.append("avatar", values.avatar);

        if (values.coverImage) {
            formData.append(
                "coverImage",
                values.coverImage
            );
        }

        registerMutation.mutate(formData);
    };


    return (
        <div className="w-full">

            {/* Heading */}
            <div className="mb-6 text-center">
                <h1
                    className="
                        text-2xl font-bold
                        text-slate-900
                        dark:text-white
                    "
                >
                    Create your VideoTube account
                </h1>

                <p
                    className="
                        mt-2 text-sm
                        text-slate-500
                        dark:text-slate-400
                    "
                >
                    Join VideoTube and start sharing
                    your videos.
                </p>
            </div>


            {/* API Error */}
            {apiError && (
                <div
                    role="alert"
                    className="
                        mb-5 rounded-lg
                        border border-red-200
                        bg-red-50
                        px-4 py-3
                        text-sm text-red-600
                        dark:border-red-900/50
                        dark:bg-red-950/30
                        dark:text-red-400
                    "
                >
                    {apiError}
                </div>
            )}


            <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-4"
            >

                {/* Avatar Upload */}
                <div className="flex flex-col items-center">
                    <button
                        type="button"
                        onClick={() =>
                            avatarInputRef.current?.click()
                        }
                        className="
                            group relative
                            h-24 w-24
                            overflow-hidden
                            rounded-full
                            border-2 border-dashed
                            border-slate-300
                            bg-slate-100
                            transition-colors
                            hover:border-indigo-500
                            dark:border-slate-600
                            dark:bg-slate-800
                        "
                    >
                        {avatarPreview ? (
                            <img
                                src={avatarPreview}
                                alt="Avatar preview"
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <div
                                className="
                                    flex h-full w-full
                                    flex-col
                                    items-center
                                    justify-center
                                    text-slate-400
                                    dark:text-slate-500
                                "
                            >
                                <Camera size={28} />

                                <span className="mt-1 text-[10px]">
                                    Avatar
                                </span>
                            </div>
                        )}

                        <div
                            className="
                                absolute inset-0
                                flex items-center justify-center
                                bg-black/50
                                opacity-0
                                transition-opacity
                                group-hover:opacity-100
                            "
                        >
                            <Camera
                                size={22}
                                className="text-white"
                            />
                        </div>
                    </button>

                    <input
                        ref={avatarInputRef}
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={handleAvatarChange}
                    />

                    {errors.avatar && (
                        <p className="mt-1 text-xs text-red-500">
                            {errors.avatar.message}
                        </p>
                    )}
                </div>


                {/* Cover Image */}
                <div>
                    <button
                        type="button"
                        onClick={() =>
                            coverInputRef.current?.click()
                        }
                        className="
                            group relative
                            flex aspect-[16/4]
                            w-full
                            overflow-hidden
                            rounded-xl
                            border-2 border-dashed
                            border-slate-300
                            bg-slate-100
                            transition-colors
                            hover:border-indigo-500
                            dark:border-slate-600
                            dark:bg-slate-800
                        "
                    >
                        {coverPreview ? (
                            <img
                                src={coverPreview}
                                alt="Cover preview"
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <div
                                className="
                                    flex h-full w-full
                                    flex-col
                                    items-center justify-center
                                    text-slate-400
                                    dark:text-slate-500
                                "
                            >
                                <ImageIcon size={28} />

                                <span className="mt-1 text-xs">
                                    Add cover image
                                </span>
                            </div>
                        )}

                        <div
                            className="
                                absolute inset-0
                                flex items-center justify-center
                                bg-black/50
                                opacity-0
                                transition-opacity
                                group-hover:opacity-100
                            "
                        >
                            <ImageIcon
                                size={24}
                                className="text-white"
                            />
                        </div>
                    </button>

                    <input
                        ref={coverInputRef}
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={handleCoverChange}
                    />

                    {errors.coverImage && (
                        <p className="mt-1 text-xs text-red-500">
                            {errors.coverImage.message}
                        </p>
                    )}
                </div>


                {/* Full Name */}
                <Input
                    label="Full Name"
                    type="text"
                    placeholder="Enter your full name"
                    leftIcon={<User size={18} />}
                    error={errors.fullName?.message}
                    autoComplete="name"
                    {...register("fullName")}
                />


                {/* Username */}
                <Input
                    label="Username"
                    type="text"
                    placeholder="e.g. digvijay_123"
                    leftIcon={<User size={18} />}
                    error={errors.username?.message}
                    autoComplete="username"
                    {...register("username")}
                />


                {/* Email */}
                <Input
                    label="Email"
                    type="email"
                    placeholder="Enter your email"
                    leftIcon={<Mail size={18} />}
                    error={errors.email?.message}
                    autoComplete="email"
                    {...register("email")}
                />


                {/* Password */}
                <Input
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    placeholder="At least 8 characters"
                    leftIcon={<Lock size={18} />}
                    rightIcon={
                        <button
                            type="button"
                            onClick={() =>
                                setShowPassword(
                                    (current) => !current
                                )
                            }
                            className="
                                text-slate-400
                                hover:text-slate-600
                                dark:hover:text-slate-200
                            "
                            aria-label={
                                showPassword
                                    ? "Hide password"
                                    : "Show password"
                            }
                        >
                            {showPassword ? (
                                <EyeOff size={18} />
                            ) : (
                                <Eye size={18} />
                            )}
                        </button>
                    }
                    error={errors.password?.message}
                    autoComplete="new-password"
                    {...register("password")}
                />


                {/* Confirm Password */}
                <Input
                    label="Confirm Password"
                    type={
                        showConfirmPassword
                            ? "text"
                            : "password"
                    }
                    placeholder="Re-enter your password"
                    leftIcon={<Lock size={18} />}
                    rightIcon={
                        <button
                            type="button"
                            onClick={() =>
                                setShowConfirmPassword(
                                    (current) => !current
                                )
                            }
                            className="
                                text-slate-400
                                hover:text-slate-600
                                dark:hover:text-slate-200
                            "
                            aria-label={
                                showConfirmPassword
                                    ? "Hide password"
                                    : "Show password"
                            }
                        >
                            {showConfirmPassword ? (
                                <EyeOff size={18} />
                            ) : (
                                <Eye size={18} />
                            )}
                        </button>
                    }
                    error={errors.confirmPassword?.message}
                    autoComplete="new-password"
                    {...register("confirmPassword")}
                />


                {/* Upload Progress */}
                {registerMutation.isPending && (
                    <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                            <span className="text-slate-500 dark:text-slate-400">
                                Creating account...
                            </span>

                            <span className="font-medium text-indigo-600 dark:text-indigo-400">
                                {uploadProgress}%
                            </span>
                        </div>

                        <div
                            className="
                                h-2 w-full overflow-hidden
                                rounded-full
                                bg-slate-200
                                dark:bg-slate-700
                            "
                        >
                            <div
                                className="
                                    h-full rounded-full
                                    bg-indigo-600
                                    transition-all duration-300
                                "
                                style={{
                                    width: `${uploadProgress}%`,
                                }}
                            />
                        </div>
                    </div>
                )}


                {/* Submit */}
                <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    isLoading={registerMutation.isPending}
                    disabled={registerMutation.isPending}
                    className="w-full"
                >
                    Create Account
                </Button>
            </form>


            {/* Login Link */}
            <p
                className="
                    mt-6 text-center text-sm
                    text-slate-500
                    dark:text-slate-400
                "
            >
                Already have an account?{" "}

                <Link
                    to="/login"
                    className="
                        font-medium
                        text-indigo-600
                        hover:text-indigo-700
                        hover:underline
                        dark:text-indigo-400
                    "
                >
                    Sign in
                </Link>
            </p>
        </div>
    );
}

export default RegisterForm;