import { Cabinet } from "../index.ts";
import { CabinetFile } from "../utils/File.ts";
import { CabinetError } from "./Error.ts";
import { cbErrFile } from "../types/callback.ts";
/**
 * @class
 * @name CabinetRead
 * @description Contains functions for reading files
 * @constructor
 * @example
 * ```
 * const { reader } = new Cabinet("./file.txt");
 * read.sync()
 * ```
 */
export class CabinetRead {
  filePath: string;
  fs: Cabinet;

  constructor(fs: Cabinet) {
    this.filePath = fs.filePath;
    this.fs = fs;
    return this;
  }
  read(callback?: cbErrFile) {
    if (!callback) {
      return this.sync();
    }
    return this.callback(callback);
  }
  sync() {
    let read;
    try {
      read = Deno.readFileSync(this.filePath);
    } catch (err) {
      new CabinetError(err, {
        msg: "reading " + this.filePath,
        perm: "read",
      });
    }
    if (!read) throw new Error("Something went wrong");
    return new CabinetFile(this.fs, this.filePath, read);
  }
  callback(cb: cbErrFile) {
    if (!cb) throw new Error("Callback not specified!");
    Deno.readFile(this.filePath)
      .then((read) => {
        return cb(undefined, new CabinetFile(this.fs, this.filePath, read));
      })
      .catch(
        (err) =>
          new CabinetError(err, {
            msg: "reading " + this.filePath,
            perm: "read",
          })
      );
    return new CabinetFile(this.fs, this.filePath, new Uint8Array());
  }
  promise() {
    return new Promise((res: (file: CabinetFile) => void, rej) => {
      Deno.readFile(this.filePath)
        .then((read) => {
          return res(new CabinetFile(this.fs, this.filePath, read));
        })
        .catch((err) =>
          rej(
            new CabinetError(err, {
              msg: "reading " + this.filePath,
              perm: "read",
            })
          )
        );
    });
  }
}
