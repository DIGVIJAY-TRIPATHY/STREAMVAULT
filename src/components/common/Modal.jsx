import {
    useEffect,
    useRef,
} from "react";
import ReactDOM from "react-dom";
import { X } from "lucide-react";

function Modal({
    isOpen,
    onClose,
    title,
    children,
    size = "md",
}) {
    const modalRef = useRef(null);
    const previousFocusRef = useRef(null);

    const sizes = {
        sm: "max-w-sm",
        md: "max-w-lg",
        lg: "max-w-2xl",
    };

    // Handle focus, Escape key, and focus trapping
    useEffect(() => {
        if (!isOpen) return;

        previousFocusRef.current = document.activeElement;

        const modal = modalRef.current;

        if (!modal) return;

        const getFocusableElements = () => {
            return modal.querySelectorAll(
                `
                button:not([disabled]),
                [href],
                input:not([disabled]),
                select:not([disabled]),
                textarea:not([disabled]),
                [tabindex]:not([tabindex="-1"])
                `
            );
        };

        // Focus the first focusable element
        const focusableElements = getFocusableElements();

        if (focusableElements.length > 0) {
            focusableElements[0].focus();
        } else {
            modal.focus();
        }

        const handleKeyDown = (event) => {
            // Close modal with Escape
            if (event.key === "Escape") {
                onClose();
                return;
            }

            // Trap focus inside modal
            if (event.key === "Tab") {
                const elements = getFocusableElements();

                if (elements.length === 0) {
                    event.preventDefault();
                    return;
                }

                const firstElement = elements[0];
                const lastElement = elements[elements.length - 1];

                if (
                    event.shiftKey &&
                    document.activeElement === firstElement
                ) {
                    event.preventDefault();
                    lastElement.focus();
                } else if (
                    !event.shiftKey &&
                    document.activeElement === lastElement
                ) {
                    event.preventDefault();
                    firstElement.focus();
                }
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);

            // Restore focus to the element that opened the modal
            if (
                previousFocusRef.current &&
                typeof previousFocusRef.current.focus === "function"
            ) {
                previousFocusRef.current.focus();
            }
        };
    }, [isOpen, onClose]);

    if (!isOpen) {
        return null;
    }

    const handleBackdropClick = (event) => {
        if (event.target === event.currentTarget) {
            onClose();
        }
    };

    return ReactDOM.createPortal(
        <div
            className="
                fixed inset-0 z-50
                flex items-center justify-center
                bg-black/60
                p-4
                transition-opacity duration-200
                animate-in fade-in
            "
            onMouseDown={handleBackdropClick}
            role="presentation"
        >
            <div
                ref={modalRef}
                tabIndex="-1"
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
                className={`
                    w-full
                    ${sizes[size]}
                    rounded-2xl
                    bg-white
                    dark:bg-slate-900
                    shadow-xl
                    transition-all
                    duration-200
                    animate-in
                    fade-in
                    slide-in-from-bottom-4
                `}
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-700">
                    <h2
                        id="modal-title"
                        className="text-lg font-semibold text-slate-900 dark:text-slate-100"
                    >
                        {title}
                    </h2>

                    <button
                        type="button"
                        onClick={onClose}
                        className="
                            rounded-lg
                            p-1.5
                            text-slate-500
                            transition-colors
                            hover:bg-slate-100
                            hover:text-slate-700
                            dark:hover:bg-slate-800
                            dark:hover:text-slate-200
                            focus:outline-none
                            focus-visible:ring-2
                            focus-visible:ring-indigo-500
                        "
                        aria-label="Close modal"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-5">
                    {children}
                </div>
            </div>
        </div>,
        document.body
    );
}

export default Modal;