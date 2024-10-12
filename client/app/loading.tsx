import React from "react";
import Loader from "@/components/ui/loader";
export default function Loading() {
    return (
        <div className="min-h-screen w-full grid place-items-center">
            <Loader color="#a7a7a7" />
        </div>
    );
}
