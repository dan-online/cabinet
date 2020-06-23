import { Cabinet, CabinetFile, CabinetError } from "../../mod.ts";
import { cbErrFile } from "../types/callback.ts";

export class CabinetWrite {
  filePath: string;
  fs: Cabinet;
  constructor(fs: Cabinet) {
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
  write(data: Uint8Array | string | object | any, callback?: cbErrFile) {
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
      new CabinetError(err, {
        msg: "writing " + this.filePath,
        perm: "write",
      });
    }
    if (!encoded) throw new Error("Something went wrong");
    return new CabinetFile(this.fs, this.filePath, encoded);
  }
  callback(data: any, cb: cbErrFile) {
    const encoded = this.encode(data);
    if (!cb) throw new Error("Callback not specified!");
    Deno.writeFile(this.filePath, encoded)
      .then(() => {
        return cb(undefined, new CabinetFile(this.fs, this.filePath, encoded));
      })
      .catch((err) =>
        cb(
          new CabinetError(err, {
            msg: "reading " + this.filePath,
            perm: "read",
          })
        )
      );
    return new CabinetFile(this.fs, this.filePath, encoded);
  }
  promise(data: any) {
    return new Promise((res: (file: CabinetFile) => void, rej) => {
      const encoded = this.encode(data);
      Deno.writeFile(this.filePath, encoded)
        .then(() => {
          return res(new CabinetFile(this.fs, this.filePath, encoded));
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
