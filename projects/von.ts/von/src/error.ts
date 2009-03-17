export class VonParseError extends Error {
  readonly position: number;

  constructor(position: number, message: string) {
    super(`VON parse error at ${position}: ${message}`);
    this.name = "VonParseError";
    this.position = position;
  }
}

export class VonError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "VonError";
  }
}
