"use client";
export default function Loader({
    size = 40,
    stroke = 5,
    speed = 0.9,
    color = "white",
}: {
    size?: number;
    stroke?: number;
    speed?: number;
    color?: string;
}) {
    return (
        <div
            className="w-full h-full flex items-center justify-center"
            style={{ color }}
        >
            <svg
                width={size}
                height={size}
                viewBox="0 0 38 38"
                xmlns="http://www.w3.org/2000/svg"
                stroke={color}
            >
                <g fill="none" fillRule="evenodd">
                    <g transform="translate(1 1)" strokeWidth={stroke}>
                        <circle strokeOpacity=".5" cx="18" cy="18" r="18" />
                        <path d="M36 18c0-9.94-8.06-18-18-18">
                            <animateTransform
                                attributeName="transform"
                                type="rotate"
                                from="0 18 18"
                                to="360 18 18"
                                dur={`${speed}s`}
                                repeatCount="indefinite"
                            />
                        </path>
                    </g>
                </g>
            </svg>
        </div>
    );
}
