import * as fs from "fs";

/**
 *
 * @param {string} filePath
 * @param {string} base64Data
 *
 * @returns {Promise<boolean>}
 */
export async function saveFile(filePath, base64Data) {
  console.log("Salvando o arquivo: ", filePath);
  return new Promise((resolve, reject) => {
    fs.writeFile(
      filePath,
      base64Data.replace("data:image/jpeg;base64,", ""),
      "base64",
      (error) => {
        if (error) {
          reject(`Erro ao salvar o arquivo ${filePath}:`, error);
        }

        resolve(true);
      }
    );
  });
}
