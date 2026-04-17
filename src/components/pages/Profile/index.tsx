"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import Breadcrumb from "@/components/custom-elements/Breadcrumb";
import { LocalStorageGetItem, LocalStorageSetItem } from "@/utils/helpers";
import { Camera, Loader2, UserCircle, X, Pencil } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";

const profileSchema = Yup.object({
  fullName: Yup.string().trim().min(2, "Name must be at least 2 characters").required("Full name is required"),
  email: Yup.string().trim().email("Please enter a valid email").required("Email is required"),
});

type ProfileFormType = Yup.InferType<typeof profileSchema>;

const inputBase =
  "w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary";

export function ProfilePage() {
  const [preview, setPreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileFormType>({
    resolver: yupResolver(profileSchema) as any,
  });

  useEffect(() => {
    const admin = LocalStorageGetItem("adminDetails");
    if (admin) {
      reset({ fullName: admin.fullName ?? "", email: admin.email ?? "" });
      if (admin.profileImage) setPreview(admin.profileImage);
    }
  }, [reset]);

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImageFile(null);
    setPreview(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleCancel = () => {
    const admin = LocalStorageGetItem("adminDetails");
    reset({ fullName: admin?.fullName ?? "", email: admin?.email ?? "" });
    setPreview(admin?.profileImage ?? null);
    setImageFile(null);
    setIsEditing(false);
  };

  const onSubmit = async (values: ProfileFormType) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));

    let profileImage = preview;

    // convert file to base64 for localStorage persistence
    if (imageFile) {
      profileImage = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(imageFile);
      });
    }

    const existing = LocalStorageGetItem("adminDetails") ?? {};
    const updated = { ...existing, ...values, profileImage };
    LocalStorageSetItem("adminDetails", updated);
    window.dispatchEvent(new Event("adminDetailsUpdated"));

    setLoading(false);
    toast.success("Profile updated successfully");
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Breadcrumb pageName="Profile" />
        {!isEditing && (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="cursor-pointer flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/80 transition-colors"
          >
            <Pencil className="w-4 h-4" />
            Edit Profile
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          {/* Avatar card */}
          <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col items-center gap-4">
            <div
              className={`relative group ${isEditing ? 'cursor-pointer' : 'cursor-default'}`}
              onClick={() => isEditing && fileRef.current?.click()}
            >
              <div className={`w-28 h-28 rounded-full border-2 border-dashed ${isEditing ? 'border-gray-300 group-hover:border-primary' : 'border-transparent'} overflow-hidden flex items-center justify-center bg-gray-50 transition-colors`}>
                {preview ? (
                  <Image src={preview} alt="Profile" fill className="object-cover rounded-full" />
                ) : (
                  <UserCircle className="w-16 h-16 text-gray-300" />
                )}
              </div>
              {isEditing && (
                <div className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-md">
                  <Camera className="w-4 h-4 text-white" />
                </div>
              )}
              {preview && isEditing && (
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); removeImage(); }}
                  className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-red-500 flex items-center justify-center shadow"
                >
                  <X className="w-3 h-3 text-white" />
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
            <div className="text-center">
              <p className="text-sm font-semibold text-gray-800">Profile Photo</p>
              <p className="text-xs text-gray-400 mt-0.5">JPG, PNG or WEBP</p>
            </div>
          </div>

          {/* Details card */}
          <div className="xl:col-span-2 bg-white rounded-xl shadow-sm p-6 space-y-5">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Admin Details</h3>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                placeholder="Enter full name"
                disabled={!isEditing}
                {...register("fullName")}
                className={inputBase}
              />
              {errors.fullName && <p className="text-xs text-red-500">{errors.fullName.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Email Address</label>
              <input
                type="email"
                placeholder="Enter email address"
                disabled={!isEditing}
                {...register("email")}
                className={inputBase}
              />
              {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
            </div>

            {isEditing && (
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="cursor-pointer px-5 py-2.5 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-sm font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="cursor-pointer px-5 py-2.5 rounded-lg bg-primary hover:bg-primary/80 text-white text-sm font-semibold transition-colors flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
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
