export type TokenKind =
  | "LBrace"
  | "RBrace"
  | "LBracket"
  | "RBracket"
  | "Colon"
  | "Comma"
  | "StringLiteral"
  | "IntegerLiteral"
  | "Identifier"
  | "Null"
  | "True"
  | "False"
  | "LineComment"
  | "Whitespace"
  | "Eof";

export interface Token {
  kind: TokenKind;
  start: number;
  end: number;
}

export function isTrivia(kind: TokenKind): boolean {
  return kind === "LineComment" || kind === "Whitespace";
}
