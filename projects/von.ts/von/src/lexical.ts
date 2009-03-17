/** Identifier start: ASCII letter or `_`. */
export function isIdentifierStart(ch: string): boolean {
  return ch === "_" || (/^[A-Za-z]$/).test(ch);
}

/** Identifier continue: start chars plus digits, `.`, `-`, `@`. */
export function isIdentifierContinue(ch: string): boolean {
  return isIdentifierStart(ch) || (/^[0-9.\-@]$/).test(ch);
}

/** Decode a VON string literal body (without surrounding quotes). */
export function decodeStringLiteral(source: string): string {
  let buffer = "";
  for (let i = 0; i < source.length; i += 1) {
    const ch = source[i]!;
    if (ch === "\\") {
      const escaped = source[i + 1];
      if (escaped === undefined) {
        throw new Error("unterminated string escape");
      }
      i += 1;
      switch (escaped) {
        case '"':
          buffer += '"';
          break;
        case "\\":
          buffer += "\\";
          break;
        case "n":
          buffer += "\n";
          break;
        case "r":
          buffer += "\r";
          break;
        case "t":
          buffer += "\t";
          break;
        default:
          buffer += escaped;
      }
    } else {
      buffer += ch;
    }
  }
  return buffer;
}
