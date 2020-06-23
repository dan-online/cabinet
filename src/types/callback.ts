import { CabinetError } from "../handlers/Error.ts";
import { CabinetFile } from "../utils/File.ts";

export type cbErrFile = (err?: CabinetError, file?: CabinetFile) => void;
