import { resolve, dirname } from "./deps.ts";

import { DenoRead } from "./handlers/Read.ts";
import { DenoError } from "./handlers/Error.ts";
import { DenoFile } from "./utils/File.ts";

const unstable = Deno.args.find((x) => x == "--unstable") != undefined;

export class DenoFs {
  filePath: string = "";
  decoder: TextDecoder;
  static resolve: (...paths: string[]) => string = resolve;
  unstable: boolean = unstable;
  constructor(file: string, options?: { decoding: string }) {
    this.decoder = new TextDecoder(options?.decoding || "utf-8");
    try {
      this.filePath = DenoFs.resolve(file);
    } catch (err) {
      new DenoError(err, { msg: "resolving file", file });
    }
    return this;
  }
  get reader() {
    return new DenoRead(this);
  }
  read(options?: object, cb?: (err: Error | null, file: DenoFile) => void) {
    return this.reader.read(options, cb);
  }
  decode(input: any) {
    return this.decoder.decode(input);
  }
}
