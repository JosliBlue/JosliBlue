import React from "react";
import { Icon } from "@iconify/react";
import { RequestLoader } from "./RequestLoader";
import { motion, AnimatePresence } from "framer-motion";

interface EndpointProps {
    method: "GET" | "POST" | "PUT" | "DELETE";
    path: string;
    isOpen?: boolean;
    initialLoading?: boolean;
    loading?: boolean;
    children?: React.ReactNode;
    style?: React.CSSProperties;
}

const methodColors = {
    GET: "bg-[var(--badge-get-bg)] text-[var(--badge-get-text)] border-[var(--badge-get-border)]",
    POST: "bg-[var(--badge-post-bg)] text-[var(--badge-post-text)] border-[var(--badge-post-border)]",
    PUT: "text-orange-400 bg-orange-500/10 border-orange-500/30",
    DELETE: "text-red-400 bg-red-500/10 border-red-500/30",
};

export const Endpoint: React.FC<EndpointProps> = ({
    method,
    path,
    isOpen = true,
    initialLoading = true,
    loading,
    children,
    style,
}) => {
    const [open, setOpen] = React.useState(isOpen);
    const [minLoading, setMinLoading] = React.useState(initialLoading);

    React.useEffect(() => {
        if (!initialLoading) return;
        const timer = setTimeout(() => setMinLoading(false), 800);
        return () => clearTimeout(timer);
    }, [initialLoading]);

    const isLoading = loading !== undefined ? loading || minLoading : minLoading;

    return (
        <div
            className="border border-border rounded-lg mb-8 overflow-hidden bg-bg-secondary/30"
            style={style}
        >
            <div
                className="flex items-center gap-4 p-4 cursor-pointer hover:bg-white/5 transition-colors border-b border-border/50"
                onClick={() => setOpen(!open)}
            >
                <button className="text-text-secondary hover:text-text-primary">
                    {open ? (
                        <Icon icon="mdi:chevron-down" width="20" height="20" />
                    ) : (
                        <Icon icon="mdi:chevron-right" width="20" height="20" />
                    )}
                </button>

                <span
                    className={`font-mono text-xs font-bold px-2 py-1 rounded border transition-colors ${methodColors[method]}`}
                >
                    {method}
                </span>

                <span className="font-mono text-sm md:text-base text-text-primary font-medium">
                    {path}
                </span>
            </div>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                    >
                        <div className="p-4 md:p-6 bg-bg-primary/50">
                            {isLoading ? (
                                <RequestLoader />
                            ) : (
                                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                                    {children}
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
