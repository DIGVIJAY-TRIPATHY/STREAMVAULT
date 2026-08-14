import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
    Camera,
    Eye,
    EyeOff,
    Image as ImageIcon,
    Lock,
    Mail,
    User,
    ArrowRight,
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
// Animation Variants
// ===============================

const containerVariants = {
    hidden: {},
    show: {
        transition: {
            staggerChildren: 0.06,
            delayChildren: 0.05,
        },
    },
};

const fieldVariants = {
    hidden: { opacity: 0, y: 14 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};


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
            <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="mb-8"
            >
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                    Create your account
                </h1>

                <p className="mt-2 text-sm text-slate-500">
                    Join StreamVault and start sharing your videos.
                </p>
            </motion.div>


            {/* API Error */}
            <AnimatePresence>
                {apiError && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        role="alert"
                        className="mb-5 overflow-hidden rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
                    >
                        {apiError}
                    </motion.div>
                )}
            </AnimatePresence>


            <motion.form
                onSubmit={handleSubmit(onSubmit)}
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="space-y-4"
            >

                {/* Cover + Avatar combined picker */}
                <motion.div variants={fieldVariants} className="relative">
                    <button
                        type="button"
                        onClick={() => coverInputRef.current?.click()}
                        className="group relative flex aspect-[16/5] w-full overflow-hidden rounded-2xl border-2 border-dashed border-slate-300 bg-slate-100 transition-colors hover:border-indigo-500"
                    >
                        {coverPreview ? (
                            <img
                                src={coverPreview}
                                alt="Cover preview"
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <div className="flex h-full w-full flex-col items-center justify-center text-slate-400">
                                <ImageIcon size={24} />
                                <span className="mt-1 text-xs">Add a cover image</span>
                            </div>
                        )}

                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                            <ImageIcon size={22} className="text-white" />
                        </div>
                    </button>

                    <input
                        ref={coverInputRef}
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={handleCoverChange}
                    />

                    {/* Avatar overlaps the bottom-left of the cover, YouTube-style */}
                    <button
                        type="button"
                        onClick={() => avatarInputRef.current?.click()}
                        className="group absolute -bottom-8 left-4 h-20 w-20 overflow-hidden rounded-full border-4 border-white bg-slate-100 shadow-lg ring-2 ring-slate-200 transition-transform hover:scale-105"
                    >
                        {avatarPreview ? (
                            <img
                                src={avatarPreview}
                                alt="Avatar preview"
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <div className="flex h-full w-full flex-col items-center justify-center text-slate-400">
                                <Camera size={20} />
                            </div>
                        )}

                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                            <Camera size={16} className="text-white" />
                        </div>
                    </button>

                    <input
                        ref={avatarInputRef}
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={handleAvatarChange}
                    />
                </motion.div>

                {(errors.avatar || errors.coverImage) && (
                    <motion.div variants={fieldVariants} className="!mt-3 space-y-0.5 pl-1">
                        {errors.avatar && (
                            <p className="text-xs text-red-500">{errors.avatar.message}</p>
                        )}
                        {errors.coverImage && (
                            <p className="text-xs text-red-500">{errors.coverImage.message}</p>
                        )}
                    </motion.div>
                )}

                {/* Spacer for the overlapping avatar */}
                <div className="!mt-10" />


                {/* Full Name */}
                <motion.div variants={fieldVariants}>
                    <Input
                        forceLight
                        label="Full Name"
                        type="text"
                        placeholder="Enter your full name"
                        leftIcon={<User size={18} />}
                        error={errors.fullName?.message}
                        autoComplete="name"
                        {...register("fullName")}
                    />
                </motion.div>


                {/* Username */}
                <motion.div variants={fieldVariants}>
                    <Input
                        forceLight
                        label="Username"
                        type="text"
                        placeholder="e.g. digvijay_123"
                        leftIcon={<User size={18} />}
                        error={errors.username?.message}
                        autoComplete="username"
                        {...register("username")}
                    />
                </motion.div>


                {/* Email */}
                <motion.div variants={fieldVariants}>
                    <Input
                        forceLight
                        label="Email"
                        type="email"
                        placeholder="Enter your email"
                        leftIcon={<Mail size={18} />}
                        error={errors.email?.message}
                        autoComplete="email"
                        {...register("email")}
                    />
                </motion.div>


                {/* Password */}
                <motion.div variants={fieldVariants}>
                    <Input
                        forceLight
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
                                className="text-slate-400 hover:text-slate-600"
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
                </motion.div>


                {/* Confirm Password */}
                <motion.div variants={fieldVariants}>
                    <Input
                        forceLight
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
                                className="text-slate-400 hover:text-slate-600"
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
                </motion.div>


                {/* Upload Progress */}
                <AnimatePresence>
                    {registerMutation.isPending && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="space-y-1 overflow-hidden"
                        >
                            <div className="flex justify-between text-xs">
                                <span className="text-slate-500">
                                    Creating account...
                                </span>

                                <span className="font-medium text-indigo-600">
                                    {uploadProgress}%
                                </span>
                            </div>

                            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                                <motion.div
                                    className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-violet-600"
                                    animate={{ width: `${uploadProgress}%` }}
                                    transition={{ duration: 0.3 }}
                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>


                {/* Submit */}
                <motion.div variants={fieldVariants}>
                    <motion.div
                        whileHover={{ scale: registerMutation.isPending ? 1 : 1.015 }}
                        whileTap={{ scale: registerMutation.isPending ? 1 : 0.985 }}
                    >
                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            isLoading={registerMutation.isPending}
                            disabled={registerMutation.isPending}
                            rightIcon={<ArrowRight size={17} />}
                            className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 shadow-lg shadow-indigo-500/25 hover:from-indigo-700 hover:to-violet-700"
                        >
                            Create Account
                        </Button>
                    </motion.div>
                </motion.div>
            </motion.form>


            {/* Login Link */}
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.4 }}
                className="mt-6 text-center text-sm text-slate-500"
            >
                Already have an account?{" "}

                <Link
                    to="/login"
                    className="font-medium text-indigo-600 hover:text-indigo-700 hover:underline"
                >
                    Sign in
                </Link>
            </motion.p>
        </div>
    );
}

export default RegisterForm;