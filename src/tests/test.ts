import { DenoFs } from "../../mod.ts";

const { resolve } = DenoFs;

let file: DenoFs;

Deno.test("open file", () => {
  file = new DenoFs(resolve("./src/tests/test.txt"));
  if (!(file instanceof DenoFs)) {
    throw new Error("not an instance of DenoFs");
  }
});

import "./read.ts";
import "./delete.ts";
import "./write.ts";
