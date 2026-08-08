
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import {
    Eye,
    EyeOff,
    Lock,
    Mail,
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
            <div className="mb-6 text-center">
                <h1
                    className="
                        text-2xl
                        font-bold
                        text-slate-900
                        dark:text-white
                    "
                >
                    Sign in to VideoTube
                </h1>

                <p
                    className="
                        mt-2
                        text-sm
                        text-slate-500
                        dark:text-slate-400
                    "
                >
                    Welcome back! Sign in to continue
                    watching your favorite videos.
                </p>
            </div>


            {/* API Error */}
            {apiError && (
                <div
                    role="alert"
                    className="
                        mb-5
                        rounded-lg
                        border
                        border-red-200
                        bg-red-50
                        px-4
                        py-3
                        text-sm
                        text-red-600
                        dark:border-red-900/50
                        dark:bg-red-950/30
                        dark:text-red-400
                    "
                >
                    {apiError}
                </div>
            )}


            {/* Login Form */}
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-4"
            >

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
                            className="
                                text-slate-400
                                transition-colors
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
                    autoComplete="current-password"
                    {...register("password")}
                />


                {/* Forgot Password */}
                <div className="flex justify-end">
                    <button
                        type="button"
                        onClick={handleForgotPassword}
                        className="
                            text-sm
                            font-medium
                            text-indigo-600
                            hover:text-indigo-700
                            hover:underline
                            dark:text-indigo-400
                            dark:hover:text-indigo-300
                        "
                    >
                        Forgot password?
                    </button>
                </div>


                {/* Submit */}
                <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    isLoading={loginMutation.isPending}
                    disabled={loginMutation.isPending}
                    className="w-full"
                >
                    Sign In
                </Button>
            </form>


            {/* Register */}
            <p
                className="
                    mt-6
                    text-center
                    text-sm
                    text-slate-500
                    dark:text-slate-400
                "
            >
                Don&apos;t have an account?{" "}
                <Link
                    to="/register"
                    className="
                        font-medium
                        text-indigo-600
                        hover:text-indigo-700
                        hover:underline
                        dark:text-indigo-400
                    "
                >
                    Register
                </Link>
            </p>
        </div>
    );
}

export default LoginForm;