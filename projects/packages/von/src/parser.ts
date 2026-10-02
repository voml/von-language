import { VonParseError } from "./error.js";
import { Lexer } from "./lexer.js";
import { decodeStringLiteral } from "./lexical.js";
import type { Token, TokenKind } from "./token.js";
import type { VonValue } from "./value.js";

export class VonParser {
  private readonly source: string;
  private readonly tokens: Token[];
  private index = 0;

  private constructor(source: string, tokens: Token[]) {
    this.source = source;
    this.tokens = tokens;
  }

  static parse(source: string): VonValue {
    const tokens = Lexer.tokenize(source);
    const parser = new VonParser(source, tokens);
    const value = parser.parseValue();
    if (!parser.isAtEnd()) {
      throw parser.error("unexpected trailing input");
    }
    return value;
  }

  private parseValue(): VonValue {
    switch (this.peekKind()) {
      case "LBrace":
        return this.parseObject();
      case "LBracket":
        return this.parseArray();
      case "StringLiteral":
        return this.parseStringValue();
      case "IntegerLiteral":
        return this.parseNumberValue();
      case "Null":
        this.advance();
        return null;
      case "True":
        this.advance();
        return true;
      case "False":
        this.advance();
        return false;
      case "Identifier":
        return this.parseIdentifierText();
      case "Eof":
        throw this.error("unexpected end of input");
      default:
        throw this.error(`unexpected token ${this.peekKind()}`);
    }
  }

  private parseObject(): VonValue {
    this.expect("LBrace");
    const members: { [key: string]: VonValue } = {};
    for (;;) {
      if (this.check("RBrace")) {
        this.advance();
        break;
      }

      const key = this.parseKey();
      this.expect("Colon");
      members[key] = this.parseValue();

      if (this.consumeIf("Comma")) {
        continue;
      }
      if (this.check("RBrace")) {
        this.advance();
        break;
      }
      throw this.error("expected ',' or '}'");
    }
    return members;
  }

  private parseArray(): VonValue {
    this.expect("LBracket");
    const items: VonValue[] = [];
    for (;;) {
      if (this.check("RBracket")) {
        this.advance();
        break;
      }
      items.push(this.parseValue());
      if (this.consumeIf("Comma")) {
        continue;
      }
      if (this.check("RBracket")) {
        this.advance();
        break;
      }
      throw this.error("expected ',' or ']'");
    }
    return items;
  }

  private parseKey(): string {
    switch (this.peekKind()) {
      case "StringLiteral":
        return this.parseStringValue();
      case "Identifier":
        return this.parseIdentifierText();
      default:
        throw this.error("expected object key");
    }
  }

  private parseStringValue(): string {
    const token = this.advance();
    const raw = this.source.slice(token.start, token.end);
    if (!raw.startsWith('"') || !raw.endsWith('"')) {
      throw this.errorAt(token.start, "invalid string literal");
    }
    try {
      return decodeStringLiteral(raw.slice(1, -1));
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw this.errorAt(token.start, message);
    }
  }

  private parseNumberValue(): number {
    const token = this.advance();
    const text = this.source.slice(token.start, token.end);
    if (!/^-?\d+$/.test(text)) {
      throw this.errorAt(token.start, "invalid integer");
    }
    const number = Number(text);
    if (!Number.isSafeInteger(number)) {
      throw this.errorAt(token.start, "integer outside safe integer range");
    }
    return number;
  }

  private parseIdentifierText(): string {
    const token = this.advance();
    return this.source.slice(token.start, token.end);
  }

  private expect(kind: TokenKind): void {
    if (this.check(kind)) {
      this.advance();
      return;
    }
    throw this.error(`expected ${kind}`);
  }

  private consumeIf(kind: TokenKind): boolean {
    if (this.check(kind)) {
      this.advance();
      return true;
    }
    return false;
  }

  private check(kind: TokenKind): boolean {
    return this.peekKind() === kind;
  }

  private peekKind(): TokenKind {
    return this.tokens[this.index]?.kind ?? "Eof";
  }

  private advance(): Token {
    const token = this.tokens[this.index]!;
    if (!this.isAtEnd()) {
      this.index += 1;
    }
    return token;
  }

  private isAtEnd(): boolean {
    return this.peekKind() === "Eof";
  }

  private error(message: string): VonParseError {
    const position = this.tokens[this.index]?.start ?? this.source.length;
    return new VonParseError(position, message);
  }

  private errorAt(position: number, message: string): VonParseError {
    return new VonParseError(position, message);
  }
}

/** Parse VON text into a value. */
export function parse(source: string): VonValue {
  return VonParser.parse(source);
}
