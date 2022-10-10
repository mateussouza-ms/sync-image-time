import enquirer from "enquirer";
import child_process from "node:child_process";

import * as fs from "fs";
import path from "path";
import piexif from "piexifjs";
import { convertDateObjectToTextExifDate } from "./utils/convertDateObjectToTextExifDate.js";
import { convertTextExifDateToDateObject } from "./utils/convertTextExifDateToDateObject.js";
import { getDifferenceBetweenDates } from "./utils/getDifferenceBetweenDates.js";

const dir1 =
  "C:\\Users\\mateu\\OneDrive\\Área de Trabalho\\Camera PASCOM\\sem moldura\\d";
const dir2 =
  "C:\\Users\\mateu\\OneDrive\\Área de Trabalho\\Camera Thaís\\sem moldura\\d";

const novaData = new Date(dataFoto1.getTime() - diferenca);
console.log("novaData", novaData);

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
          `Ocorreu um erro ao ler os arquivos da pasta '${dir1}'. Erro: ${error}`
        );
      } else {
        const filesPaths = files.map((fileName) => {
          const filePath = `${dir1}\\${fileName}`;
          return filePath;
        });

        resolve(filesPaths);
      }
    });
  });
}

/**
 *
 * @param {*} filePath
 * @returns {Promise<string>}
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

async function saveFile(fileName, base64Data) {
  fs.writeFile(
    fileName,
    base64Data.replace("data:image/jpeg;base64,", ""),
    "base64",
    (error) => {
      if (error) {
        console.error(`Erro ao salvar o arquivo ${fileName}:`, error);
      }
    }
  );
}

async function changeImageCreationDate(filePath, timeDifference) {
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

  const [fileName] = filePath.split("/").slice(-1);

  saveFile(`modified_${fileName}`, modifiedFile);
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
  const selectedItemPath = `${path}\\${selectedItem}`;

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

        if (typeof stdout === "string") {
          resolve(stdout.trim());
        }

        resolve(stdout);
      }
    );
  });
}

async function main() {
  const baseDir = path.resolve("C:\\Users\\mateu\\OneDrive\\Área de Trabalho");
  const filePath1 = await selectFile();
  console.log("filePath1", filePath1);
  const filePath2 = await selectFile();
  console.log("filePath2", filePath2);

  const fileDir1 = path.dirname(filePath1);
  console.log("fileDir1", fileDir1);
  const fileDir2 = path.dirname(filePath2);
  console.log("fileDir2", fileDir2);
  const fileName1 = path.basename(filePath1);
  console.log("fileName1", fileName1);
  const fileName2 = path.basename(filePath2);
  console.log("fileName2", fileName2);

  const file1 = await readFileAsBase64(filePath1);
  // console.log("file1", file1);
  const file2 = await readFileAsBase64(filePath2);
  // console.log("file2", file2);

  const exifFile1 = piexif.load(file1);
  const exifFile2 = piexif.load(file2);
  const creationDateFile1 = convertTextExifDateToDateObject(
    exifFile1[piexif.ExifIFD.DateTimeOriginal]
  );
  const creationDateFile2 = convertTextExifDateToDateObject(
    exifFile2[piexif.ExifIFD.DateTimeOriginal]
  );
  const timeDifference = getDifferenceBetweenDates(
    creationDateFile1,
    creationDateFile2
  );

  const fileListFolder1 = await getFileListFromDirectory(fileDir1);
  const fileListFolder2 = await getFileListFromDirectory(fileDir2);

  if (fileListFolder1.length > fileListFolder2.length) {
    fileListFolder1.forEach((filePath) =>
      changeImageCreationDate(filePath, timeDifference)
    );
  }

  if (fileListFolder2.length > fileListFolder1.length) {
    fileListFolder2.forEach((filePath) =>
      changeImageCreationDate(filePath, timeDifference)
    );
  }
}

main();

// changeImageCreationDate(path, novaData);
