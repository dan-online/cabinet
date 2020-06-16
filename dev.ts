import { DenoFs } from "./mod.ts";

const file = new DenoFs("./file.png");

console.log(file.read.sync().size);
