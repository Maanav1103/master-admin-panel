"use client";
import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  forgotPasswordSchema, ForgotPasswordSchemaType,
  otpSchema, OtpSchemaType,
} from "@/utils/schemas";
import { useRouter } from "next/navigation";
import { routes } from "@/constants/routes";
import Link from "next/link";
import { Mail, ArrowRight, Loader2, ShieldCheck, RotateCcw } from "lucide-react";

const OTP_LENGTH = 6;
const RESEND_SECONDS = 60;

export default function ForgotPasswordForm() {
  const router = useRouter();
  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [otpError, setOtpError] = useState("");
  const [countdown, setCountdown] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // countdown timer
  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordSchemaType>({
    resolver: yupResolver(forgotPasswordSchema),
  });

  const {
    handleSubmit: handleOtpSubmit,
  } = useForm<OtpSchemaType>({
    resolver: yupResolver(otpSchema),
  });

  const onSendOtp = async (values: ForgotPasswordSchemaType) => {
    try {
      setLoading(true);
      await new Promise((r) => setTimeout(r, 800)); // replace with real API
      setEmail(values.email);
      setStep("otp");
      setCountdown(RESEND_SECONDS);
    } finally {
      setLoading(false);
    }
  };

  const onVerifyOtp = async () => {
    const code = otp.join("");
    if (code.length < OTP_LENGTH) {
      setOtpError("Please enter the complete 6-digit OTP");
      return;
    }
    if (!/^[0-9]{6}$/.test(code)) {
      setOtpError("OTP must be exactly 6 digits");
      return;
    }
    try {
      setLoading(true);
      setOtpError("");
      await new Promise((r) => setTimeout(r, 800)); // replace with real API
      router.push(routes.auth.resetPassword);
    } finally {
      setLoading(false);
    }
  };

  const onResend = async () => {
    if (countdown > 0) return;
    try {
      setLoading(true);
      await new Promise((r) => setTimeout(r, 600));
      setOtp(Array(OTP_LENGTH).fill(""));
      setOtpError("");
      setCountdown(RESEND_SECONDS);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return;
    const next = [...otp];
    next[index] = value;
    setOtp(next);
    setOtpError("");
    if (value && index < OTP_LENGTH - 1) inputRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (!pasted) return;
    e.preventDefault();
    const next = Array(OTP_LENGTH).fill("");
    pasted.split("").forEach((ch, i) => { next[i] = ch; });
    setOtp(next);
    inputRefs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
  };

  const inputBase =
    "w-full rounded-xl border border-border bg-surface pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted/50 outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/10";

  if (step === "otp") {
    return (
      <div className="space-y-5">
        {/* Icon */}
        <div className="flex flex-col items-center gap-2 mb-2">
          <div className="h-14 w-14 rounded-full bg-gradient-brand flex items-center justify-center shadow-lg shadow-primary/20">
            <ShieldCheck className="h-7 w-7 text-white" />
          </div>
          <p className="text-sm text-muted text-center">
            We sent a 6-digit code to<br />
            <span className="font-medium text-foreground">{email}</span>
          </p>
        </div>

        {/* OTP inputs */}
        <div className="flex justify-center gap-2" onPaste={handleOtpPaste}>
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={(el) => { inputRefs.current[i] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOtpChange(i, e.target.value)}
              onKeyDown={(e) => handleOtpKeyDown(i, e)}
              className={`h-12 w-11 rounded-xl border text-center text-lg font-semibold text-foreground bg-surface outline-none transition-all duration-200
                ${digit ? "border-primary ring-2 ring-primary/10" : "border-border"}
                focus:border-primary focus:ring-2 focus:ring-primary/10`}
            />
          ))}
        </div>
        {otpError && <p className="text-xs text-red-500 text-center">{otpError}</p>}

        {/* Verify button */}
        <button
          type="button"
          disabled={loading}
          onClick={onVerifyOtp}
          className="cursor-pointer group relative w-full overflow-hidden rounded-xl bg-gradient-brand py-3.5 text-sm font-semibold text-white tracking-wide transition-all duration-200 hover:shadow-lg hover:shadow-primary/25 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : (
              <> Verify OTP <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" /> </>
            )}
          </span>
          <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
        </button>

        {/* Resend */}
        <div className="flex items-center justify-center gap-1.5 text-sm text-muted">
          <span>Didn&apos;t receive the code?</span>
          <button
            type="button"
            onClick={onResend}
            disabled={countdown > 0 || loading}
            className="flex items-center gap-1 font-medium text-primary hover:text-primary-light transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            {countdown > 0 ? `Resend in ${countdown}s` : "Resend"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSendOtp)} noValidate className="space-y-5">
      <p className="text-sm text-muted text-center -mt-2">
        Enter your email and we&apos;ll send you a verification code.
      </p>

      {/* Email */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-foreground">Email address</label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted/60 pointer-events-none" />
          <input type="email" placeholder="you@example.com" {...register("email")} className={inputBase} />
        </div>
        {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="cursor-pointer group relative w-full overflow-hidden rounded-xl bg-gradient-brand py-3.5 text-sm font-semibold text-white tracking-wide transition-all duration-200 hover:shadow-lg hover:shadow-primary/25 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : (
            <> Send OTP <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" /> </>
          )}
        </span>
        <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
      </button>

      <p className="text-center text-sm text-muted">
        Remember your password?{" "}
        <Link href={routes.auth.signIn} className="font-medium text-primary hover:text-primary-light transition-colors">
          Sign in
        </Link>
      </p>
    </form>
  );
}
