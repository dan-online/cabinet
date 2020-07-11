import { resolve } from "./deps.ts";

import { CabinetRead } from "./handlers/Read.ts";
import { CabinetError } from "./handlers/Error.ts";
import { CabinetFile } from "./utils/File.ts";
import { CabinetWrite } from "./handlers/Write.ts";
import { CabinetDelete } from "./handlers/Delete.ts";
import { CabinetMover } from "./handlers/Move.ts";
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
  /**
   * File reader
   */
  reader: CabinetRead;
  /**
   * File writer
   */
  writer: CabinetWrite;
  /**
   * File deleter
   */
  deleter: CabinetDelete;
  /**
   * File mover
   */
  mover: CabinetMover;
  private lastDecode: { input: Uint8Array; type: string; decoded: string } = {
    input: new Uint8Array(),
    type: "",
    decoded: "",
  };
  private lastEncode: { encoded: Uint8Array; input: string } = {
    input: "",
    encoded: new Uint8Array(),
  };
  static resolve: (...paths: string[]) => string = resolve;
  constructor(file: string) {
    try {
      this.filePath = Cabinet.resolve(file);
    } catch (err) {
      new CabinetError(err, { msg: "resolving file", file, perm: "read" });
    }
    this.reader = new CabinetRead(this);
    this.writer = new CabinetWrite(this);
    this.deleter = new CabinetDelete(this);
    this.mover = new CabinetMover(this);
    return this;
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
   * Move the file with an optional callback
   */
  move(data: any, cb?: cbErrFile) {
    return this.mover.move(data, cb);
  }
  /**
   * Decode Uint8Array with optional decoding
   */
  decode(input: any, decoding: string = "utf-8") {
    if (this.lastDecode.input == input && this.lastDecode.type == decoding) {
      return this.lastDecode.decoded;
    }
    var decoder;
    try {
      decoder = new TextDecoder(decoding.toLowerCase().split("us-")[1]);
    } catch (err) {
      decoder = new TextDecoder("utf-8");
    }
    const decoded = decoder.decode(input);
    this.lastDecode = { type: decoding, decoded, input };
    return decoded;
  }
  /**
   * Encode text to UintArray
   */
  encode(input: string) {
    if (input == this.lastEncode.input) return this.lastEncode.encoded;
    const encoded = new TextEncoder().encode(input);
    this.lastEncode = { encoded, input };
    return encoded;
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
