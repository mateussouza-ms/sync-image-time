import * as fs from "fs";
import path from "path";

/**
 * Get list of files from directory
 * @param {string} dir
 * @returns {Promise<string[]>}
 */
export async function getFileListFromDirectory(dir) {
  return new Promise((resolve, reject) => {
    fs.readdir(dir, (error, files) => {
      if (error) {
        reject(
          `Ocorreu um erro ao ler os arquivos da pasta '${dir}'. Erro: ${error}`
        );
      } else {
        const filesPaths = files.map((fileName) => {
          const filePath = path.resolve(`${dir}/${fileName}`);
          return filePath;
        });

        resolve(filesPaths);
      }
    });
  });
}
