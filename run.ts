import { DenoFs } from "./mod.ts";

const handler = new DenoFs("./tests.txt");

let arr = "";
let x = 0;
while (x < BigInt(9999999)) {
  arr += x;
  x++;
}

console.log("starting write");
const writeTime = new Date().getTime();

const file = handler.writer.sync(arr);

console.log(
  "wrote " +
    file.size.mb / ((new Date().getTime() - writeTime) / 1000) +
    "mb/s, " +
    file.size.mb +
    "mb in " +
    (new Date().getTime() - writeTime) / 1000 +
    "s"
);

const readTime = new Date().getTime();

const fileRead = handler.reader.sync();

console.log(
  "read " +
    fileRead.size.mb / ((new Date().getTime() - readTime) / 1000) +
    "mb/s in " +
    (new Date().getTime() - readTime) / 1000 +
    "s"
);
