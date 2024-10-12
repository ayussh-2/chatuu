"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SignupForm from "@/components/auth/signup";
import LoginForm from "@/components/auth/login";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import {
    handleGoogleLogin,
    handleLogin,
    handleSignup,
} from "@/utils/actions/authHandler";

export default function Home() {
    const [showForms, setShowForms] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
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
            <BackgroundBeams />
            <div className="grid min-h-screen place-items-center">
                <AnimatePresence mode="wait">
                    {showForms ? (
                        <div>
                            {showLogin ? (
                                <LoginForm
                                    toggleLogin={toggleLogin}
                                    handleGoogleLogin={handleGoogleLogin}
                                    handleLogin={handleLogin}
                                />
                            ) : (
                                <SignupForm
                                    toggleLogin={toggleLogin}
                                    handleGoogleLogin={handleGoogleLogin}
                                    handleSignup={handleSignup}
                                />
                            )}
                        </div>
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
                                className="text-4xl font-[600] font-syne"
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
