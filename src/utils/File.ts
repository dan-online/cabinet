import { DenoFs } from "../index.ts";
import { resolve } from "../deps.ts";

const mimes = Object.entries(
  JSON.parse(Deno.readTextFileSync(resolve("./src/assets/mimes.json")))
).map((x) => ({ mime: x[0], info: x[1] }));

/**
 * @name DenoFile
 * @description Contains info and the data of a requested file
 * @example
 * new DenoFile(DenoFs, resolve("./file.txt"), "12345")
 * @class
 * @constructor
 * @param fs {DenoFs} - Main Deno file handler
 * @param filePath {string} - Path of the file resolved
 * @param data {string} - Raw data decoded using UTF-8
 */
class DenoFile {
  private mimes: { mime: string; info: any }[] = mimes;
  /**
   * Path of the file
   * @type string
   * @readonly
   */
  readonly path: string;
  /**
   * Raw file contents
   * @type string
   * @readonly
   */
  readonly data: string;
  private info: Deno.FileInfo;
  fs: DenoFs;
  constructor(fs: DenoFs, filePath: string, data: string) {
    this.fs = fs;
    this.path = filePath;
    this.data = data;
    this.info = Deno.statSync(this.path);
  }
  /**
   * Type of the file
   * @returns "file" or "dir"
   */
  get type() {
    return this.info.isFile ? "file" : "dir";
  }
  /**
   * Size of the file
   * @returns size of the file in bytes, kilobytes, megabytes and gigabytes
   */
  get size() {
    return {
      bytes: this.info.size,
      kb: this.info.size / 1000,
      mb: this.info.size / 1000000,
      gb: this.info.size / 1000000000,
    };
  }
  /**
   * Mime of the file
   */
  get mime() {
    return (
      this.mimes.find((x) =>
        x.info.extensions?.find((x: string) => x === this.ext)
      ) || {}
    );
  }
  get ext() {
    return (
      this.path.split(".")[this.path.split(".").length - 1] || ""
    ).toLowerCase();
  }
}

export { DenoFile };
