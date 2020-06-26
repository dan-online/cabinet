import { Cabinet } from "../../mod.ts";
// cd to me and run deno run --unstable -A ./benchmarks.ts;  python -m SimpleHTTPServer
const tmp = Deno.dir("tmp");
const amount = 100;
const a = Array(100000)
  .fill("A")
  .map((x) => Math.random());
let writes: any[] = [];
let reads: any[] = [];
let starts = new Date().getTime();
function test() {
  const File = new Cabinet(tmp + Math.random().toString().split(".")[1]);
  File.writer.callback(a, () => {
    writes.push({
      trial: writes.length,
      time: new Date().getTime(),
      speed:
        new Date().getTime() -
        (writes[writes.length - 1] || { time: starts }).time,
    });
    if ((amount / 10) % writes.length == 0) {
      console.log("Finished " + writes.length + " writes");
    }
    File.reader.callback(() => {
      reads.push({
        trial: reads.length,
        time: new Date().getTime(),
        speed:
          new Date().getTime() -
          (reads[reads.length - 1] || { time: starts }).time,
      });
      if ((amount / 10) % reads.length == 0) {
        console.log("Finished " + reads.length + " reads");
      }
      if (reads.length >= amount) {
        done();
        File.delete();
      } else {
        test();
        File.delete();
      }
    });
  });
}

function done() {
  const writeSpeed = (new Date().getTime() - writes[0].time) / 1000;
  console.log(
    `\nWrites: ${writes.length}\nWrites/s: ${
      writes.length / writeSpeed
    }\nTime: ${writeSpeed}s\nAvg Speed: ${
      writes.reduce((prev, curr) => (prev += curr.speed), 0) / writes.length
    }ms`
  );
  const readSpeed = (new Date().getTime() - reads[0].time) / 1000;
  console.log(
    `\nReads: ${reads.length}\nReads/s: ${
      reads.length / readSpeed
    }\nTime: ${readSpeed}s\nAvg Speed: ${
      reads.reduce((prev, curr) => (prev += curr.speed), 0) / reads.length
    }ms`
  );
  new Cabinet("./runs.json").write({ writes, reads });
}
console.log("Start...");
test();
