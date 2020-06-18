export class DenoError {
  action: { msg: string; file?: string };
  constructor(err: Error, action: { msg: string; file?: string }) {
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
  permissionError(err: Error) {
    throw new Error(
      "permission denied when " + this.action.msg + ": " + this.action.file
    );
  }
  defaultError(err: Error) {
    throw new Error("Error when " + this.action.msg + ": " + err.message);
  }
}
