import * as fs from "fs";

/**
 *
 * @param {string} filePath
 * @returns {Promise<string>} Base64 Data
 */
export async function readFile(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, data) => {
      if (err) {
        reject(err);
      } else {
        // const base64Data = `data:image/jpeg;base64,${Buffer.from(data).toString(
        //   "base64"
        // )}`;
        const binaryData = data.toString("binary");

        resolve(binaryData);
      }
    });
  });
}
