export function formatTime(date) {
    return new Date(date)
        .toLocaleString("en-US", {
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
            timeZone: "Asia/Kolkata",
        })
        .replace(",", "");
}
