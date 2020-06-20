import { DenoFs } from "./mod.ts";

const handler = new DenoFs(
  "./src/tests/test.txt",
);

const file = handler.reader.sync();
console.log(file.mime);
