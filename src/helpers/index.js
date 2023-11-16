export function getCurrentDateTime() {
  const currentDate = new Date();

  // Get hours, minutes, day, month, and year
  const day = currentDate.getDate();
  const month = currentDate.getMonth() + 1; // Note: Month is zero-based
  const year = currentDate.getFullYear();

  // Pad single-digit hours, minutes, day, and month with leading zeros
  const formattedDay = String(day).padStart(2, "0");
  const formattedMonth = String(month).padStart(2, "0");

  // Format the date as HH:mm DD/MM/YYYY
  const formattedDateTime = `${formattedDay}/${formattedMonth}/${year}`;

  return formattedDateTime;
}
