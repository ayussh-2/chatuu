"use client";
import { AnimatePresence, motion } from "framer-motion";

interface LoaderProps {
    isLoading: boolean;
}

export default function Loader({ isLoading }: LoaderProps) {
    return (
        <AnimatePresence mode="wait">
            {isLoading && (
                <motion.div
                    className="h-full w-full grid place-items-center backdrop-blur-[10px] fixed z-[1000] bg-[rgba(0,0,0,0.4)] left-0 top-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.1, ease: "easeInOut" }}
                >
                    <motion.div
                        className="flex justify-center items-center flex-col gap-4 w-full h-full"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        transition={{
                            duration: 0.3,
                            ease: "easeInOut",
                            delay: 0.1,
                        }}
                    >
                        <span className="w-12 h-12 inline-block box-border animate-[rotation_1s_linear_infinite] rounded-[50%] border-r-[3px] border-r-transparent border-t-[3px] border-t-white border-solid"></span>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
