import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "./button";
import Loader from "./loader";

export default function LoadingButton({
    loading,
    onClick,
    children,
    disabled,
    className,
    variant = "default",
}: {
    loading: boolean;
    onClick: () => void;
    children: React.ReactNode;
    disabled: boolean;
    className?: string;
    variant?:
        | "default"
        | "destructive"
        | "outline"
        | "secondary"
        | "ghost"
        | "link";
}) {
    return (
        <Button
            variant={variant}
            onClick={onClick}
            disabled={disabled}
            className={className}
        >
            <AnimatePresence mode="wait">
                {loading ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                        transition={{ duration: 0.1 }}
                        key={"loader"}
                    >
                        <Loader size={20} color="black" />
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.1 }}
                        key={"content"}
                    >
                        {children}
                    </motion.div>
                )}
            </AnimatePresence>
        </Button>
    );
}
