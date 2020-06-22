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
  read(
    options: {} | ((err: Error | null, file: FsFile) => void) = {},
    callback?: (err: Error | null, file: FsFile) => void
  ) {
    if (!callback && typeof options == "function") {
      const cb = (err: Error | null, file: FsFile) => options(err, file);
      return this.callback({}, cb);
    } else if (!callback) {
      return this.sync(options);
    }
    return this.callback(options, callback);
  }
  sync(options?: {}) {
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
  callback(
    options: {} | ((err: Error | null, file: FsFile) => void),
    cb: (err: Error | null, file: FsFile) => void
  ) {
    if (!cb) throw new Error("Callback not specified!");
    Deno.readFile(this.filePath)
      .then((read) => {
        return cb(null, new FsFile(this.fs, this.filePath, read));
      })
      .catch(
        (err) =>
          new FsError(err, {
            msg: "reading " + this.filePath,
            perm: "read",
          })
      );
    return new FsFile(this.fs, this.filePath, new Uint8Array()); // type stuff, I hate doing this
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
