"use client";
import { MouseEventHandler, ReactNode } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface AppModalProps {
  modalTitle: string | ReactNode;
  modalDescription?: string | ReactNode;
  modalContent: ReactNode;
  showSubmitButton?: boolean;
  submitButtonText?: string;
  submitButtonHandler?: MouseEventHandler<HTMLButtonElement>;
}

export function AppModal({
  modalTitle,
  modalDescription,
  modalContent,
  showSubmitButton = true,
  submitButtonText,
  submitButtonHandler,
}: AppModalProps) {
  return (
    <Dialog>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{modalTitle}</DialogTitle>
          {modalDescription && (
            <DialogDescription>{modalDescription}</DialogDescription>
          )}
        </DialogHeader>
        {modalContent}
        {showSubmitButton && (
          <DialogFooter>
            <Button
              className="mt-5 text-sm bg-gradient-to-r from-[#3458D6] to-blue-400"
              onClick={submitButtonHandler}
              type="submit"
            >
              {submitButtonText}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
