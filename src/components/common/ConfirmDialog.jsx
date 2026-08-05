import { useState } from "react";

import Modal from "./Modal";
import Button from "./Button";

function ConfirmDialog({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmLabel = "Delete",
    isDangerous = true,
}) {
    const [isLoading, setIsLoading] = useState(false);

    const handleConfirm = async () => {
        try {
            setIsLoading(true);

            await onConfirm();

            onClose();
        } catch (error) {
            console.error("Confirmation action failed:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        if (!isLoading) {
            onClose();
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title={title}
            size="sm"
        >
            <div className="space-y-5">
                <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
                    {message}
                </p>

                <div className="flex justify-end gap-3">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={handleClose}
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>

                    <Button
                        type="button"
                        variant={isDangerous ? "danger" : "primary"}
                        onClick={handleConfirm}
                        isLoading={isLoading}
                    >
                        {confirmLabel}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}

export default ConfirmDialog;