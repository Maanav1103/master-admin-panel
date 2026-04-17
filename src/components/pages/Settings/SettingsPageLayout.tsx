"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { settingsSchema, SettingsSchemaType } from "@/utils/schemas";
import Breadcrumb from "@/components/custom-elements/Breadcrumb";
import { Loader2, Pencil, ImagePlus, X } from "lucide-react";
import Image from "next/image";

const inputBase =
  "w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-800 placeholder:text-gray-400 outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-default";

const MOCK_DEFAULTS: SettingsSchemaType = {
  websiteName: "My Awesome Website",
  websiteLogo: null,
  mailHost: "smtp.mailtrap.io",
  mailPort: 587,
  mailUser: "admin@example.com",
  mailPass: "secret_password",
  mailFrom: "no-reply@example.com",
  supportEmail: "support@example.com",
};

export function SettingsPageLayout() {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [savedLogo, setSavedLogo] = useState<string | null>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<SettingsSchemaType>({
    defaultValues: MOCK_DEFAULTS,
    resolver: yupResolver(settingsSchema),
  });

  const handleCancel = () => {
    reset(MOCK_DEFAULTS);
    setLogoPreview(savedLogo);
    setIsEditing(false);
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setValue("websiteLogo", file, { shouldValidate: true });
    const reader = new FileReader();
    reader.onload = () => setLogoPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    setValue("websiteLogo", null, { shouldValidate: true });
    setLogoPreview(null);
    if (logoInputRef.current) logoInputRef.current.value = "";
  };

  const onSubmit = async (values: SettingsSchemaType) => {
    try {
      setLoading(true);
      console.log("Settings saved:", values);
      await new Promise((r) => setTimeout(r, 800));
      if (logoPreview) setSavedLogo(logoPreview);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Breadcrumb pageName="Settings" />
        {!isEditing && (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="cursor-pointer flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/80 transition-colors"
          >
            <Pencil className="w-4 h-4" />
            Edit
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          {/* Left Column */}
          <div className="xl:col-span-2 space-y-6">

            {/* General */}
            <div className="bg-white rounded-xl shadow-sm p-6 space-y-5">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">General</h3>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Website Name</label>
                <input
                  type="text"
                  placeholder="Enter website name"
                  disabled={!isEditing}
                  {...register("websiteName")}
                  className={inputBase}
                />
                {errors.websiteName && <p className="text-xs text-red-500">{errors.websiteName.message}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Website Logo</label>
                {isEditing ? (
                  <div>
                    {logoPreview ? (
                      <div className="relative inline-block">
                        <Image src={logoPreview} alt="logo preview" height={32} width={32} className="h-32 w-32 rounded-lg object-contain border border-gray-200 bg-gray-50" />
                        <button
                          type="button"
                          onClick={handleRemoveLogo}
                          className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors shadow"
                        >
                          <X className="h-3 w-3 cursor-pointer" />
                        </button>
                        <label className="mt-2 flex cursor-pointer items-center gap-1.5 text-xs text-primary hover:underline">
                          <ImagePlus className="h-3.5 w-3.5" /> Change logo
                          <input ref={logoInputRef} type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={handleLogoChange} />
                        </label>
                      </div>
                    ) : (
                      <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 py-8 hover:border-primary hover:bg-primary/5 transition-colors">
                        <ImagePlus className="h-8 w-8 text-gray-400" />
                        <p className="text-sm font-medium text-gray-700">Click to upload logo</p>
                        <p className="text-xs text-gray-400">PNG, JPG, WEBP · Max 2MB</p>
                        <input ref={logoInputRef} type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={handleLogoChange} />
                      </label>
                    )}
                  </div>
                ) : (
                  savedLogo ? (
                    <Image src={savedLogo} alt="website logo" height={32} width={32} className="h-32 w-32 rounded-lg object-contain border border-gray-200 bg-gray-50" />
                  ) : (
                    <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded bg-gray-100">
                        <ImagePlus className="h-5 w-5 text-gray-400" />
                      </div>
                      <span className="text-sm text-gray-500">No logo uploaded</span>
                    </div>
                  )
                )}
                {errors.websiteLogo && <p className="text-xs text-red-500">{errors.websiteLogo.message as string}</p>}
              </div>
            </div>

            {/* SMTP */}
            <div className="bg-white rounded-xl shadow-sm p-6 space-y-5">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">SMTP Configuration</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">MAIL_HOST</label>
                  <input type="text" placeholder="smtp.example.com" disabled={!isEditing} {...register("mailHost")} className={inputBase} />
                  {errors.mailHost && <p className="text-xs text-red-500">{errors.mailHost.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">MAIL_PORT</label>
                  <input type="number" placeholder="587" disabled={!isEditing} {...register("mailPort")} className={inputBase} />
                  {errors.mailPort && <p className="text-xs text-red-500">{errors.mailPort.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">MAIL_USER</label>
                  <input type="email" placeholder="user@example.com" disabled={!isEditing} {...register("mailUser")} className={inputBase} />
                  {errors.mailUser && <p className="text-xs text-red-500">{errors.mailUser.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">MAIL_PASS</label>
                  <input type="password" placeholder="••••••••" disabled={!isEditing} {...register("mailPass")} className={inputBase} />
                  {errors.mailPass && <p className="text-xs text-red-500">{errors.mailPass.message}</p>}
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-sm font-medium text-gray-700">MAIL_FROM</label>
                  <input type="email" placeholder="no-reply@example.com" disabled={!isEditing} {...register("mailFrom")} className={inputBase} />
                  {errors.mailFrom && <p className="text-xs text-red-500">{errors.mailFrom.message}</p>}
                </div>
              </div>
            </div>

          </div>

          {/* Right Column */}
          <div className="space-y-6">

            <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Support</h3>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Support Email</label>
                <input type="email" placeholder="support@example.com" disabled={!isEditing} {...register("supportEmail")} className={inputBase} />
                {errors.supportEmail && <p className="text-xs text-red-500">{errors.supportEmail.message}</p>}
              </div>
            </div>

            {isEditing && (
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="cursor-pointer flex-1 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-semibold py-2.5 text-sm transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="cursor-pointer flex-1 rounded-lg bg-primary hover:bg-primary/80 text-white font-semibold py-2.5 text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Changes"}
                </button>
              </div>
            )}

          </div>
        </div>
      </form>
    </div>
  );
}
