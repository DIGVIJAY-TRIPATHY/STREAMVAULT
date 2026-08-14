import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import {
    Eye,
    EyeOff,
    Lock,
    Mail,
    ArrowRight,
} from "lucide-react";

import Input from "../common/Input";
import Button from "../common/Button";

import { authApi } from "../../services/authApi";
import { setUser } from "../../features/auth/authSlice";
import { useAppDispatch } from "../../app/hooks";
import { consumePendingAction } from "../../utils/pendingAction";


// =========================
// Validation Schema
// =========================

const loginSchema = yup.object({
    email: yup
        .string()
        .email("Please enter a valid email address")
        .required("Email is required"),

    password: yup
        .string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
});


// =========================
// Animation Variants
// =========================

const containerVariants = {
    hidden: {},
    show: {
        transition: {
            staggerChildren: 0.07,
            delayChildren: 0.05,
        },
    },
};

const fieldVariants = {
    hidden: { opacity: 0, y: 14 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};


// =========================
// Component
// =========================

function LoginForm() {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useAppDispatch();

    const [showPassword, setShowPassword] = useState(false);
    const [apiError, setApiError] = useState("");

    const {
        register,
        handleSubmit,
        formState: {
            errors,
        },
    } = useForm({
        resolver: yupResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });


    // =========================
    // Login Mutation
    // =========================

    const loginMutation = useMutation({
        mutationFn: (formData) =>
            authApi.login(formData),

        onSuccess: (data) => {
            // Login response shape: { data: { user, accessToken, refreshToken } }
            // (different from register, which returns the user object directly)
            const user = data.data.user;

            // Clear previous API error
            setApiError("");

            // Save user in Redux
            dispatch(setUser(user));

            // Automatically finish whatever the guest was trying to do
            // (e.g. Like/Subscribe) instead of making them click it again.
            const pendingAction = consumePendingAction();
            pendingAction?.();

            // Show success message
            toast.success(
                `Welcome back, ${user.fullName}!`
            );

            // Return user to the page they originally requested
            navigate(
                location.state?.from?.pathname || "/",
                {
                    replace: true,
                }
            );
        },

        onError: (error) => {
            const message =
                error?.message ||
                "Unable to sign in. Please try again.";

            setApiError(message);
        },
    });


    // =========================
    // Submit
    // =========================

    const onSubmit = (formData) => {
        setApiError("");

        loginMutation.mutate(formData);
    };


    // =========================
    // Forgot Password
    // =========================

    const handleForgotPassword = (event) => {
        event.preventDefault();

        toast("Coming soon");
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
                    Welcome back
                </h1>

                <p className="mt-2 text-sm text-slate-500">
                    Sign in to continue watching your favorite videos.
                </p>
            </motion.div>


            {/* API Error */}
            {apiError && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    role="alert"
                    className="mb-5 overflow-hidden rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
                >
                    {apiError}
                </motion.div>
            )}


            {/* Login Form */}
            <motion.form
                onSubmit={handleSubmit(onSubmit)}
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="space-y-4"
            >

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
                        type={
                            showPassword
                                ? "text"
                                : "password"
                        }
                        placeholder="Enter your password"
                        leftIcon={<Lock size={18} />}
                        rightIcon={
                            <button
                                type="button"
                                onClick={() =>
                                    setShowPassword(
                                        (current) => !current
                                    )
                                }
                                className="text-slate-400 transition-colors hover:text-slate-600"
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
                        autoComplete="current-password"
                        {...register("password")}
                    />
                </motion.div>


                {/* Forgot Password */}
                <motion.div variants={fieldVariants} className="flex justify-end">
                    <button
                        type="button"
                        onClick={handleForgotPassword}
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:underline"
                    >
                        Forgot password?
                    </button>
                </motion.div>


                {/* Submit */}
                <motion.div variants={fieldVariants}>
                    <motion.div
                        whileHover={{ scale: loginMutation.isPending ? 1 : 1.015 }}
                        whileTap={{ scale: loginMutation.isPending ? 1 : 0.985 }}
                    >
                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            isLoading={loginMutation.isPending}
                            disabled={loginMutation.isPending}
                            rightIcon={<ArrowRight size={17} />}
                            className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 shadow-lg shadow-indigo-500/25 hover:from-indigo-700 hover:to-violet-700"
                        >
                            Sign In
                        </Button>
                    </motion.div>
                </motion.div>
            </motion.form>


            {/* Register */}
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.4 }}
                className="mt-6 text-center text-sm text-slate-500"
            >
                Don&apos;t have an account?{" "}
                <Link
                    to="/register"
                    className="font-medium text-indigo-600 hover:text-indigo-700 hover:underline"
                >
                    Register
                </Link>
            </motion.p>
        </div>
    );
}

export default LoginForm;