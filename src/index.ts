import { resolve } from "./deps.ts";

import { CabinetRead } from "./handlers/Read.ts";
import { CabinetError } from "./handlers/Error.ts";
import { CabinetFile } from "./utils/File.ts";
import { CabinetWrite } from "./handlers/Write.ts";
import { CabinetDelete } from "./handlers/Delete.ts";
import { cbErrFile } from "./types/callback.ts";
/**
 * @class
 * @name Cabinet
 * @description Handler for files
 * @constructor
 * @example
 * ```
 * const file = new Cabinet("./file.txt");
 * file.read()
 * ```
 */
export class Cabinet {
  /**
   * Path to the file
   */
  filePath: string = "";
  static resolve: (...paths: string[]) => string = resolve;
  constructor(file: string) {
    try {
      this.filePath = Cabinet.resolve(file);
    } catch (err) {
      new CabinetError(err, { msg: "resolving file", file, perm: "read" });
    }
    return;
  }
  /**
   * File reader
   */
  get reader() {
    return new CabinetRead(this);
  }
  /**
   * File writer
   */
  get writer() {
    return new CabinetWrite(this);
  }
  /**
   * File deleter
   */
  get deleter() {
    return new CabinetDelete(this);
  }
  /**
   * Delete the file with an optional callback
   */
  delete(cb?: cbErrFile) {
    return this.deleter.delete(cb);
  }
  /**
   * Read the file with an optional callback
   */
  read(cb?: cbErrFile) {
    return this.reader.read(cb);
  }
  /**
   * Write to the file with an optional callback
   */
  write(data: any, cb?: cbErrFile) {
    return this.writer.write(data, cb);
  }
  /**
   * Decode Uint8Array with optional decoding
   */
  decode(input: any, decoding: string = "utf-8") {
    var decoder;
    try {
      decoder = new TextDecoder(decoding.toLowerCase().split("us-")[1]);
    } catch (err) {
      decoder = new TextDecoder("utf-8");
    }
    return decoder.decode(input);
  }
  /**
   * Encode text to UintArray
   */
  encode(input: string) {
    return new TextEncoder().encode(input);
  }
  toJSON() {
    const read: CabinetFile = this.reader.sync();
    return {
      path: this.filePath,
      file: {
        data: read.data,
        type: read.type,
        size: read.size,
        mime: read.mime,
      },
    };
  }
}
