import { Cabinet } from "../index.ts";
import { CabinetFile } from "../utils/File.ts";
import { CabinetError } from "./Error.ts";
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
  move(location: string, callback?: (err?: CabinetError) => void) {
    if (!callback) {
      return this.sync(location);
    }
    return this.callback(location, callback);
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
  /**
   * Move the file and receive a callback
   */
  callback(location: string, cb: (err?: CabinetError) => void) {
    let loc = Cabinet.resolve(location);
    let moveTo = new Cabinet(loc);
    this.fs.reader.callback((err?: CabinetError, file?: CabinetFile) => {
      if (err) return cb(err);
      if (!file)
        return cb(
          new CabinetError(new Error("no file found!"), {
            msg: "reading " + this.filePath,
          })
        );
      moveTo.writer.callback(file.contents, (err?: CabinetError) => {
        if (err) return cb(err);
        this.fs.deleter.callback((err?: CabinetError) => {
          if (err) return cb(err);
          cb();
        });
      });
    });
    return new CabinetFile(this.fs, this.filePath, new Uint8Array());
  }
  /**
   * Move the file and receive a promise
   */
  promise(location: string) {
    return new Promise(
      (
        res: (newLocation: string) => void,
        rej: (err: CabinetError) => void
      ) => {
        this.callback(location, (err?: CabinetError) => {
          if (err) rej(err);
          else res(location);
        });
      }
    );
  }
}
