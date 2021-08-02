import { Cabinet, CabinetFile, CabinetError } from "../../mod.ts";
import { cbErrFile } from "../types/callback.ts";
/**
 * @class
 * @name CabinetDelete
 * @description Contains functions for deleting files
 * @constructor
 * @example
 * ```
 * const { deleter } = new Cabinet("./file.txt");
 * deleter.sync()
 * ```
 */

export class CabinetDelete {
  /**
   * Path to the file
   */
  filePath: string;
  private fs: Cabinet;
  constructor(fs: Cabinet) {
    this.filePath = fs.filePath;
    this.fs = fs;
    return this;
  }
  /**
   * Default delete
   * @param {cbErrFile} - Optional callback
   */
  delete(callback?: cbErrFile) {
    if (!callback) {
      return this.sync();
    }
    return this.callback(callback);
  }
  /**
   * Synchronously delete the file
   */
  sync() {
    try {
      Deno.removeSync(this.filePath);
    } catch (err) {
      new CabinetError(err, {
        msg: "deleting " + this.filePath,
        perm: "write",
      });
    }
    return true;
  }
  /**
   * Delete the file and receive a callback
   */
  callback(cb: (err?: CabinetError) => void) {
    if (!cb) throw new Error("Callback not specified!");
    Deno.remove(this.filePath)
      .then(() => {
        return cb();
      })
      .catch((err) =>
        cb(
          new CabinetError(err, {
            msg: "deleting " + this.filePath,
            perm: "write",
          })
        )
      );
  }
  /**
   * Delete the file and receive a promise
   */
  promise() {
    return new Promise((res: (deleted: boolean) => void, rej) => {
      Deno.remove(this.filePath)
        .then(() => {
          return res(true);
        })
        .catch((err) =>
          rej(
            new CabinetError(err, {
              msg: "deleting " + this.filePath,
              perm: "write",
            })
          )
        );
    });
  }
}
