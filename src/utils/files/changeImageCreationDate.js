import path from "path";
import piexif from "piexifjs";

import { convertDateObjectToTextExifDate } from "../dates/convertDateObjectToTextExifDate.js";
import { convertTextExifDateToDateObject } from "../dates/convertTextExifDateToDateObject.js";
import { readFile } from "./readFile.js";
import { saveFile } from "./saveFile.js";

/**
 *
 * @param {string} filePath
 * @param {number} timeDifference
 */
export async function changeImageCreationDate(filePath, timeDifference) {
  console.log("Alterando data do arquivo: ", filePath);
  const originalFile = await readFile(filePath);

  const exifObj = piexif.load(originalFile);
  let exif = exifObj.Exif;
  const dateTimeOriginal = convertTextExifDateToDateObject(
    exif[piexif.ExifIFD.DateTimeOriginal]
  );
  const newDateTime = new Date(dateTimeOriginal.getTime() + timeDifference);

  exif[piexif.ExifIFD.DateTimeOriginal] =
    convertDateObjectToTextExifDate(newDateTime);

  const exifStr = piexif.dump({ ...exifObj, Exif: exif });
  const modifiedFile = piexif.insert(exifStr, originalFile);

  const fileDir = path.dirname(filePath);
  const fileName = path.basename(filePath);

  try {
    await saveFile(
      path.resolve(`${fileDir}/modified_${fileName}`),
      modifiedFile
    );
  } catch (error) {
    throw new Error(error);
  }
}
