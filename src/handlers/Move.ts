import { Cabinet } from "../index.ts";
import { CabinetFile } from "../utils/File.ts";
import { CabinetError } from "./Error.ts";
import { cbErrFile } from "../types/callback.ts";
/**
 * @class
 * @name CabinetMover
 * @description Contains functions for mover files
 * @constructor
 * @example
 * ```
 * const { mover } = new Cabinet("./file.txt");
 * mover.sync("./movedto.txt")
 * ```
 */
export class CabinetMover {
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
   * Move the file with an optional callback
   */
  move(location: string, callback?: cbErrFile) {
    if (!callback) {
      return this.sync(location);
    }
    // return this.callback(callback);
  }
  /**
   * Synchronously move the file
   */
  sync(newLocation: string) {
    let read;
    let moveTo;
    try {
      let loc = Cabinet.resolve(newLocation);
      moveTo = new Cabinet(loc);
      moveTo.writer.sync(this.fs.reader.sync().contents);
      this.fs.deleter.delete();
      read = moveTo.reader.read().data;
    } catch (err) {
      new CabinetError(err, {
        msg: "moving " + this.filePath,
        perm: "write",
      });
    }
    if (!read || !moveTo) throw new Error("Something went wrong");
    return new CabinetFile(this.fs, this.filePath, read);
  }
  //   /**
  //    * Read the file and receive a callback
  //    */
  //   callback(cb: cbErrFile) {
  //     if (!cb) throw new Error("Callback not specified!");
  //     Deno.readFile(this.filePath)
  //       .then((read) => {
  //         return cb(undefined, new CabinetFile(this.fs, this.filePath, read));
  //       })
  //       .catch(
  //         (err) =>
  //           new CabinetError(err, {
  //             msg: "reading " + this.filePath,
  //             perm: "read",
  //           }),
  //       );
  //     return new CabinetFile(this.fs, this.filePath, new Uint8Array());
  //   }
  //   /**
  //    * Read the file and receive a promise
  //    */
  //   promise() {
  //     return new Promise((res: (file: CabinetFile) => void, rej) => {
  //       Deno.readFile(this.filePath)
  //         .then((read) => {
  //           return res(new CabinetFile(this.fs, this.filePath, read));
  //         })
  //         .catch((err) =>
  //           rej(
  //             new CabinetError(err, {
  //               msg: "reading " + this.filePath,
  //               perm: "read",
  //             }),
  //           )
  //         );
  //     });
  //   }
}
