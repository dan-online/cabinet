import { Cabinet, CabinetFile } from "../../mod.ts";
// cd to me and run deno run --unstable -A ./benchmarks.ts;  python -m SimpleHTTPServer
const tmp = Deno.env.get("TMPDIR");
const amount = 50;
const a = Array(2000000).fill("A").join("");
let writes: any[] = [];
let reads: any[] = [];
let denoWrites: any[] = [];
let denoReads: any[] = [];
let info = new Cabinet(tmp + Math.random().toString()).write(a);
function test() {
  const File = new Cabinet(tmp + Math.random().toString().split(".")[1]);
  let startTime = new Date().getTime();
  File.writer.promise(a).then(() => {
    writes.push({
      trial: writes.length,
      time: new Date().getTime(),
      speed: new Date().getTime() - startTime,
    });
    startTime = new Date().getTime();
    File.reader.promise().then((file: CabinetFile) => {
      if (file.contents != a) {
        console.error(new Error("Wrong contents!"));
        return Deno.exit();
      }
      reads.push({
        trial: reads.length,
        time: new Date().getTime(),
        speed: new Date().getTime() - startTime,
      });
      if (writes.length >= amount) {
        console.log("starting deno test");
        return setTimeout(testDeno, 10000);
      } else {
        return setTimeout(test, 10);
      }
    });
  });
}

function testDeno() {
  const location = tmp + Math.random().toString().split(".")[1];
  let startTime = new Date().getTime();
  Deno.writeFile(location, new TextEncoder().encode(a)).then(() => {
    denoWrites.push({
      trial: denoWrites.length,
      time: new Date().getTime(),
      speed: new Date().getTime() - startTime,
    });
    startTime = new Date().getTime();
    // console.log("Finished " + denoWrites.length + " writes");
    Deno.readFile(location).then((val) => {
      const contents = new TextDecoder().decode(val);
      if (contents != a) {
        console.error(new Error("Wrong contents!"));
        return Deno.exit();
      }
      denoReads.push({
        trial: denoReads.length,
        time: new Date().getTime(),
        speed: new Date().getTime() - startTime,
      });
      if (denoWrites.length >= amount) {
        done();
      } else {
        return setTimeout(testDeno, 10);
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
  // const readSpeed = (new Date().getTime() - reads[0].time) / 1000;
  // console.log(
  //   `\nReads: ${reads.length}\nReads/s: ${
  //     reads.length / readSpeed
  //   }\nTime: ${readSpeed}s\nAvg Speed: ${
  //     reads.reduce((prev, curr) => (prev += curr.speed), 0) / reads.length
  //   }ms`
  // );
  new Cabinet("./runs.json").write({
    info: { size: info.size, amount, speed: writeSpeed },
    cabinet: {
      writes,
      reads,
    },
    deno: {
      writes: denoWrites,
      reads: denoReads,
    },
  });
  // lastFile.delete();
}
console.log("Start...");
test();
