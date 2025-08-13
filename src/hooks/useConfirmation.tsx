import { useState } from "react";
import { ConfirmationModal } from "../components/shared/ConfirmationModal";

type ConfirmationOptions = {
  title?: string;
  message: string;
};

export const useConfirmation = () => {
  const [options, setOptions] = useState<ConfirmationOptions | null>(null);
  const [resolveFn, setResolveFn] = useState<(value: boolean) => void>();

  const requestConfirmation = (opts: ConfirmationOptions) => {
    setOptions(opts);
    return new Promise<boolean>((resolve) => setResolveFn(() => resolve));
  };

  const handleConfirm = () => {
    resolveFn?.(true);
    setOptions(null);
  };

  const handleCancel = () => {
    resolveFn?.(false);
    setOptions(null);
  };

  const ConfirmationModalComponent = options ? (
    <ConfirmationModal
      visible={!!options}
      title={options.title}
      message={options.message}
      onConfirm={handleConfirm}
      onCancel={handleCancel}
    />
  ) : null;

  return { requestConfirmation, ConfirmationModalComponent };
};
