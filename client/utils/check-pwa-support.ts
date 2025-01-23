export const checkPWASupport = (): {
    isPWASupported: boolean;
    isStandalone: boolean;
    isSafari: boolean;
    isIOS: boolean;
} => {
    if (typeof window === "undefined") {
        return {
            isPWASupported: false,
            isStandalone: false,
            isSafari: false,
            isIOS: false,
        };
    }

    const isStandalone =
        window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as any).standalone || // iOS Safari
        document.referrer.includes("android-app://");

    const isSafari =
        /Safari/.test(navigator.userAgent) &&
        !/Chrome/.test(navigator.userAgent);

    const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);

    const isPWASupported =
        "serviceWorker" in navigator && "BeforeInstallPromptEvent" in window;

    return {
        isPWASupported,
        isStandalone,
        isSafari,
        isIOS,
    };
};
