"use client";
import { tailspin } from "ldrs";
export default function Loader({
    size = 40,
    stroke = 3,
    speed = 0.9,
    color = "white",
}: {
    size?: number;
    stroke?: number;
    speed?: number;
    color?: string;
}) {
    tailspin.register();

    return (
        <l-tailspin
            size={size.toString()}
            stroke={stroke.toString()}
            speed={speed.toString()}
            color={color}
        ></l-tailspin>
    );
}
