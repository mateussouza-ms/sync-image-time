import child_process from "node:child_process";
import path from "path";

/**
 *
 * @returns {Promise<string>}
 */
export async function selectFile() {
  return new Promise((resolve, reject) => {
    child_process.exec(
      path.resolve("src/openfiledialog.bat"),
      (err, stdout) => {
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
