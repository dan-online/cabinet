import { assertEquals } from "./test_deps.ts";
import { Cabinet, CabinetFile, CabinetError } from "../../mod.ts";

let fileContents = "The quick brown fox jumps over the lazy dog";

const file = new Cabinet(Cabinet.resolve("./src/tests/files/testRead.txt"));

Deno.test("sync read file", () => {
  const read = file.reader.sync();
  assertEquals(read.contents, fileContents);
});
Deno.test("cb read file", async () => {
  await new Promise((res, rej) => {
    file.reader.callback((err?: Error | CabinetError, file?: CabinetFile) => {
      if (err) return rej(err);
      assertEquals(file?.contents, fileContents);
      res(file);
    });
  });
});

Deno.test("promise read file", async () => {
  const fileD = await file.reader.promise();
  assertEquals(fileD.contents, fileContents);
});

Deno.test("sync default read", async () => {
  const fileD = file.read();
  assertEquals(fileD.contents, fileContents);
});

Deno.test("cb default read", async () => {
  await new Promise((res, rej) => {
    file.read((err?: Error | CabinetError, file?: CabinetFile) => {
      if (err) return rej(err || new Error("File didn't return"));
      assertEquals(file?.contents, fileContents);
      res(file);
    });
  });
});
