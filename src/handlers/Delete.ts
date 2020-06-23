import { Cabinet, CabinetFile, CabinetError } from "../index.ts";
import { cbErrFile } from "../types/callback.ts";
export class CabinetDelete {
  filePath: string;
  fs: Cabinet;
  constructor(fs: Cabinet) {
    this.filePath = fs.filePath;
    this.fs = fs;
    return this;
  }
  delete(callback?: cbErrFile) {
    if (!callback) {
      return this.sync();
    }
    return this.callback(callback);
  }
  sync() {
    try {
      Deno.removeSync(this.filePath);
    } catch (err) {
      new CabinetError(err, {
        msg: "deleting " + this.filePath,
        perm: "write",
      });
    }
    return true;
  }
  callback(cb: cbErrFile) {
    if (!cb) throw new Error("Callback not specified!");
    Deno.remove(this.filePath)
      .then((read) => {
        return cb();
      })
      .catch((err) =>
        cb(
          new CabinetError(err, {
            msg: "reading " + this.filePath,
            perm: "read",
          })
        )
      );
  }
  promise() {
    return new Promise((res: (file?: CabinetFile) => void, rej) => {
      Deno.remove(this.filePath)
        .then(() => {
          return res();
        })
        .catch((err) =>
          rej(
            new CabinetError(err, {
              msg: "reading " + this.filePath,
              perm: "read",
            })
          )
        );
    });
  }
}
