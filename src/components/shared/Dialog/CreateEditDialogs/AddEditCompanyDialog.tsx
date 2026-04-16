"use client";

import React from "react";
import InputGroup from "@/components/custom-elements/InputGroup";
import { CustomButton } from "@/components/custom-elements/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useFormik } from "formik";
import * as Yup from "yup";

interface AddEditCompanyDialogProps {
  isOpen: boolean;
  onClose: () => void;
  isEditing: boolean;
  companyData?: CompanyFormData & { id?: number } | null;
  onSubmit: (values: CompanyFormData, id?: number) => void;
}

export interface CompanyFormData {
  company_name: string;
  type: string;
  url: string;
}

const companySchema = Yup.object({
  company_name: Yup.string().required("Company name is required"),
  type: Yup.string().required("Type is required"),
  url: Yup.string().url("Must be a valid URL").required("URL is required"),
});

export function AddEditCompanyDialog({
  isOpen,
  onClose,
  isEditing,
  companyData,
  onSubmit,
}: AddEditCompanyDialogProps) {
  const formik = useFormik<CompanyFormData>({
    initialValues: {
      company_name: companyData?.company_name || "",
      type: companyData?.type || "",
      url: companyData?.url || "",
    },
    validationSchema: companySchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      onSubmit(values, companyData?.id);
      handleClose();
    },
  });

  const handleClose = () => {
    formik.resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent onOpenAutoFocus={(e) => e.preventDefault()} className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Company" : "Add Company"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={formik.handleSubmit} noValidate>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <InputGroup
              name="company_name"
              value={formik.values.company_name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={!!(formik.touched.company_name && formik.errors.company_name)}
              errorMessage={formik.errors.company_name}
              className="w-full"
              type="text"
              label="Company Name"
              placeholder="Enter company name"
              height="sm"
            />
            <InputGroup
              name="type"
              value={formik.values.type}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={!!(formik.touched.type && formik.errors.type)}
              errorMessage={formik.errors.type}
              className="w-full"
              type="text"
              label="Type"
              placeholder="Enter company type"
              height="sm"
            />
            <div className="sm:col-span-2">
              <InputGroup
                name="url"
                value={formik.values.url}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={!!(formik.touched.url && formik.errors.url)}
                errorMessage={formik.errors.url}
                className="w-full"
                type="url"
                label="URL"
                placeholder="https://example.com"
                height="sm"
              />
            </div>
          </div>

          <div className="mt-5 flex justify-end gap-3">
            <button
              className="rounded-lg border border-stroke px-6 py-[7px] font-medium text-dark hover:shadow-1"
              type="button"
              onClick={handleClose}
            >
              Cancel
            </button>
            <CustomButton
              className="rounded-lg px-6 py-[7px] font-medium text-gray-2 hover:bg-opacity-90"
              type="submit"
              label={isEditing ? "Update Company" : "Add Company"}
              disabled={!formik.dirty || !formik.isValid}
            />
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
