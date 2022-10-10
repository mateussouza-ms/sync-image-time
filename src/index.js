import enquirer from "enquirer";
import child_process from "node:child_process";

import * as fs from "fs";
import path from "path";
import piexif from "piexifjs";
import { convertDateObjectToTextExifDate } from "./utils/convertDateObjectToTextExifDate.js";
import { convertTextExifDateToDateObject } from "./utils/convertTextExifDateToDateObject.js";
import { getDifferenceBetweenDates } from "./utils/getDifferenceBetweenDates.js";

/**
 * Get list of files from directory
 * @param {string} dir
 * @returns {Promise<string[]>}
 */
async function getFileListFromDirectory(dir) {
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

/**
 *
 * @param {string} filePath
 * @returns {Promise<string>} Base64 Data
 */
async function readFileAsBase64(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, data) => {
      if (err) {
        reject(err);
      } else {
        const base64Data = `data:image/jpeg;base64,${Buffer.from(data).toString(
          "base64"
        )}`;

        resolve(base64Data);
      }
    });
  });
}

/**
 *
 * @param {string} filePath
 * @param {string} base64Data
 *
 * @returns {Promise<boolean>}
 */
async function saveFile(filePath, base64Data) {
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

/**
 *
 * @param {string} filePath
 * @param {number} timeDifference
 */
async function changeImageCreationDate(filePath, timeDifference) {
  console.log("Alterando data do arquivo: ", filePath);
  const originalFile = await readFileAsBase64(filePath);

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

async function selectFileEnquirer(path) {
  const list = fs.readdirSync(path);

  const response = await enquirer.prompt({
    type: "select",
    name: "selectedItem",
    message: "Selecione o arquivo",
    choices: list,
  });

  const selectedItem = response["selectedItem"];
  const selectedItemPath = path.resolve(`${path}/${selectedItem}`);

  var isFile =
    fs.existsSync(selectedItemPath) && fs.lstatSync(selectedItemPath).isFile();

  if (isFile) {
    return selectedItemPath;
  }

  return await selectFileEnquirer(selectedItemPath);
}

async function selectFile() {
  return new Promise((resolve, reject) => {
    child_process.exec(
      path.resolve("src/openfiledialog.bat"),
      (err, stdout, stderr) => {
        if (err) {
          reject(err);
        }

        if (
          stdout === null ||
          (typeof stdout === "string" && stdout.trim() === "null")
        ) {
          reject("Nenhum arquivo foi selecionado");
        }

        if (typeof stdout === "string") {
          resolve(stdout.trim());
        }

        resolve(stdout);
      }
    );
  });
}

async function main() {
  try {
    console.log("Selecione o primeiro arquivo...");
    const filePath1 = await selectFile();

    console.log("Selecione o segundo arquivo...");
    const filePath2 = await selectFile();

    const fileDir1 = path.dirname(filePath1);
    const fileDir2 = path.dirname(filePath2);

    const file1 = await readFileAsBase64(filePath1);
    const file2 = await readFileAsBase64(filePath2);

    const exifFile1 = piexif.load(file1).Exif;
    const exifFile2 = piexif.load(file2).Exif;

    const creationDateFile1 = convertTextExifDateToDateObject(
      exifFile1[piexif.ExifIFD.DateTimeOriginal]
    );
    const creationDateFile2 = convertTextExifDateToDateObject(
      exifFile2[piexif.ExifIFD.DateTimeOriginal]
    );

    let timeDifference = getDifferenceBetweenDates(
      creationDateFile1,
      creationDateFile2
    );

    const fileListFolder1 = await getFileListFromDirectory(fileDir1);
    const fileListFolder2 = await getFileListFromDirectory(fileDir2);

    if (fileListFolder1.length >= fileListFolder2.length) {
      if (creationDateFile1 > creationDateFile2) {
        timeDifference = timeDifference * -1;
      }

      for (let index = 0; index < fileListFolder1.length; index++) {
        const filePath = fileListFolder1[index];
        await changeImageCreationDate(filePath, timeDifference);
      }
    }

    if (fileListFolder2.length > fileListFolder1.length) {
      if (creationDateFile2 > creationDateFile1) {
        timeDifference = timeDifference * -1;
      }

      for (let index = 0; index < fileListFolder2.length; index++) {
        const filePath = fileListFolder2[index];
        await changeImageCreationDate(filePath, timeDifference);
      }
    }

    console.log("Fotos sincronizadas com sucesso!");
  } catch (error) {
    console.error(error);
  }
}

main();
