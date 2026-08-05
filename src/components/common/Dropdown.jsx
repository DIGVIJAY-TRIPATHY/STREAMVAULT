import { useEffect, useRef, useState } from "react";
import { useClickOutside } from "../../hooks/useClickOutside";

function Dropdown({
    trigger,
    items = [],
    align = "left",
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);

    const dropdownRef = useRef(null);
    const menuRef = useRef(null);

    useClickOutside(dropdownRef, () => {
        setIsOpen(false);
        setActiveIndex(-1);
    });

    const menuItems = items.filter((item) => !item.divider);

    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                event.preventDefault();
                setIsOpen(false);
                setActiveIndex(-1);
                return;
            }

            if (event.key === "ArrowDown") {
                event.preventDefault();

                setActiveIndex((current) =>
                    current < menuItems.length - 1 ? current + 1 : 0
                );
            }

            if (event.key === "ArrowUp") {
                event.preventDefault();

                setActiveIndex((current) =>
                    current > 0 ? current - 1 : menuItems.length - 1
                );
            }

            if (event.key === "Enter" && activeIndex >= 0) {
                event.preventDefault();

                const item = menuItems[activeIndex];

                if (item?.onClick) {
                    item.onClick();
                }

                setIsOpen(false);
                setActiveIndex(-1);
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen, activeIndex, menuItems]);

    useEffect(() => {
        if (activeIndex < 0 || !menuRef.current) return;

        const activeItem = menuRef.current.querySelector(
            `[data-menu-index="${activeIndex}"]`
        );

        activeItem?.focus();
    }, [activeIndex]);

    const handleToggle = () => {
        setIsOpen((current) => !current);
        setActiveIndex(-1);
    };

    const handleItemClick = (item) => {
        if (item.onClick) {
            item.onClick();
        }

        setIsOpen(false);
        setActiveIndex(-1);
    };

    const alignClass =
        align === "right"
            ? "right-0 origin-top-right"
            : "left-0 origin-top-left";

    let menuIndex = 0;

    return (
        <div ref={dropdownRef} className="relative inline-block">
            {/* Trigger */}
            <div
                onClick={handleToggle}
                onKeyDown={(event) => {
                    if (
                        event.key === "Enter" ||
                        event.key === " "
                    ) {
                        event.preventDefault();
                        handleToggle();
                    }

                    if (event.key === "ArrowDown") {
                        event.preventDefault();

                        if (!isOpen) {
                            setIsOpen(true);
                            setActiveIndex(0);
                        }
                    }
                }}
                role="button"
                tabIndex={0}
                aria-haspopup="menu"
                aria-expanded={isOpen}
            >
                {trigger}
            </div>

            {/* Dropdown panel */}
            <div
                ref={menuRef}
                role="menu"
                aria-hidden={!isOpen}
                className={`
                    absolute top-full mt-2
                    ${alignClass}
                    z-50 min-w-40
                    rounded-xl
                    border border-slate-200
                    bg-white
                    shadow-lg
                    dark:border-slate-700
                    dark:bg-slate-900
                    transition-all duration-150
                    ${
                        isOpen
                            ? "visible scale-100 opacity-100"
                            : "invisible scale-95 opacity-0"
                    }
                `}
            >
                <div className="py-1">
                    {items.map((item, index) => {
                        if (item.divider) {
                            return (
                                <hr
                                    key={`divider-${index}`}
                                    className="my-1 border-slate-200 dark:border-slate-700"
                                />
                            );
                        }

                        const currentIndex = menuIndex++;

                        return (
                            <button
                                key={`${item.label}-${index}`}
                                type="button"
                                role="menuitem"
                                data-menu-index={currentIndex}
                                tabIndex={-1}
                                onClick={() => handleItemClick(item)}
                                className={`
                                    flex w-full items-center gap-2
                                    px-3 py-2
                                    text-left text-sm
                                    transition-colors
                                    outline-none
                                    ${
                                        item.isDanger
                                            ? "text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                                            : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                                    }
                                    focus:bg-slate-100
                                    dark:focus:bg-slate-800
                                `}
                            >
                                {item.icon && (
                                    <span className="shrink-0">
                                        {item.icon}
                                    </span>
                                )}

                                <span>{item.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default Dropdown;