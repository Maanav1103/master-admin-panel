"use client";

import React, { useState } from "react";
import InputGroup from "@/components/custom-elements/InputGroup";
import { CustomButton } from "@/components/custom-elements/button";
import { Checkbox } from "@/components/custom-elements/Checkbox";
import SingleCalendarRangePicker from "@/components/custom-elements/SingleCalendarRangePicker";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import dynamic from "next/dynamic";
import { useFormik } from "formik";
import * as Yup from "yup";
import { X, FileText, ImageIcon, Film, Paperclip } from "lucide-react";
import { CrudItem } from "@/components/shared/Tables/CrudTable";

const CustomDropdown = dynamic(() => import("@/components/custom-elements/CustomDropdown"), { ssr: false });

interface AddEditCrudDialogProps {
  isOpen: boolean;
  onClose: () => void;
  isEditing: boolean;
  itemData?: CrudItem | null;
  onSubmit: (values: CrudFormData, id?: number) => void;
}

export interface CrudFormData {
  name: string;
  category: string;
  email: string;
  gender: string;
  skills: string[];
  dateRange: { from: string; to: string } | null;
  notes: string;
  avatar: string;
  documents: string[];
}

const SKILL_OPTIONS = [
  { value: "React", label: "React" },
  { value: "Vue", label: "Vue" },
  { value: "Node", label: "Node" },
  { value: "Design", label: "Design" },
  { value: "Python", label: "Python" },
];

const CATEGORY_OPTIONS = [
  { value: "Admin", label: "Admin" },
  { value: "Editor", label: "Editor" },
  { value: "Viewer", label: "Viewer" },
];

const crudSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  category: Yup.string().required("Category is required"),
  email: Yup.string().email("Must be a valid email").required("Email is required"),
  gender: Yup.string().required("Gender is required"),
  skills: Yup.array().min(1, "Select at least one skill"),
});

