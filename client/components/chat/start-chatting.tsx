import React from "react";
import { motion } from "framer-motion";
export default function StartChatting() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="min-h-screen w-full grid place-items-center font-plusJakarta"
        >
            <div className="w-full max-w-lg rounded-lg shadow-lg p-8">
                <h1 className="text-2xl font-bold text-center text-primary">
                    Start Chatting
                </h1>
                <p className="text-center text-muted-foreground mt-4">
                    Select a contact to start chatting
                </p>
            </div>
        </motion.div>
    );
}
