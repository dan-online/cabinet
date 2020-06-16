import { debug, resolve } from "./deps.ts";

import { DenoRead } from "./handlers/Read.ts";

export class DenoFs {
  filePath: string;
  decoder: TextDecoder = new TextDecoder("utf-8");
  read: DenoRead;
  resolve: (path: string) => string = resolve;
  constructor(image: string) {
    this.filePath = this.resolve(image);
    this.read = new DenoRead(this);
    return this;
  }

  decode(input: any) {
    return this.decoder.decode(input);
  }
}
