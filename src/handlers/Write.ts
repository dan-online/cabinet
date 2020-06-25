import { Cabinet, CabinetFile, CabinetError } from "../../mod.ts";
import { cbErrFile } from "../types/callback.ts";
/**
 * @class
 * @name CabinetWrite
 * @description Contains functions for writing files
 * @constructor
 * @example
 * ```
 * const { writer } = new Cabinet("./file.txt");
 * writer.sync("Hello!")
 * ```
 */
export class CabinetWrite {
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
   * Encode the file to Uint8Array
   */
  encode(data: any) {
    switch (typeof data) {
      case "string": {
        return this.fs.encode(data);
      }
      case "object": {
        return this.fs.encode(JSON.stringify(data));
      }
      case "undefined": {
        throw new Error("Data required to encode!");
      }
      default: {
        if (data instanceof Uint8Array) {
          return data;
        }
        return this.fs.encode(data.toString());
      }
    }
  }
  /**
   * Write to the file with an optional callback
   */
  write(data: Uint8Array | string | object | any, callback?: cbErrFile) {
    if (!callback) {
      return this.sync(data);
    }
    return this.callback(data, callback);
  }
  /**
   * Synchronously write to a file
   */
  sync(data: any) {
    let encoded;
    try {
      encoded = this.encode(data);
      Deno.writeFileSync(this.filePath, encoded);
    } catch (err) {
      new CabinetError(err, {
        msg: "writing " + this.filePath,
        perm: "write",
      });
    }
    if (!encoded) throw new Error("Something went wrong");
    return new CabinetFile(this.fs, this.filePath, encoded);
  }
  /**
   * Write to the file and receive a callback
   */
  callback(data: any, cb: cbErrFile) {
    const encoded = this.encode(data);
    if (!cb) throw new Error("Callback not specified!");
    Deno.writeFile(this.filePath, encoded)
      .then(() => {
        return cb(undefined, new CabinetFile(this.fs, this.filePath, encoded));
      })
      .catch((err) =>
        cb(
          new CabinetError(err, {
            msg: "writing " + this.filePath,
            perm: "write",
          })
        )
      );
    return new CabinetFile(this.fs, this.filePath, encoded);
  }
  /**
   * Write to the file and receive a promise
   */
  promise(data: any) {
    return new Promise((res: (file: CabinetFile) => void, rej) => {
      const encoded = this.encode(data);
      Deno.writeFile(this.filePath, encoded)
        .then(() => {
          return res(new CabinetFile(this.fs, this.filePath, encoded));
        })
        .catch((err) =>
          rej(
            new CabinetError(err, {
              msg: "writing " + this.filePath,
              perm: "write",
            })
          )
        );
    });
  }
}
