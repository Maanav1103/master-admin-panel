"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { signInSchema, SignInSchemaType } from "@/utils/schemas";
import { useRouter } from "next/navigation";
import { routes } from "@/constants/routes";
import Cookies from "js-cookie";
import { LocalStorageSetItem } from "@/utils/helpers";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";

export default function SigninWithPassword() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { email: "", password: "", rememberMe: true },
    resolver: yupResolver(signInSchema),
  });

  const onSubmit = async (values: SignInSchemaType) => {
    try {
      setLoading(true);
      console.log(values);
      await new Promise((r) => setTimeout(r, 800));
      Cookies.set("token", "dummy-auth-token", { expires: 7 });
      LocalStorageSetItem("adminDetails", {
        id: 1,
        fullName: "Admin User",
        email: "admin@example.com",
        role: "A",
        status: "A",
        profileImage: null,
      });
      router.push(routes.dashboard);
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setLoading(false);
    }
  };

  const inputBase =
    "w-full rounded-xl border border-border bg-surface pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted/50 outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/10";

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">

      {/* Email */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-foreground">Email address</label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted/60 pointer-events-none" />
          <input
            type="email"
            placeholder="you@example.com"
            {...register("email")}
            className={inputBase}
          />
        </div>
        {errors.email && (
          <p className="text-xs text-red-500">{errors.email.message}</p>
        )}
      </div>

      {/* Password */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-foreground">Password</label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted/60 pointer-events-none" />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            {...register("password")}
            className={`${inputBase} pr-10`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-muted/60 hover:text-foreground transition-colors"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.password && (
          <p className="text-xs text-red-500">{errors.password.message}</p>
        )}
      </div>

      {/* Forgot password + Remember me */}
      <div className="space-y-3">
        <div className="flex justify-end">
          <Link
            href={routes.auth.forgotPassword}
            className="text-xs font-medium text-primary hover:text-primary-light transition-colors"
          >
            Forgot password?
          </Link>
        </div>
        <label className="flex cursor-pointer items-center gap-2 select-none">
          <div className="relative flex items-center justify-center">
            <input
              type="checkbox"
              {...register("rememberMe")}
              className="peer h-4 w-4 cursor-pointer appearance-none rounded border border-border bg-surface transition-all"
            />
            <span className="pointer-events-none absolute inset-0 rounded hidden peer-checked:flex items-center justify-center bg-gradient-brand">
              <svg viewBox="0 0 12 12" fill="none" className="h-3 w-3 text-white">
                <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </div>
          <span className="text-sm text-muted">Remember me</span>
        </label>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="cursor-pointer group relative mt-1 w-full overflow-hidden rounded-xl bg-gradient-brand py-3.5 text-sm font-semibold text-white tracking-wide transition-all duration-200 hover:shadow-lg hover:shadow-primary/25 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              Sign In
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </>
          )}
        </span>
        {/* shine sweep */}
        <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
      </button>

      {/* Sign up link */}
      <p className="text-center text-sm text-muted">
        Don&apos;t have an account?{" "}
        <Link href={routes.auth.signUp} className="font-medium text-primary hover:text-primary-light transition-colors">
          Sign up
        </Link>
      </p>

    </form>
  );
}
