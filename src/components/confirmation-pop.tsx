"use client";
import { MouseEventHandler, ReactElement, ReactNode, useRef } from "react";

import { AppModal } from "./app-modal";

interface ComfirmationPopupProps {
  popUpTitle: string;
  popUpContent?: ReactNode;
  popUpDescription?: string;
  submitButtonText: string;
  submitButtonHandler: Function;
  children: ReactElement;
}
export default function ComfirmationPopup({
  popUpTitle,
  popUpContent,
  popUpDescription,
  submitButtonText,
  submitButtonHandler,
  children,
}: ComfirmationPopupProps): ReactElement {
  const dialogRef = useRef(null);
  return (
    <AppModal
      modalTitle={popUpTitle}
      modalContent={popUpContent}
      modalDescription={popUpDescription}
      showSubmitButton={true}
      submitButtonHandler={async () => {
        await submitButtonHandler();
      }}
      submitButtonText={submitButtonText}
      dialogRef={dialogRef}
    >
      {children}
    </AppModal>
  );
}
