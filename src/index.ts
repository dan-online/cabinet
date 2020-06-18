import { resolve } from "./deps.ts";

import { DenoRead } from "./handlers/Read.ts";
import { DenoError } from "./handlers/Error.ts";

const unstable = Deno.args.find((x) => x == "--unstable") != undefined;

export class DenoFs {
  filePath: string = "";
  decoder: TextDecoder;
  static resolve: (...paths: string[]) => string = resolve;
  unstable: boolean = unstable;
  static thisDir(imp: any) {
    if (!imp.url) throw new Error("Import needs to be passed as a parameter");
    return imp.url.split("/").slice(0, -1).join("/").split("file://").join("");
  }
  constructor(file: string, options?: { decoding: string }) {
    this.decoder = new TextDecoder(options?.decoding || "utf-8");
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
