/**
 *
 * @param  strExifDate - format "2010:10:10 10:10:10"
 */
export function convertTextExifDateToDateObject(strExifDate) {
  if (typeof strExifDate !== "string") {
    throw new Error("'strExifDate' must be string.");
  }

  const [date, time] = strExifDate.split(" ");

  return new Date(`${date.replace(":", "-")} ${time}`);
}
