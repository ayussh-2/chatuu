"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
    function handleRedirect() {
        window.location.href = "/";
    }
    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background text-foreground">
            <div className="space-y-6 text-center">
                <h1 className="text-7xl font-bold text-primary">404</h1>
                <div className="space-y-2">
                    <h2 className="text-2xl font-semibold">Page not found</h2>
                    <p className="text-muted-foreground">
                        We couldn&apos;t find the page you&apos;re looking for.
                    </p>
                </div>

                <Button
                    variant="outline"
                    size="lg"
                    className="mt-8"
                    onClick={handleRedirect}
                >
                    <Home className="mr-2 h-4 w-4" />
                    Back to Home
                </Button>
            </div>
        </div>
    );
};

export default NotFound;
