"use client";
import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { signUpSchema, SignUpSchemaType } from "@/utils/schemas";
import { useRouter } from "next/navigation";
import { routes } from "@/constants/routes";
import Link from "next/link";
import Image from "next/image";
import {
  Mail, Lock, Eye, EyeOff, ArrowRight, Loader2,
  User, Camera, X,
  UserCircle,
} from "lucide-react";

export default function SignupWithPassword() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<SignUpSchemaType>({
    defaultValues: {
      firstName: "", lastName: "",
      email: "", password: "", confirmPassword: "", profileImage: null,
    },
    resolver: yupResolver(signUpSchema),
  });

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    setValue("profileImage", file);
    trigger("profileImage");
    setPreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setValue("profileImage", null);
    setPreview(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const onSubmit = async (values: SignUpSchemaType) => {
    try {
      setLoading(true);
      console.log(values);
      await new Promise((r) => setTimeout(r, 800));
      router.push(routes.auth.signIn);
    } catch (error) {
      console.error("Signup error:", error);
    } finally {
      setLoading(false);
    }
  };

  const inputBase =
    "w-full rounded-xl border border-border bg-surface pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted/50 outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/10";

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">

      {/* Profile Image */}
      <div className="flex flex-col items-center gap-2">
        <div
          className="relative h-20 w-20 cursor-pointer group"
          onClick={() => fileRef.current?.click()}
        >
          <div className="h-20 w-20 rounded-full border-2 border-dashed border-border bg-surface overflow-hidden flex items-center justify-center transition-all group-hover:border-primary">
            {preview ? (
              <Image src={preview} alt="Profile" fill className="object-cover rounded-full" />
            ) : (
              <UserCircle className="h-10 w-10 text-muted/40" />
            )}
          </div>
          <div className="absolute bottom-0 right-0 h-6 w-6 rounded-full bg-gradient-brand flex items-center justify-center shadow-md">
            <Camera className="h-3 w-3 text-white" />
          </div>
          {preview && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); removeImage(); }}
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 flex items-center justify-center shadow"
            >
              <X className="h-3 w-3 text-white" />
            </button>
          )}
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
        <p className="text-xs text-muted">Profile photo (optional)</p>
        {errors.profileImage && (
          <p className="text-xs text-red-500">{errors.profileImage.message}</p>
        )}
      </div>

      {/* First & Last Name */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">First Name</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted/60 pointer-events-none" />
            <input type="text" placeholder="John" {...register("firstName")} className={inputBase} />
          </div>
          {errors.firstName && <p className="text-xs text-red-500">{errors.firstName.message}</p>}
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Last Name</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted/60 pointer-events-none" />
            <input type="text" placeholder="Doe" {...register("lastName")} className={inputBase} />
          </div>
          {errors.lastName && <p className="text-xs text-red-500">{errors.lastName.message}</p>}
        </div>
      </div>

      {/* Email */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-foreground">Email address</label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted/60 pointer-events-none" />
          <input type="email" placeholder="you@example.com" {...register("email")} className={inputBase} />
        </div>
        {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
      </div>

      {/* Password + Confirm Password */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted/60 pointer-events-none" />
            <input
              type={showPassword ? "text" : "password"}
              {...register("password")}
              className={`${inputBase} pr-10`}
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)}
              className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-muted/60 hover:text-foreground transition-colors">
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Confirm Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted/60 pointer-events-none" />
            <input
              type={showConfirm ? "text" : "password"}
              {...register("confirmPassword")}
              className={`${inputBase} pr-10`}
            />
            <button type="button" onClick={() => setShowConfirm(!showConfirm)}
              className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-muted/60 hover:text-foreground transition-colors">
              {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>}
        </div>
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
              Create Account
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </>
          )}
        </span>
        <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
      </button>

      {/* Sign in link */}
      <p className="text-center text-sm text-muted">
        Already have an account?{" "}
        <Link href={routes.auth.signIn} className="font-medium text-primary hover:text-primary-light transition-colors">
          Sign in
        </Link>
      </p>
    </form>
  );
}
