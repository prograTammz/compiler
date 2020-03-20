import { TokenType } from '@angular/compiler/src/ml_parser/lexer';

export interface TableElement {
    number: number,
    tokenName: string,
    lineNumber: number,
    tokenType: string
}
