import { DenoFs, FsFile, FsError } from "../index.ts";

export class FsDelete {
  filePath: string;
  fs: DenoFs;
  constructor(fs: DenoFs) {
    this.filePath = fs.filePath;
    this.fs = fs;
    return this;
  }
  delete(callback?: (err?: Error | FsError, file?: FsFile) => void) {
    if (!callback) {
      return this.sync();
    }
    return this.callback(callback);
  }
  sync() {
    try {
      Deno.removeSync(this.filePath);
    } catch (err) {
      new FsError(err, {
        msg: "deleting " + this.filePath,
        perm: "write",
      });
    }
    return true;
  }
  callback(cb: (err?: Error | FsError, file?: FsFile) => void) {
    if (!cb) throw new Error("Callback not specified!");
    Deno.remove(this.filePath)
      .then((read) => {
        return cb();
      })
      .catch((err) =>
        cb(
          new FsError(err, {
            msg: "reading " + this.filePath,
            perm: "read",
          })
        )
      );
  }
  promise() {
    return new Promise((res: (file?: FsFile) => void, rej) => {
      Deno.remove(this.filePath)
        .then((read) => {
          return res();
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
