/* eslint-disable @typescript-eslint/no-explicit-any */

export const routes = {
  auth: {
    signIn: "/sign-in",
    signUp: "/sign-up",
    forgotPassword: "/forgot-password",
    resetPassword: "/reset-password",
  },
  dashboard: "/dashboard",
  cms: "/cms",
  profile: "/profile",
  crud: "/crud",
  settings: "/settings",
} as const;

export const publicRoutes: string[] = [
  routes.auth.signIn,
  routes.auth.signUp,
  routes.auth.forgotPassword,
  routes.auth.resetPassword,
];

export const protectedRoutes: string[] = [
  routes.dashboard,
];
