import { Cabinet } from "../../mod.ts";

const { resolve } = Cabinet;

let file: Cabinet;

Deno.test("open file", () => {
  file = new Cabinet(resolve("./src/tests/test.txt"));
  if (!(file instanceof Cabinet)) {
    throw new Error("not an instance of Cabinet");
  }
});

import "./read.ts";
import "./delete.ts";
import "./write.ts";
