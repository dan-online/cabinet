import { assertEquals } from "./test_deps.ts";
import { DenoFs } from "../../mod.ts";
import { DenoFile } from "../utils/File.ts";

const { resolve } = DenoFs;

let file: DenoFs;

let fileContents =
  "±!@£$%^&*()_+§1234567890-=QWERTYUIOP{}qwertyuiop[]ASDFGHJKL:\"|asdfghjkl;'~ZXCVBNM<>?`zxcvbnm,./😂";

Deno.test("open file", () => {
  file = new DenoFs(resolve("./src/tests/test.txt"));
  if (!(file instanceof DenoFs)) {
    throw new Error("not an instance of DenoFs");
  }
});
Deno.test("sync read file", () => {
  const read = file.reader.sync();
  assertEquals(read.data, fileContents);
});
Deno.test("cb read file", async () => {
  await new Promise((res, rej) => {
    file.reader.callback({}, (err: Error | null, file: DenoFile) => {
      if (err) rej(err);
      assertEquals(file.data, fileContents);
      res(file);
    });
  });
});
Deno.test("promise read file", async () => {
  const fileD = await file.reader.promise({});
  assertEquals(fileD.data, fileContents);
});

Deno.test("sync default read", async () => {
  const fileD = file.read();
  assertEquals(fileD.data, fileContents);
});

Deno.test("cb default read", async () => {
  await new Promise((res, rej) => {
    file.read((err: Error | null, file: DenoFile) => {
      if (err) rej(err);
      assertEquals(file.data, fileContents);
      res(file);
    });
  });
});
