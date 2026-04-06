"use client";
import { Logo } from "@/components/shared/logo";
import SignupWithPassword from "./SignupWithPassword";

export const SignUp = () => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-surface flex items-center justify-center p-4">

      {/* Background decorative blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full opacity-15 blur-3xl bg-gradient-brand" />
        <div className="absolute -bottom-40 -right-40 h-[600px] w-[600px] rounded-full opacity-10 blur-3xl bg-gradient-brand" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[300px] w-[300px] rounded-full opacity-5 blur-2xl bg-gradient-brand" />
      </div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-lg my-8">

        {/* Glassy top accent bar */}
        <div className="h-1.5 w-full rounded-t-2xl bg-gradient-brand" />

        <div className="rounded-b-2xl bg-surface-card shadow-2xl shadow-primary/10 border border-border px-10 py-10">

          {/* Logo + branding */}
          <div className="mb-8 flex flex-col items-center gap-3">
            <Logo size={52} />
            <div className="text-center">
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                Admin<span className="text-gradient-brand">Panel</span>
              </h1>
              <p className="mt-1 text-sm text-muted">
                Create your account
              </p>
            </div>
          </div>

          <SignupWithPassword />
        </div>
      </div>
    </div>
  );
};
