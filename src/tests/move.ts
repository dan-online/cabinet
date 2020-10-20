import { Cabinet } from "../../mod.ts";
import { CabinetFile } from "../utils/File.ts";
import { CabinetError } from "../handlers/Error.ts";
var movFile = new Cabinet(Cabinet.resolve("./src/tests/files/testMov.txt"));

const val = Math.random();

movFile.write(val);

Deno.test("sync default move", async () => {
  movFile.move(Cabinet.resolve("./src/tests/files/testMov2.txt"));

  movFile = new Cabinet("./src/tests/files/testMov2.txt");
});

Deno.test("cb default move", async () => {
  return await new Promise((res, rej) => {
    movFile.move(
      Cabinet.resolve("./src/tests/files/testMov3.txt"),
      (err?: CabinetError) => {
        if (err) rej(err);
        else res();
        movFile = new Cabinet("./src/tests/files/testMov3.txt");
      }
    );
  });
});

Deno.test("promise move", async () => {
  await movFile.mover.promise(Cabinet.resolve("./src/tests/files/testMov.txt"));
});

Deno.test("remove move", async () => {
  new Cabinet("./src/tests/files/testMov.txt").deleter.sync();
});
