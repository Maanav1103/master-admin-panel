"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { resetPasswordSchema, ResetPasswordSchemaType } from "@/utils/schemas";
import { useRouter } from "next/navigation";
import { routes } from "@/constants/routes";
import { Lock, Eye, EyeOff, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";

export default function ResetPasswordForm() {
  const router = useRouter();
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordSchemaType>({
    resolver: yupResolver(resetPasswordSchema),
  });

  const onSubmit = async (values: ResetPasswordSchemaType) => {
    try {
      setLoading(true);
      console.log(values);
      await new Promise((r) => setTimeout(r, 800)); // replace with real API
      setDone(true);
      setTimeout(() => router.push(routes.auth.signIn), 1800);
    } finally {
      setLoading(false);
    }
  };

  const inputBase =
    "w-full rounded-xl border border-border bg-surface pl-10 pr-10 py-3 text-sm text-foreground placeholder:text-muted/50 outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/10";

  if (done) {
    return (
      <div className="flex flex-col items-center gap-4 py-4">
        <div className="h-16 w-16 rounded-full bg-gradient-brand flex items-center justify-center shadow-lg shadow-primary/20">
          <CheckCircle2 className="h-8 w-8 text-white" />
        </div>
        <div className="text-center space-y-1">
          <p className="font-semibold text-foreground">Password reset!</p>
          <p className="text-sm text-muted">Redirecting you to sign in…</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <p className="text-sm text-muted text-center -mt-2">
        Choose a strong new password for your account.
      </p>

      {/* New Password */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-foreground">New Password</label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted/60 pointer-events-none" />
          <input
            type={showNew ? "text" : "password"}
            {...register("newPassword")}
            className={inputBase}
          />
          <button type="button" onClick={() => setShowNew(!showNew)}
            className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-muted/60 hover:text-foreground transition-colors">
            {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.newPassword && <p className="text-xs text-red-500">{errors.newPassword.message}</p>}
      </div>

      {/* Confirm Password */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-foreground">Confirm Password</label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted/60 pointer-events-none" />
          <input
            type={showConfirm ? "text" : "password"}
            {...register("confirmPassword")}
            className={inputBase}
          />
          <button type="button" onClick={() => setShowConfirm(!showConfirm)}
            className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-muted/60 hover:text-foreground transition-colors">
            {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="cursor-pointer group relative w-full overflow-hidden rounded-xl bg-gradient-brand py-3.5 text-sm font-semibold text-white tracking-wide transition-all duration-200 hover:shadow-lg hover:shadow-primary/25 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : (
            <> Reset Password <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" /> </>
          )}
        </span>
        <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
      </button>
    </form>
  );
}
