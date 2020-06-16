import { DenoFs } from "../index.ts";
import { DenoFile } from "../utils/File.ts";

class DenoRead {
  filePath: string;
  fs: DenoFs;
  constructor(fs: DenoFs) {
    this.filePath = fs.filePath;
    this.fs = fs;
  }
  sync(options?: {}) {
    const read = Deno.readFileSync(this.filePath);
    const file = this.fs.decode(read);
    return new DenoFile(this.fs, this.filePath, file);
  }
}

export { DenoRead };
