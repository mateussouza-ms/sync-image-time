import * as fs from "fs";

/**
 *
 * @param {string} filePath
 * @param {string} jpegData
 *
 * @returns {Promise<boolean>}
 */
export async function saveFile(filePath, jpegData) {
  console.log("Salvando o arquivo: ", filePath);
  return new Promise((resolve, reject) => {
    let isBase64Data = false;
    if (
      jpegData.slice(0, 23) == "data:image/jpeg;base64," ||
      jpegData.slice(0, 22) == "data:image/jpg;base64,"
    ) {
      isBase64Data = true;
    }
    fs.writeFile(
      filePath,
      isBase64Data ? jpegData.replace("data:image/jpeg;base64,", "") : jpegData,
      isBase64Data ? "base64" : "binary",
      (error) => {
        if (error) {
          reject(`Erro ao salvar o arquivo ${filePath}:`, error);
        }

        resolve(true);
      }
    );
  });
}
