import { DenoFs } from "../index.ts";
import { DenoFile } from "../utils/File.ts";
import { DenoError } from "./Error.ts";

/**
 * @class
 * @name DenoRead
 * @description Contains functions for reading files
 * @constructor
 * @example
 * ```
 * const { reader } = new DenoFs("./file.txt");
 * read.sync()
 * ```
 */
export class DenoRead {
  filePath: string;
  fs: DenoFs;

  constructor(fs: DenoFs) {
    this.filePath = fs.filePath;
    this.fs = fs;
    return this;
  }
  read(
    options: {} | ((err: Error | null, file: DenoFile) => void) = {},
    callback?: (err: Error | null, file: DenoFile) => void
  ) {
    if (!callback && typeof options == "function") {
      const cb = (err: Error | null, file: DenoFile) => options(err, file);
      return this.callback({}, cb);
    } else if (!callback) {
      return this.sync(options);
    }
    return this.callback(options, callback);
  }
  sync(options?: {}) {
    let read;
    let file;
    try {
      read = Deno.readFileSync(this.filePath);
      file = this.fs.decode(read);
    } catch (err) {
      new DenoError(err, { msg: "reading " + this.filePath });
    }
    if (!file) throw new Error();
    return new DenoFile(this.fs, this.filePath, file);
  }
  callback(
    options: {} | ((err: Error | null, file: DenoFile) => void),
    cb: (err: Error | null, file: DenoFile) => void
  ) {
    if (!cb) throw new Error("Callback not specified!");
    Deno.readFile(this.filePath)
      .then((read) => {
        const file = this.fs.decode(read);
        return cb(null, new DenoFile(this.fs, this.filePath, file));
      })
      .catch((err) => new DenoError(err, { msg: "reading " + this.filePath }));
    return new DenoFile(this.fs, this.filePath, ""); // type stuff, I hate doing this
  }
  promise(options: {}) {
    return new Promise((res: (file: DenoFile) => void, rej) => {
      Deno.readFile(this.filePath)
        .then((read) => {
          const file = this.fs.decode(read);
          return res(new DenoFile(this.fs, this.filePath, file));
        })
        .catch((err) =>
          rej(new DenoError(err, { msg: "reading " + this.filePath }))
        );
    });
  }
}
