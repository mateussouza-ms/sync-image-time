import path from "path";

import { getDifferenceBetweenDates } from "./utils/dates/getDifferenceBetweenDates.js";
import { changeImageCreationDate } from "./utils/files/changeImageCreationDate.js";

import { getFileListFromDirectory } from "./utils/files/getFileListFromDirectory.js";
import { getPhotoCreationDateMetadata } from "./utils/files/getPhotoCreationDateMetadata.js";
import { readFile } from "./utils/files/readFile.js";
import { selectFile } from "./utils/files/selectFile.js";

async function main() {
  try {
    console.log("Selecione o primeiro arquivo...");
    const filePath1 = await selectFile();

    console.log("Selecione o segundo arquivo...");
    const filePath2 = await selectFile();

    const fileDir1 = path.dirname(filePath1);
    const fileDir2 = path.dirname(filePath2);

    const file1 = await readFile(filePath1);
    const file2 = await readFile(filePath2);

    const creationDateFile1 = getPhotoCreationDateMetadata(file1);
    const creationDateFile2 = getPhotoCreationDateMetadata(file2);

    let timeDifference = getDifferenceBetweenDates(
      creationDateFile1,
      creationDateFile2
    );

    const fileListFolder1 = await getFileListFromDirectory(fileDir1);
    const fileListFolder2 = await getFileListFromDirectory(fileDir2);

    if (fileListFolder1.length >= fileListFolder2.length) {
      console.log("Alterando os arquivos da pasta: ", fileDir1);

      if (creationDateFile1 > creationDateFile2) {
        timeDifference = timeDifference * -1;
      }

      for (let index = 0; index < fileListFolder1.length; index++) {
        const filePath = fileListFolder1[index];
        await changeImageCreationDate(filePath, timeDifference);
      }
    }

    if (fileListFolder2.length > fileListFolder1.length) {
      console.log("Alterando os arquivos da pasta: ", fileDir2);

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
