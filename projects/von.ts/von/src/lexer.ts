import { VonParseError } from "./error.js";
import { isIdentifierContinue, isIdentifierStart } from "./lexical.js";
import { isTrivia, type Token, type TokenKind } from "./token.js";

export class Lexer {
  private readonly source: string;
  private offset = 0;
  private readonly tokens: Token[] = [];

  private constructor(source: string) {
    this.source = source;
  }

  static tokenizeClean(source: string): Token[] {
    return this.tokenizeLossless(source).filter((token) => !isTrivia(token.kind));
  }

  static tokenizeLossless(source: string): Token[] {
    const lexer = new Lexer(source);
    while (lexer.offset < source.length) {
      if (lexer.lexTrivia()) {
        continue;
      }
      if (lexer.offset >= source.length) {
        break;
      }
      lexer.lexToken();
    }
    lexer.tokens.push({ kind: "Eof", start: source.length, end: source.length });
    return lexer.tokens;
  }

  static tokenize(source: string): Token[] {
    return this.tokenizeClean(source);
  }

  private lexTrivia(): boolean {
    const start = this.offset;
    if (this.source.startsWith("#", this.offset)) {
      while (this.offset < this.source.length) {
        const ch = this.source[this.offset]!;
        this.offset += 1;
        if (ch === "\n") {
          break;
        }
      }
      this.tokens.push({ kind: "LineComment", start, end: this.offset });
      return true;
    }

    const ch = this.peekChar();
    if (ch !== undefined && /\s/.test(ch)) {
      this.offset += ch.length;
      this.tokens.push({ kind: "Whitespace", start, end: this.offset });
      return true;
    }
    return false;
  }

  private lexToken(): void {
    const start = this.offset;
    const ch = this.peekChar();
    if (ch === undefined) {
      return;
    }

    let kind: TokenKind;
    switch (ch) {
      case "{":
        this.offset += 1;
        kind = "LBrace";
        break;
      case "}":
        this.offset += 1;
        kind = "RBrace";
        break;
      case "[":
        this.offset += 1;
        kind = "LBracket";
        break;
      case "]":
        this.offset += 1;
        kind = "RBracket";
        break;
      case ":":
        this.offset += 1;
        kind = "Colon";
        break;
      case ",":
        this.offset += 1;
        kind = "Comma";
        break;
      case '"':
        this.lexString();
        kind = "StringLiteral";
        break;
      default:
        if (ch === "-" || (/^[0-9]$/).test(ch)) {
          this.lexNumber();
          kind = "IntegerLiteral";
        } else if (isIdentifierStart(ch)) {
          kind = this.lexIdentifier(start);
        } else {
          throw new VonParseError(start, `unexpected character '${ch}'`);
        }
    }

    this.tokens.push({ kind, start, end: this.offset });
  }

  private lexIdentifier(start: number): TokenKind {
    while (this.peekChar() !== undefined && isIdentifierContinue(this.peekChar()!)) {
      this.offset += this.peekChar()!.length;
    }
    const text = this.source.slice(start, this.offset);
    if (text === "null") return "Null";
    if (text === "true") return "True";
    if (text === "false") return "False";
    return "Identifier";
  }

  private lexString(): void {
    const start = this.offset;
    this.expectChar('"');
    for (;;) {
      const ch = this.nextChar();
      if (ch === undefined) {
        throw new VonParseError(start, "unterminated string");
      }
      if (ch === '"') {
        return;
      }
      if (ch === "\\") {
        if (this.nextChar() === undefined) {
          throw new VonParseError(start, "unterminated string escape");
        }
      }
    }
  }

  private lexNumber(): void {
    if (this.peekChar() === "-") {
      this.offset += 1;
      const next = this.peekChar();
      if (next === undefined || !/^[0-9]$/.test(next)) {
        throw new VonParseError(this.offset - 1, "expected digit after '-'");
      }
    }
    while (this.peekChar() !== undefined && /^[0-9]$/.test(this.peekChar()!)) {
      this.offset += 1;
    }
  }

  private peekChar(): string | undefined {
    return this.source[this.offset];
  }

  private nextChar(): string | undefined {
    const ch = this.peekChar();
    if (ch === undefined) {
      return undefined;
    }
    this.offset += ch.length;
    return ch;
  }

  private expectChar(expected: string): void {
    const ch = this.nextChar();
    if (ch === expected) {
      return;
    }
    if (ch === undefined) {
      throw new VonParseError(this.offset, `expected '${expected}'`);
    }
    throw new VonParseError(this.offset - 1, `expected '${expected}'`);
  }
}
