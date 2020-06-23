import { FsError } from "../handlers/Error.ts";
import { FsFile } from "../utils/File.ts";

export type cbErrFile = (err?: Error | FsError, file?: FsFile) => void;
