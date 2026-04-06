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

  email: Yup.string()
    .trim()
    .lowercase()
    .email("Please enter a valid email address")
    .required("Email is required"),

  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password must not exceed 128 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[0-9]/, "Password must contain at least one digit")
    .matches(/[^A-Za-z0-9]/, "Password must contain at least one special character")
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
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[0-9]/, "Password must contain at least one digit")
    .matches(/[^A-Za-z0-9]/, "Password must contain at least one special character")
    .required("New password is required"),

  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword")], "Passwords do not match")
    .required("Please confirm your password"),
});

export type ResetPasswordSchemaType = Yup.InferType<typeof resetPasswordSchema>;

export const cmsPageSchema = Yup.object({
  title: Yup.string().trim().min(2, "Page name must be at least 2 characters").required("Page name is required"),
  slug: Yup.string().trim().matches(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers and hyphens").required("Slug is required"),
  content: Yup.string().test("not-empty", "Content is required", (v) => !!v && v.replace(/<[^>]*>/g, "").trim().length > 0).required("Content is required"),
  metaTag: Yup.string().trim().default(""),
  metaTitle: Yup.string().trim().default(""),
  metaDescription: Yup.string().trim().max(160, "Meta description should not exceed 160 characters").default(""),
  isPublished: Yup.boolean().default(false),
});

export type CMSPageSchemaType = Yup.InferType<typeof cmsPageSchema>;