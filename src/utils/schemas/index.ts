import * as Yup from "yup";

export const signInSchema = Yup.object({
  email: Yup.string()
    .trim()
    .lowercase()
    .email("Please enter a valid email address")
    .required("Email is required"),

  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password must not exceed 128 characters")
    .required("Password is required"),

  rememberMe: Yup.boolean().default(false),
});

export type SignInSchemaType = Yup.InferType<typeof signInSchema>;

export const signUpSchema = Yup.object({
  firstName: Yup.string()
    .trim()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must not exceed 50 characters")
    .required("First name is required"),

  lastName: Yup.string()
    .trim()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must not exceed 50 characters")
    .required("Last name is required"),

  fullName: Yup.string()
    .trim()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name must not exceed 100 characters")
    .required("Full name is required"),

  email: Yup.string()
    .trim()
    .lowercase()
    .email("Please enter a valid email address")
    .required("Email is required"),

  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password must not exceed 128 characters")
    .matches(/[A-Z]/, "Must contain at least one uppercase letter")
    .matches(/[0-9]/, "Must contain at least one number")
    .required("Password is required"),

  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords do not match")
    .required("Please confirm your password"),

  profileImage: Yup.mixed<File>()
    .nullable()
    .test("fileSize", "Image must be less than 2MB", (v) =>
      !v || (v instanceof File && v.size <= 2 * 1024 * 1024)
    )
    .test("fileType", "Only JPG, PNG or WEBP allowed", (v) =>
      !v || (v instanceof File && ["image/jpeg", "image/png", "image/webp"].includes(v.type))
    )
    .default(null),
});

export type SignUpSchemaType = Yup.InferType<typeof signUpSchema>;

export const forgotPasswordSchema = Yup.object({
  email: Yup.string()
    .trim()
    .lowercase()
    .email("Please enter a valid email address")
    .required("Email is required"),
});

export type ForgotPasswordSchemaType = Yup.InferType<typeof forgotPasswordSchema>;

export const otpSchema = Yup.object({
  otp: Yup.string()
    .matches(/^[0-9]{6}$/, "OTP must be exactly 6 digits")
    .required("OTP is required"),
});

export type OtpSchemaType = Yup.InferType<typeof otpSchema>;

export const resetPasswordSchema = Yup.object({
  newPassword: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password must not exceed 128 characters")
    .matches(/[A-Z]/, "Must contain at least one uppercase letter")
    .matches(/[0-9]/, "Must contain at least one number")
    .required("New password is required"),

  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword")], "Passwords do not match")
    .required("Please confirm your password"),
});

export type ResetPasswordSchemaType = Yup.InferType<typeof resetPasswordSchema>;