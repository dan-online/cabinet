import { assertEquals } from "./test_deps.ts";
import { DenoFs } from "../../mod.ts";
import { DenoFile } from "../utils/File.ts";

const { resolve, thisDir } = DenoFs;

let file: DenoFs;

Deno.test("open file", () => {
  file = new DenoFs(resolve(thisDir(import.meta), "./test.txt"));
  if (!(file instanceof DenoFs)) {
    throw new Error("not an instance of DenoFs");
  }
});
Deno.test("sync read file", () => {
  file.read.sync();
});
Deno.test("cb read file", async () => {
  await new Promise((res, rej) => {
    file.read.callback({}, (err: Error | null, file: DenoFile) => {
      if (err) rej(err);
      res(file);
    });
  });
});
