import { DenoFs } from "./mod.ts";

const { read } = new DenoFs("./me.png");
const readFile = read.sync();
console.log(readFile);
