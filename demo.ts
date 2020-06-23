import { Cabinet } from "./mod.ts";

const file = new Cabinet("./testing.txt");

file.write("Hi there! This is Cabinet that's made this file.");

console.log(`"${file.read().contents}" was written to ` + file.filePath);
