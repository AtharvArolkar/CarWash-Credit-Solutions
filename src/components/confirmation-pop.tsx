"use client";
import { ReactElement, ReactNode, useRef, useState } from "react";
import { toast } from "sonner";

import Loading from "@/app/loading";

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
  const [loading, setLoading] = useState<boolean>(false);
  return (
    <>
      {loading && <Loading />}
      <AppModal
        modalTitle={popUpTitle}
        modalContent={popUpContent}
        modalDescription={popUpDescription}
        showSubmitButton={true}
        submitButtonHandler={async () => {
          setLoading(true);
          await submitButtonHandler();
          setLoading(false);
          toast.success("User deleted successfully.");
          // @ts-ignore: Object is possibly 'null'.
          dialogRef.current.click();
        }}
        submitButtonText={submitButtonText}
        dialogRef={dialogRef}
      >
        {children}
      </AppModal>
    </>
  );
}
