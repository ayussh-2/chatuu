import { Inter, Plus_Jakarta_Sans, Syne } from "next/font/google";

export const plusJakarta = Plus_Jakarta_Sans({
    subsets: ["latin"],
    variable: "--font-plus-jakarta",
});

export const syne = Syne({
    subsets: ["latin-ext"],
    weight: ["500", "400", "800", "600", "700"],
    variable: "--font-syne",
});

export const inter = Inter({
    subsets: ["latin-ext"],
    weight: ["500", "400", "800", "600", "700"],
    variable: "--font-inter",
});
