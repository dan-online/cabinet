import { DenoFs } from "../index.ts";
import { FsFile } from "../utils/File.ts";
import { FsError } from "./Error.ts";

/**
 * @class
 * @name FsRead
 * @description Contains functions for reading files
 * @constructor
 * @example
 * ```
 * const { reader } = new DenoFs("./file.txt");
 * read.sync()
 * ```
 */
export class FsRead {
  filePath: string;
  fs: DenoFs;

  constructor(fs: DenoFs) {
    this.filePath = fs.filePath;
    this.fs = fs;
    return this;
  }
  read(callback?: (err?: Error | FsError, file?: FsFile) => void) {
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
      new FsError(err, {
        msg: "reading " + this.filePath,
        perm: "read",
      });
    }
    if (!read) throw new Error("Something went wrong");
    return new FsFile(this.fs, this.filePath, read);
  }
  callback(cb: (err?: Error | FsError, file?: FsFile) => void) {
    if (!cb) throw new Error("Callback not specified!");
    Deno.readFile(this.filePath)
      .then((read) => {
        return cb(undefined, new FsFile(this.fs, this.filePath, read));
      })
      .catch(
        (err) =>
          new FsError(err, {
            msg: "reading " + this.filePath,
            perm: "read",
          })
      );
    return new FsFile(this.fs, this.filePath, new Uint8Array());
  }
  promise(options: {}) {
    return new Promise((res: (file: FsFile) => void, rej) => {
      Deno.readFile(this.filePath)
        .then((read) => {
          return res(new FsFile(this.fs, this.filePath, read));
        })
        .catch((err) =>
          rej(
            new FsError(err, {
              msg: "reading " + this.filePath,
              perm: "read",
            })
          )
        );
    });
  }
}
