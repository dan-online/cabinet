> Cabinet, the easier way to manage files in Deno

<img src="src/assets/logo.png" width="200px">

# Cabinet

A module created for [Deno](https://deno.land) by [DanCodes](https://dancodes.online)

![.github/workflows/deno-win.yml](https://github.com/dan-online/cabinet/workflows/.github/workflows/deno-win.yml/badge.svg)
![.github/workflows/deno-linux.yml](https://github.com/dan-online/cabinet/workflows/.github/workflows/deno-linux.yml/badge.svg)
![.github/workflows/deno-mac.yml](https://github.com/dan-online/cabinet/workflows/.github/workflows/deno-mac.yml/badge.svg)
[![DanCodes Discord](https://img.shields.io/discord/478586684666150934?color=%237289DA&label=discord%20support&logo=discord&logoColor=%23fff)](https://discord.gg/fdpcZAA)
![GitHub repo size](https://img.shields.io/github/repo-size/dan-online/cabinet)
![GitHub tag (latest by date)](https://img.shields.io/github/v/tag/dan-online/cabinet)
[![Docs](https://img.shields.io/badge/deno-docs-green?logo=deno&color=informational)](https://doc.deno.land/https/raw.githubusercontent.com/dan-online/cabinet/master/mod.ts)

### Demo

```bash
deno run --allow-write --allow-read https://raw.githubusercontent.com/dan-online/cabinet/master/demo.ts
```

### Testing

```bash
deno test -A
```

### Use

```typescript
import {
  Cabinet,
  CabinetFile,
  CabinetError,
} from "https://raw.githubusercontent.com/dan-online/cabinet/master/mod.ts"; // or ./mod.ts if cloned

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

file.reader.promise().then((cFile: CabinetFile) => {
  console.log("read " + cFile.size.mb + "mb in promise");
});

file.reader.callback((err?: CabinetError, cFile?: CabinetFile) => {
  console.log("read " + cFile?.size.mb + "mb in callback");
});
```

## Format code

```bash
deno fmt **/*.ts
```

## Resources

- [Deno Website](https://deno.land)
- [Deno Style Guide](https://deno.land/std/style_guide.md)
- [Deno Gitter](https://gitter.im/denolife/Lobby)
