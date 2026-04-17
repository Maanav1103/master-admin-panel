import * as Yup from "yup";

export const settingsSchema = Yup.object({
  websiteName: Yup.string().trim().min(2, "Website name must be at least 2 characters").required("Website name is required"),
  websiteLogo: Yup.mixed<File>().nullable().defined()
    .test("fileSize", "Logo must be less than 2MB", (v) => !v || (v instanceof File && v.size <= 2 * 1024 * 1024))
    .test("fileType", "Only JPG, PNG or WEBP allowed", (v) => !v || (v instanceof File && ["image/jpeg", "image/png", "image/webp"].includes(v.type))),
  mailHost: Yup.string().trim().required("Mail host is required"),
  mailPort: Yup.number().positive("Port must be positive").integer("Port must be an integer").required("Mail port is required"),
  mailUser: Yup.string().trim().email("Please enter a valid email").required("Mail user is required"),
  mailPass: Yup.string().trim().required("Mail password is required"),
  mailFrom: Yup.string().trim().email("Please enter a valid email").required("Mail from is required"),
  supportEmail: Yup.string().trim().email("Please enter a valid email").required("Support email is required"),
});

export type SettingsSchemaType = Yup.InferType<typeof settingsSchema>;
