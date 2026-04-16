"use client";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface EditQuizDialogPropTypes {
  quizDetails: any;
  isOpen: boolean;
  onClose: () => void;
}

export function ViewDialog({
  isOpen,
  onClose,
  quizDetails,
}: EditQuizDialogPropTypes) {
  const [question, setQuestion] = useState<string>("");
  const [options, setOptions] = useState<
    { optionId?: number; optionText: string }[]
  >([{ optionText: "" }, { optionText: "" }]);

  useEffect(() => {
    if (!quizDetails) return;
    setQuestion(quizDetails.questionText || "");
    const opts = (quizDetails.options || []).map((o: any) => ({
      optionId: o.optionId,
      optionText: o.optionText,
    }));
    if (opts.length > 0) setOptions(opts);
  }, [quizDetails]);

  if (!quizDetails) {
    return null;
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
    >
      <DialogContent
        className="sm:max-w-2xl"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle></DialogTitle>
        </DialogHeader>
        <div className="mt-2">
          <div className="bg-gray-50 rounded-lg p-4 mb-4 shadow">
            <h3 className="text-lg font-semibold text-violet-700 mb-2">
              Question
            </h3>
            <p className="text-base text-gray-800">{question}</p>
          </div>
          <div className="space-y-2">
            <h4 className="text-md font-medium text-violet-600 mb-2">
              Options
            </h4>
            {options.map((opt, idx) => (
              <div
                key={idx}
                className="bg-white border rounded-md px-4 py-2 shadow-sm flex items-center"
              >
                <span className="text-gray-800">{opt.optionText}</span>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
