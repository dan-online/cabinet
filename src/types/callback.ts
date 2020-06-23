import { CabinetError } from "../handlers/Error.ts";
import { CabinetFile } from "../utils/File.ts";

export type cbErrFile = (
  err?: Error | CabinetError,
  file?: CabinetFile
) => void;
