import { TokenType } from './token-type.enum';


export class Token {
    lex: string;
    tokenName: string;
    tokenType: TokenType;
    lineNumber: number;
    tokenNumber: number= 0;

    constructor(lex: string, name: string, type: TokenType, line: number, number: number){
        this.lex = lex;
        this.tokenName = name;
        this.tokenType = type;
        this.lineNumber = line;
        this.tokenNumber = number;
    }

    public getType(): string{
        return this.tokenType.toString();
    }

    public getLineNumber(): string{
        return this.lineNumber.toString();
    }
    public increment():number{
        this.tokenNumber++;
        return this.tokenNumber
    }


}
