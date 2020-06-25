/**
 * @class
 * @name CabinetError
 * @description An error thrown by Cabinet
 * @constructor
 */

export class CabinetError {
  action: { msg: string; file?: string; perm?: string };
  constructor(
    err: Error,
    action: { msg: string; file?: string; perm?: string }
  ) {
    this.action = action;
    switch (err.name) {
      case "PermissionDenied":
        this.permissionError(err);
        break;
      default:
        this.defaultError(err);
        break;
    }
  }
  private permissionError(err: Error) {
    throw new Error(
      "permission denied when " +
        this.action.msg +
        (this.action.file ? ": " + this.action.file : "") +
        (this.action.perm
          ? ", try running with --allow-" + this.action.perm
          : "")
    );
  }
  private defaultError(err: Error) {
    throw new Error("Error when " + this.action.msg + ": " + err.message);
  }
}
