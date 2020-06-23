import { resolve } from "./deps.ts";

import { CabinetRead } from "./handlers/Read.ts";
import { CabinetError } from "./handlers/Error.ts";
import { CabinetFile } from "./utils/File.ts";
import { CabinetWrite } from "./handlers/Write.ts";
import { CabinetDelete } from "./handlers/Delete.ts";
import { cbErrFile } from "./types/callback.ts";

export { CabinetError, CabinetFile, CabinetRead, CabinetWrite };
export class Cabinet {
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
  get reader() {
    return new CabinetRead(this);
  }
  get writer() {
    return new CabinetWrite(this);
  }
  get deleter() {
    return new CabinetDelete(this);
  }
  delete(cb?: cbErrFile) {
    return this.deleter.delete(cb);
  }
  read(cb?: cbErrFile) {
    return this.reader.read(cb);
  }
  write(
    data: any,
    cb?: (err?: CabinetError | Error, file?: CabinetFile) => void
  ) {
    return this.writer.write(data, cb);
  }
  decode(input: any, decoding: string = "utf-8") {
    var decoder;
    try {
      decoder = new TextDecoder(decoding.toLowerCase().split("us-")[1]);
    } catch (err) {
      decoder = new TextDecoder("utf-8");
    }
    return decoder.decode(input);
  }
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
