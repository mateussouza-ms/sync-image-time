import piexif from "piexifjs";

import { convertTextExifDateToDateObject } from "../dates/convertTextExifDateToDateObject.js";

/**
 *
 * @param {string} file Base64 string file
 *
 * @returns {Date} Photo creation date
 */
export function getPhotoCreationDateMetadata(file) {
  const exif = piexif.load(file).Exif;

  const creationDate = convertTextExifDateToDateObject(
    exif[piexif.ExifIFD.DateTimeOriginal]
  );

  return creationDate;
}
