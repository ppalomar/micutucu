export function getCurrentDateTime() {
  const currentDate = new Date();

  // Get hours, minutes, day, month, and year
  const hours = currentDate.getHours();
  const minutes = currentDate.getMinutes();
  const day = currentDate.getDate();
  const month = currentDate.getMonth() + 1; // Note: Month is zero-based
  const year = currentDate.getFullYear();

  // Pad single-digit hours, minutes, day, and month with leading zeros
  const formattedHours = String(hours).padStart(2, "0");
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedDay = String(day).padStart(2, "0");
  const formattedMonth = String(month).padStart(2, "0");

  // Format the date as HH:mm DD/MM/YYYY
  const formattedDateTime = `${formattedHours}:${formattedMinutes} ${formattedDay}/${formattedMonth}/${year}`;

  return formattedDateTime;
}
