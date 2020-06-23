import { Cabinet } from "../../mod.ts";
const delFile = new Cabinet(Cabinet.resolve("./src/tests/files/testDel.txt"));

const val = Math.random();

Deno.test("cb default delete", async () => {
  await new Promise((res, rej) => {
    delFile.write(val);
    delFile.delete(() => {
      let c;
      try {
        c = delFile.read();
      } catch {}
      if (c) {
        rej(new Error("File found: " + c?.contents));
      } else {
        res();
      }
    });
  });
});

Deno.test("promise delete", async () => {
  delFile.write(val);
  const fsFile = await delFile.deleter.promise();
  let c;
  try {
    c = delFile.read();
  } catch {}
  if (c) {
    throw new Error("File found: " + c?.contents);
  }
});

Deno.test("sync default delete", async () => {
  delFile.write(val);
  delFile.delete();
  let c;
  try {
    c = delFile.read();
  } catch {}
  if (c) {
    throw new Error("File found: " + c?.contents);
  }
});
