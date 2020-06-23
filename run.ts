import { Cabinet } from "./mod.ts";

const handler = new Cabinet("./tests.txt");

let arr = "";
let x = 0;
while (x < BigInt(29999999)) {
  arr += x;
  x++;
}

console.log("starting write");
const writeTime = new Date().getTime();

const file = handler.writer.sync(arr);
const size = file.size.mb;

console.log(
  "wrote " +
    size / ((new Date().getTime() - writeTime) / 1000) +
    "mb/s, " +
    size +
    "mb in " +
    (new Date().getTime() - writeTime) / 1000 +
    "s"
);

const readTime = new Date().getTime();

handler.reader.sync();

console.log(
  "read " +
    size / ((new Date().getTime() - readTime) / 1000) +
    "mb/s in " +
    (new Date().getTime() - readTime) / 1000 +
    "s"
);

const delTime = new Date().getTime();

handler.deleter.sync();

console.log(
  "del " +
    size / ((new Date().getTime() - delTime) / 1000) +
    "mb/s in " +
    (new Date().getTime() - delTime) / 1000 +
    "s"
);
