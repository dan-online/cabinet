import { Cabinet } from "../../mod.ts";
// cd to me and run deno run --unstable -A ./benchmarks.ts;  python -m SimpleHTTPServer
function testSize(MB: number, amount: number, cb: (any: any) => void) {
  const tmp = Deno.env.get("TMPDIR");
  if (!tmp) throw new Error("No temp dir found");
  const a = Array(MB * 1000000)
    .fill("A")
    .map((x) => {
      let r = Math.random().toString().split(".")[1];
      return r.split("")[r.split("").length - 1];
    })
    .join("");
  let writes: any[] = [];
  let reads: any[] = [];
  let denoWrites: any[] = [];
  let denoReads: any[] = [];
  let info = new Cabinet(tmp + Math.random().toString() + ".txt").write(a);
  const File = new Cabinet(
    tmp + Math.random().toString().split(".")[1] + ".txt"
  );
  function test() {
    let startTime = new Date().getTime();
    File.writer.sync(a);
    writes.push({
      trial: writes.length,
      time: new Date().getTime(),
      speed: new Date().getTime() - startTime,
    });
    startTime = new Date().getTime();
    File.reader.sync();
    reads.push({
      trial: reads.length,
      time: new Date().getTime(),
      speed: new Date().getTime() - startTime,
    });
    if (writes.length >= amount) {
      console.log("Finished " + writes.length + " cabinet runs");
      console.log("starting deno test");
      return setTimeout(testDeno, 1000);
    } else {
      if (writes.length == amount / 2) {
        console.log("Finished " + writes.length + " cabinet runs");
      }
      return setTimeout(test, 10);
    }
  }

  function testDeno() {
    const location = tmp + Math.random().toString().split(".")[1] + ".txt";
    let startTime = new Date().getTime();
    const encode = new TextEncoder().encode(a);
    Deno.writeFileSync(location, encode);
    denoWrites.push({
      trial: denoWrites.length,
      time: new Date().getTime(),
      speed: new Date().getTime() - startTime,
    });
    startTime = new Date().getTime();
    // console.log("Finished " + denoWrites.length + " writes");
    const val = Deno.readFileSync(location);
    new TextDecoder().decode(val);
    Deno.statSync(location);
    denoReads.push({
      trial: denoReads.length,
      time: new Date().getTime(),
      speed: new Date().getTime() - startTime,
    });
    if (denoWrites.length > amount) {
      console.log("Finished " + writes.length + " deno runs");
      done();
    } else {
      if (denoWrites.length == amount / 2) {
        console.log("Finished " + denoWrites.length + " deno runs");
      }
      return setTimeout(testDeno, 10);
    }
  }

  function done() {
    console.log("Finished all runs");
    cb({
      info: { size: info.size, amount },
      cabinet: {
        writes: writes.slice(1),
        reads: reads.slice(1),
      },
      deno: {
        writes: denoWrites.slice(1),
        reads: denoReads.slice(1),
      },
    });
    // lastFile.delete();
  }
  console.log(MB + "mb size started");
  test();
}
console.log("Start...");

testSize(0.5, 100, function (tiny) {
  testSize(1, 100, function (small) {
    testSize(5, 50, function (medium) {
      testSize(10, 10, function (large) {
        testSize(25, 10, function (big) {
          new Cabinet("./runs.json").write({
            results: { tiny, small, medium, large, big },
            about: { finish: new Date() },
          });
        });
      });
    });
  });
});
