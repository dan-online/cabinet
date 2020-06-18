import { resolve } from "./deps.ts";

import { DenoRead } from "./handlers/Read.ts";
import { DenoError } from "./handlers/Error.ts";

export class DenoFs {
  filePath: string = "";
  decoder: TextDecoder = new TextDecoder("utf-8");
  static resolve: (...paths: string[]) => string = resolve;
  static thisDir(imp: any) {
    if (!imp.url) throw new Error("Import needs to be passed as a parameter");
    return imp.url.split("/").slice(0, -1).join("/").split("file://").join("");
  }
  constructor(file: string) {
    try {
      this.filePath = DenoFs.resolve(file);
    } catch (err) {
      new DenoError(err, { msg: "resolving file", file });
    }
    return this;
  }
  get read() {
    return new DenoRead(this);
  }
  decode(input: any) {
    return this.decoder.decode(input);
  }
}
