"use client";
import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Download, Info } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
    readonly platforms: string[];
    readonly userChoice: Promise<{
        outcome: "accepted" | "dismissed";
        platform: string;
    }>;
    prompt(): Promise<void>;
}

declare global {
    interface WindowEventMap {
        beforeinstallprompt: BeforeInstallPromptEvent;
    }
}

const PWAInstallModal: React.FC = () => {
    const [deferredPrompt, setDeferredPrompt] =
        useState<BeforeInstallPromptEvent | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const installState = useMemo(() => {
        const isStandalone =
            window.matchMedia("(display-mode: standalone)").matches ||
            (window.navigator as any).standalone ||
            document.referrer.includes("android-app://");

        const isSafari =
            /Safari/.test(navigator.userAgent) &&
            !/Chrome/.test(navigator.userAgent);

        const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);
        const isPWASupported = "serviceWorker" in navigator;

        return {
            isStandalone,
            isSafari,
            isIOS,
            isPWASupported,
        };
    }, []);

    useEffect(() => {
        if (typeof window === "undefined") return;

        const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setIsModalOpen(true);
        };

        const handleAppInstalled = () => {
            setDeferredPrompt(null);
            setIsModalOpen(false);
        };

        window.addEventListener(
            "beforeinstallprompt",
            handleBeforeInstallPrompt
        );
        window.addEventListener("appinstalled", handleAppInstalled);

        return () => {
            window.removeEventListener(
                "beforeinstallprompt",
                handleBeforeInstallPrompt
            );
            window.removeEventListener("appinstalled", handleAppInstalled);
        };
    }, []);

    const handleInstallClick = async (): Promise<void> => {
        if (!deferredPrompt) return;

        try {
            await deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;

            if (outcome === "accepted") {
                setDeferredPrompt(null);
                setIsModalOpen(false);
            }
        } catch (error) {
            console.error("Installation error:", error);
        }
    };

    if (installState.isStandalone || !deferredPrompt) return null;

    if (installState.isIOS && installState.isSafari) {
        return (
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Info className="w-5 h-5" />
                            Install on iOS
                        </DialogTitle>
                        <DialogDescription>
                            To install this app on your iOS device:
                            <ol className="mt-2 ml-4 space-y-1 list-decimal">
                                <li>Tap the Share button in Safari</li>
                                <li>
                                    Scroll down and tap "Add to Home Screen"
                                </li>
                                <li>Tap "Add" to confirm</li>
                            </ol>
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setIsModalOpen(false)}
                        >
                            Close
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Download className="w-5 h-5" />
                        Install App
                    </DialogTitle>
                    <DialogDescription>
                        Install our application for a better experience
                    </DialogDescription>
                </DialogHeader>

                <p className="text-sm text-gray-600">
                    Install this application on your device for quick and easy
                    access - it won't take up much space!
                </p>

                <div className="flex justify-end gap-2">
                    <Button
                        variant="outline"
                        onClick={() => setIsModalOpen(false)}
                    >
                        Maybe Later
                    </Button>
                    <Button
                        onClick={handleInstallClick}
                        className="flex items-center gap-2"
                    >
                        <Download className="w-4 h-4" />
                        Install Now
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default PWAInstallModal;
