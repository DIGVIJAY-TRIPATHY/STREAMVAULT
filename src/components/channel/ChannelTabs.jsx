import { useRef, useEffect, useState } from "react";

const tabs = [
    {
        label: "Videos",
        value: "videos",
    },
    {
        label: "Playlists",
        value: "playlists",
    },
    {
        label: "Community",
        value: "community",
    },
];

function ChannelTabs({
    activeTab,
    onTabChange,
}) {
    const tabsRef = useRef({});
    const [indicator, setIndicator] =
        useState({
            left: 0,
            width: 0,
        });

    useEffect(() => {
        const activeElement =
            tabsRef.current[activeTab];

        if (!activeElement) {
            return;
        }

        setIndicator({
            left: activeElement.offsetLeft,
            width: activeElement.offsetWidth,
        });
    }, [activeTab]);

    useEffect(() => {
        const handleResize = () => {
            const activeElement =
                tabsRef.current[activeTab];

            if (!activeElement) {
                return;
            }

            setIndicator({
                left: activeElement.offsetLeft,
                width: activeElement.offsetWidth,
            });
        };

        window.addEventListener(
            "resize",
            handleResize
        );

        return () => {
            window.removeEventListener(
                "resize",
                handleResize
            );
        };
    }, [activeTab]);

    return (
        <div className="relative border-b border-slate-200 dark:border-slate-800">
            <div className="flex overflow-x-auto">
                {tabs.map((tab) => {
                    const isActive =
                        activeTab === tab.value;

                    return (
                        <button
                            key={tab.value}
                            ref={(element) => {
                                tabsRef.current[
                                    tab.value
                                ] = element;
                            }}
                            type="button"
                            onClick={() =>
                                onTabChange(
                                    tab.value
                                )
                            }
                            className={`
                                relative
                                shrink-0
                                px-5
                                py-3
                                text-sm
                                font-medium
                                transition-colors
                                ${
                                    isActive
                                        ? "text-indigo-600 dark:text-indigo-400"
                                        : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
                                }
                            `}
                        >
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* Sliding active indicator */}
            <span
                className="
                    absolute
                    bottom-0
                    h-0.5
                    rounded-full
                    bg-indigo-600
                    transition-all
                    duration-300
                    ease-out
                    dark:bg-indigo-400
                "
                style={{
                    left: indicator.left,
                    width: indicator.width,
                }}
            />
        </div>
    );
}

export default ChannelTabs;