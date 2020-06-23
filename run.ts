// import { Cabinet } from "./mod.ts";

// const handler = new Cabinet("./tests.txt");

// let arr = "";
// let x = 0;
// while (x < BigInt(29999999)) {
//   arr += x;
//   x++;
// }

// console.log("starting write");
// const writeTime = new Date().getTime();

// const file = handler.writer.sync(arr);
// const size = file.size.mb;

// console.log(
//   "wrote " +
//     size / ((new Date().getTime() - writeTime) / 1000) +
//     "mb/s, " +
//     size +
//     "mb in " +
//     (new Date().getTime() - writeTime) / 1000 +
//     "s"
// );

// const readTime = new Date().getTime();

// handler.reader.sync();

// console.log(
//   "read " +
//     size / ((new Date().getTime() - readTime) / 1000) +
//     "mb/s in " +
//     (new Date().getTime() - readTime) / 1000 +
//     "s"
// );

// const delTime = new Date().getTime();

// handler.deleter.sync();

// console.log(
//   "del " +
//     size / ((new Date().getTime() - delTime) / 1000) +
//     "mb/s in " +
//     (new Date().getTime() - delTime) / 1000 +
//     "s"
// );
import { Cabinet, CabinetFile, CabinetError } from "./mod.ts";

const file = new Cabinet("./testing.txt");

file.write("The date is " + new Date());

file.write("The date is " + new Date(), () => console.log("finished!"));

file.writer.sync("This was written synchronously");

file.writer
  .promise("This was written with a promise")
  .then(() => console.log("finished!"));

file.writer.callback("This was written with a callback", () =>
  console.log("finished!")
);

file.read();

file.read(() => console.log("finished!"));

file.reader.sync();

file.reader.promise().then((CabinetFile) => {
  console.log("read " + CabinetFile.size.mb + "mb in promise");
});

file.reader.callback((err?: CabinetError, File?: CabinetFile) => {
  console.log("read " + File?.size.mb + "mb in callback");
});
