import { useState } from "react";
import { ConfirmationModal } from "../components/shared/ConfirmationModal";

type ConfirmationOptions = {
  title?: string;
  message: string;
};

export const useConfirmation = () => {
  const [options, setOptions] = useState<ConfirmationOptions | null>(null);
  const [resolveFn, setResolveFn] = useState<((value: boolean) => void) | null>(
    null
  );

  const requestConfirmation = (opts: ConfirmationOptions) => {
    return new Promise<boolean>((resolve) => {
      setResolveFn(() => resolve); // store resolver correctly
      setOptions(opts); // show modal
    });
  };

  const handleConfirm = () => {
    resolveFn?.(true);
    setResolveFn(null);
    setOptions(null);
  };

  const handleCancel = () => {
    resolveFn?.(false);
    setResolveFn(null);
    setOptions(null);
  };

  const ConfirmationModalComponent = options ? (
    <ConfirmationModal
      visible={true}
      title={options.title}
      message={options.message}
      onConfirm={handleConfirm}
      onCancel={handleCancel}
    />
  ) : null;

  return { requestConfirmation, ConfirmationModalComponent };
};
