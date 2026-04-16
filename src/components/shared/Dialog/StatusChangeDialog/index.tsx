import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CustomButton } from "@/components/custom-elements/button";

interface StatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  currentStatus: "Active" | "Inactive" | 0 | 1;
  itemTitle: string;
  disabled?: boolean;
  dialogTitle: string;
}

const StatusModal: React.FC<StatusModalProps> = ({
  dialogTitle,
  isOpen,
  onClose,
  onConfirm,
  currentStatus,
  itemTitle,
  disabled,
}) => {
  const newStatus = currentStatus === 0 ? "Active" : "Inactive";

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
        </DialogHeader>
        {/* <h2 className="mb-4 text-lg font-bold text-gray-800">{dialogTitle}</h2> */}
        <p className="mb-4 mt-3 text-gray-600">
          Are you sure you want to mark{" "}
          <span className="font-semibold">{itemTitle}</span> as{" "}
          <span
            className={`font-bold ${
              newStatus === "Inactive" ? "text-red-600" : "text-green-600"
            }`}
          >
            {newStatus}
          </span>
          ?
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg bg-gray-200 px-4 py-2 text-gray-700 transition hover:bg-gray-300"
          >
            Cancel
          </button>
          {/* <button
            disabled={disabled}
            onClick={onConfirm}
            className={`px-4 py-2 ${
              newStatus === "Active"
                ? "bg-green-600 hover:bg-green-700"
                : "bg-red-600 hover:bg-red-700"
            } rounded-lg text-white transition`}
          >
            Confirm
          </button> */}
          <CustomButton
            onClick={onConfirm}
            disabled={disabled}
            type="button"
            label="Confirm"
            className="rounded-lg px-6 py-2 font-medium text-white hover:bg-opacity-90"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StatusModal;
