import { resolve } from "./deps.ts";

import { DenoRead } from "./handlers/Read.ts";
import { FsError } from "./handlers/Error.ts";
import { FsFile } from "./utils/File.ts";

const unstable = Deno.args.find((x) => x == "--unstable") != undefined;

export class DenoFs {
  filePath: string = "";
  private unstable: boolean = unstable;
  static resolve: (...paths: string[]) => string = resolve;
  constructor(file: string) {
    try {
      this.filePath = DenoFs.resolve(file);
    } catch (err) {
      new FsError(err, { msg: "resolving file", file });
    }
    return;
  }
  get reader() {
    return new DenoRead(this);
  }
  read(options?: object, cb?: (err: Error | null, file: FsFile) => void) {
    return this.reader.read(options, cb);
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
  toJSON() {
    const read: FsFile = this.reader.sync();
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
