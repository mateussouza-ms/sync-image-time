/**
 *
 * @param {Date} dateObj - instance of Date
 * @returns {string} ExifDate format
 */
export function convertDateObjectToTextExifDate(dateObj) {
  if (!(dateObj instanceof Date)) {
    throw new Error("'dateObj' must be instance of Date.");
  }

  const year = dateObj.getFullYear();
  const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
  const day = dateObj.getDate().toString().padStart(2, "0");
  const time = dateObj.toLocaleTimeString();

  return `${year}:${month}:${day} ${time}`;
}
