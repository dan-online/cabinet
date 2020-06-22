import { DenoFs, FsFile, FsError } from "../index.ts";

export class FsWrite {
  filePath: string;
  fs: DenoFs;
  constructor(fs: DenoFs) {
    this.filePath = fs.filePath;
    this.fs = fs;
    return this;
  }
  encode(data: any) {
    switch (typeof data) {
      case "string": {
        return this.fs.encode(data);
      }
      case "object": {
        return this.fs.encode(JSON.stringify(data));
      }
      case "undefined": {
        throw new Error("Data required to encode!");
      }
      default: {
        if (data instanceof Uint8Array) {
          return data;
        }
        return this.fs.encode(data.toString());
      }
    }
  }
  write(
    data: Uint8Array | string | object | any,
    callback?: (err?: Error | FsError | null, file?: FsFile) => void
  ) {
    if (!callback) {
      return this.sync(data);
    }
    return this.callback(data, callback);
  }
  sync(data: any) {
    let encoded;
    try {
      encoded = this.encode(data);
      Deno.writeFileSync(this.filePath, encoded);
    } catch (err) {
      new FsError(err, {
        msg: "writing " + this.filePath,
        perm: "write",
      });
    }
    if (!encoded) throw new Error("Something went wrong");
    return new FsFile(this.fs, this.filePath, encoded);
  }
  callback(
    options: {} | ((err: Error | FsError | null, file?: FsFile) => void),
    cb: (err: Error | FsError | null, file?: FsFile) => void
  ) {
    if (!cb) throw new Error("Callback not specified!");
    Deno.readFile(this.filePath)
      .then((read) => {
        return cb(null, new FsFile(this.fs, this.filePath, read));
      })
      .catch((err) =>
        cb(
          new FsError(err, {
            msg: "reading " + this.filePath,
            perm: "read",
          })
        )
      );
    return new FsFile(this.fs, this.filePath, new Uint8Array()); // type stuff, I hate doing this
  }
  promise(options: {}) {
    return new Promise((res: (file: FsFile) => void, rej) => {
      Deno.readFile(this.filePath)
        .then((read) => {
          return res(new FsFile(this.fs, this.filePath, read));
        })
        .catch((err) =>
          rej(
            new FsError(err, {
              msg: "reading " + this.filePath,
              perm: "read",
            })
          )
        );
    });
  }
}
