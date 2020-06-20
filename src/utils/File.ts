import { DenoFs } from "../index.ts";
import { resolve } from "../deps.ts";

/**
 * @name FsFile
 * @description Contains info and the data of a requested file
 * @class
 * @constructor
 * @param fs {DenoFs} - Main Deno file handler
 * @param filePath {string} - Path of the file resolved
 * @param data {string} - Raw data decoded using UTF-8
 * @example
 * ```
 * new FsFile(DenoFs, resolve("./file.txt"), "12345")
 * ```
 */
export class FsFile {
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
  readonly data: Uint8Array;
  private info: Deno.FileInfo;
  fs: DenoFs;
  constructor(
    fs: DenoFs,
    filePath: string,
    data: Uint8Array,
  ) {
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
    const mimes = Object
      .entries(
        JSON.parse(Deno.readTextFileSync(resolve("./src/assets/mimes.json"))),
      ).map((x) => ({ name: x[0], info: x[1] }));
    const found: { name: string; info: any } | undefined = mimes.find((
      x: { name: string; info: any },
    ) => x.info.extensions?.find((ext: string) => ext === this.ext));
    return (
      found ||
      { name: "unknown", info: { charset: "utf-8" } }
    );
  }
  /**
   * Extension of the file
   */
  get ext() {
    return (
      this.path.split(".")[this.path.split(".").length - 1] || ""
    ).toLowerCase();
  }
  /**
   * Encode to base64
   */
  toBase64() {
    return btoa(String.fromCharCode.apply(null, Array.from(this.data)));
  }
  /**
   * File contents
   */
  get contents() {
    return this.fs.decode(this.data, this.mime.info.charset);
  }
}
