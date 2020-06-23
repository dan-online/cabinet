import { assertEquals } from "./test_deps.ts";
import { Cabinet, CabinetFile, CabinetError } from "../../mod.ts";

const file = new Cabinet(Cabinet.resolve("./src/tests/files/testWrite.txt"));

Deno.test("sync write file", () => {
  const write = file.writer.sync("hiya");
  assertEquals(write.contents, file.reader.sync().contents);
});

Deno.test("cb write file", async () => {
  await new Promise((res, rej) => {
    file.writer.callback(
      "hiya",
      (err?: Error | CabinetError, fsfile?: CabinetFile) => {
        if (err) return rej(err);
        assertEquals(fsfile?.contents, file.reader.sync().contents);
        res(fsfile);
      }
    );
  });
});

Deno.test("promise write file", async () => {
  const fileD = await file.writer.promise("hewo!");
  assertEquals(fileD.contents, file.reader.sync().contents);
});

Deno.test("sync default write", async () => {
  const fileD = file.write("OwO");
  assertEquals(fileD.contents, file.reader.sync().contents);
});

Deno.test("cb default write", async () => {
  await new Promise((res, rej) => {
    file.write("UwU", (err?: Error | CabinetError, fsfile?: CabinetFile) => {
      if (err || !fsfile) return rej(err || new Error("File didn't return"));
      assertEquals(fsfile?.contents, file.reader.sync().contents);
      res(file);
    });
  });
});
