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
 * const { read } = new DenoFs("./file.png");
 * read.sync()
 * ```
 */
export class DenoRead {
  filePath: string;
  fs: DenoFs;
  constructor(fs: DenoFs) {
    this.filePath = fs.filePath;
    this.fs = fs;
  }
  sync(options?: {}) {
    try {
      const read = Deno.readFileSync(this.filePath);
      const file = this.fs.decode(read);
      return new DenoFile(this.fs, this.filePath, file);
    } catch (err) {
      return new DenoError(err, { msg: "reading " + this.filePath });
    }
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
  }
}
