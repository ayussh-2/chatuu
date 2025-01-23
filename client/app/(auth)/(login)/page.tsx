"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SignupForm from "@/components/auth/signup";
import LoginForm from "@/components/auth/login";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import PWAInstallModal from "@/components/pwa/InstallPrompt";

export default function Home() {
    const [showForms, setShowForms] = useState(false);
    const [showLogin, setShowLogin] = useState(true);
    useEffect(() => {
        const timer = setTimeout(() => {
            setShowForms(true);
        }, 3000);
        return () => clearTimeout(timer);
    });

    function toggleLogin() {
        setShowLogin(!showLogin);
    }

    return (
        <div>
            <PWAInstallModal />

            <div className="grid min-h-screen place-items-center">
                <AnimatePresence mode="wait">
                    {showForms ? (
                        <>
                            {showLogin ? (
                                <LoginForm toggleLogin={toggleLogin} />
                            ) : (
                                <SignupForm toggleLogin={toggleLogin} />
                            )}
                        </>
                    ) : (
                        <motion.div
                            key="welcome"
                            exit={{
                                opacity: 0,
                                transition: { duration: 0.5 },
                            }}
                        >
                            <TextGenerateEffect
                                words="Welcome to Chatuu"
                                duration={2}
                                className="text-2xl smd:text-4xl font-[600] font-syne"
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