export function AddEditCrudDialog({
  isOpen,
  onClose,
  isEditing,
  itemData,
  onSubmit,
}: AddEditCrudDialogProps) {
  const [dateRangeOpen, setDateRangeOpen] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string>(itemData?.avatar || "");
  const [docFiles, setDocFiles] = useState<File[]>([]);

  const formik = useFormik<CrudFormData>({
    initialValues: {
      name: itemData?.name || "",
      category: itemData?.category || "",
      email: itemData?.email || "",
      gender: itemData?.gender || "",
      skills: itemData?.skills || [],
      dateRange: itemData?.dateRange || null,
      notes: itemData?.notes || "",
      avatar: itemData?.avatar || "",
      documents: itemData?.documents || [],
    },
    validationSchema: crudSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      onSubmit(values, itemData?.id);
      handleClose();
    },
  });

  const handleClose = () => {
    formik.resetForm();
    setAvatarPreview("");
    setDocFiles([]);
    setDateRangeOpen(false);
    onClose();
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setAvatarPreview(url);
    formik.setFieldValue("avatar", file.name);
  };

  const handleDocsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setDocFiles((prev) => [...prev, ...files]);
    formik.setFieldValue("documents", [...docFiles, ...files].map((f) => f.name));
  };

  const removeDoc = (index: number) => {
    const updated = docFiles.filter((_, i) => i !== index);
    setDocFiles(updated);
    formik.setFieldValue("documents", updated.map((f) => f.name));
  };

  const getFileIcon = (name: string) => {
    const ext = name.split(".").pop()?.toLowerCase();
    if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext || "")) return <ImageIcon className="h-4 w-4 text-blue-500" />;
    if (["mp4", "mov", "avi"].includes(ext || "")) return <Film className="h-4 w-4 text-purple-500" />;
    if (["pdf", "doc", "docx"].includes(ext || "")) return <FileText className="h-4 w-4 text-red-500" />;
    return <Paperclip className="h-4 w-4 text-gray-500" />;
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent onOpenAutoFocus={(e) => e.preventDefault()} className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Item" : "Add Item"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={formik.handleSubmit} noValidate>
          <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2">

            {/* Input — Name */}
            <InputGroup
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={!!(formik.touched.name && formik.errors.name)}
              errorMessage={formik.errors.name}
              className="w-full"
              type="text"
              label="Name"
              placeholder="Enter name"
              height="sm"
            />

            {/* Input — Email */}
            <InputGroup
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={!!(formik.touched.email && formik.errors.email)}
              errorMessage={formik.errors.email}
              className="w-full"
              type="email"
              label="Email"
              placeholder="example@email.com"
              height="sm"
            />

            {/* Single Dropdown — Category */}
            <div>
              <label className="text-sm font-medium text-gray-700">Category</label>
              <div className="mt-1">
                <CustomDropdown
                  options={CATEGORY_OPTIONS}
                  placeholder="Select category"
                  value={formik.values.category}
                  onChange={(val) => formik.setFieldValue("category", val)}
                  width="w-full"
                  error={!!(formik.touched.category && formik.errors.category)}
                  errorMessage={formik.errors.category as string}
                />
              </div>
              {formik.touched.category && formik.errors.category && (
                <p className="mt-1 text-sm text-red-500">{formik.errors.category}</p>
              )}
            </div>

            {/* Multi Dropdown — Skills */}
            <div>
              <label className="text-sm font-medium text-gray-700">Skills</label>
              <div className="mt-1">
                <CustomDropdown
                  multiple
                  options={SKILL_OPTIONS}
                  placeholder="Select skills"
                  value={formik.values.skills}
                  onChange={(val) => formik.setFieldValue("skills", val)}
                  width="w-full"
                  showSelectAll
                />
              </div>
              {formik.touched.skills && formik.errors.skills && (
                <p className="mt-1 text-sm text-red-500">{formik.errors.skills as string}</p>
              )}
            </div>

            {/* Radio — Gender */}
            <div className="sm:col-span-2">
              <label className="text-sm font-medium text-gray-700">Gender</label>
              <div className="mt-2 flex items-center gap-6">
                {["male", "female", "other"].map((g) => (
                  <label key={g} className="flex cursor-pointer items-center gap-2 text-sm font-medium text-gray-700 capitalize">
                    <input
                      type="radio"
                      name="gender"
                      value={g}
                      checked={formik.values.gender === g}
                      onChange={() => formik.setFieldValue("gender", g)}
                      className="h-4 w-4 cursor-pointer accent-primary"
                    />
                    {g}
                  </label>
                ))}
              </div>
              {formik.touched.gender && formik.errors.gender && (
                <p className="mt-1 text-sm text-red-500">{formik.errors.gender}</p>
              )}
            </div>

            {/* Checkbox — Agree to terms (example) */}
            <div className="sm:col-span-2">
              <label className="text-sm font-medium text-gray-700 block mb-2">Preferences</label>
              <div className="flex flex-wrap gap-4">
                {["Newsletter", "SMS Alerts", "Email Notifications"].map((pref) => (
                  <Checkbox
                    key={pref}
                    label={pref}
                    withIcon="check"
                    withBg
                    checked={formik.values.skills.includes(pref)}
                    onChange={(e) => {
                      const current = formik.values.skills;
                      formik.setFieldValue(
                        "skills",
                        e.target.checked ? [...current, pref] : current.filter((s) => s !== pref)
                      );
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Date Range */}
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Date Range</label>
              <SingleCalendarRangePicker
                from={formik.values.dateRange ? new Date(formik.values.dateRange.from) : null}
                to={formik.values.dateRange ? new Date(formik.values.dateRange.to) : null}
                open={dateRangeOpen}
                onOpenChange={setDateRangeOpen}
                onApply={(from, to) => {
                  formik.setFieldValue("dateRange", {
                    from: from.toISOString().split("T")[0],
                    to: to.toISOString().split("T")[0],
                  });
                }}
                onCancel={() => formik.setFieldValue("dateRange", null)}
              />
            </div>

            {/* Textarea — Notes */}
            <div className="sm:col-span-2">
              <label className="text-sm font-medium text-gray-700 block mb-1">Notes</label>
              <textarea
                name="notes"
                rows={3}
                value={formik.values.notes}
                onChange={formik.handleChange}
                placeholder="Enter notes..."
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-800 shadow-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none"
              />
            </div>

            {/* File Upload — Single image (avatar) */}
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Avatar (Image)</label>
              <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-4 text-center hover:border-primary hover:bg-primary/5 transition-colors">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="avatar" className="h-16 w-16 rounded-full object-cover" />
                ) : (
                  <>
                    <ImageIcon className="h-8 w-8 text-gray-400 mb-1" />
                    <span className="text-xs text-gray-500">Click to upload image</span>
                    <span className="text-[11px] text-gray-400 mt-0.5">PNG, JPG, WEBP</span>
                  </>
                )}
                <input type="file" accept="image/*" className="sr-only" onChange={handleAvatarChange} />
              </label>
            </div>

            {/* File Upload — Multiple (docs, images, videos) */}
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Documents / Media</label>
              <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-4 text-center hover:border-primary hover:bg-primary/5 transition-colors">
                <Paperclip className="h-8 w-8 text-gray-400 mb-1" />
                <span className="text-xs text-gray-500">Click to upload files</span>
                <span className="text-[11px] text-gray-400 mt-0.5">PDF, DOC, Images, Videos</span>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,image/*,video/*"
                  className="sr-only"
                  onChange={handleDocsChange}
                />
              </label>
              {docFiles.length > 0 && (
                <ul className="mt-2 space-y-1">
                  {docFiles.map((file, i) => (
                    <li key={i} className="flex items-center justify-between rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm">
                      <div className="flex items-center gap-2 min-w-0">
                        {getFileIcon(file.name)}
                        <span className="truncate text-gray-700">{file.name}</span>
                      </div>
                      <button type="button" onClick={() => removeDoc(i)} className="ml-2 shrink-0 text-gray-400 hover:text-red-500">
                        <X className="h-4 w-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              className="rounded-lg border border-stroke px-6 py-[7px] font-medium text-dark cursor-pointer hover:shadow-1"
              type="button"
              onClick={handleClose}
            >
              Cancel
            </button>
            <CustomButton
              className="rounded-lg px-6 py-[7px] font-medium text-white cursor-pointer hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              type="submit"
              label={isEditing ? "Update Item" : "Add Item"}
              disabled={!formik.dirty || !formik.isValid}
            />
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
