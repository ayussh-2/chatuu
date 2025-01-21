export function getTimeFromFormat(timeStr) {
    const [day, time] = timeStr.split(", ");
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    return new Date(`${year}-${month + 1}-${day} ${time}`);
}
