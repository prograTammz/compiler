import {
    Token
  } from './token';
  import {
    TokenType
  } from './token-type.enum';

export class Parser {
    tokens: Token[];
    parsingState: boolean;
    error: string
    errorCount: number;
    currentIndex: number;
    constructor(tokens: Token[]){
        this.tokens = tokens;
        this.parsingState = true;
        this.error = "";
        this.errorCount = 0;
        this.currentIndex = 0;
        this.progran();
    }
    private progran(): void{
        console.log("a7a");
        switch(this.tokens[this.currentIndex].getType){
            case TokenType.var.toString:
                console.log("a7a");
        }
    }
    private block(): void{

    }
    private var(): void{

    }
    private type(): void{

    }
    private mvars(): void{

    }
    private expr():void{

    }
    private t():void{

    }
    private f():void{

    }
    private r():void{

    }
    private stats():void{

    }
    private mstat():void{

    }
    private stat():void{

    }
    private in():void{

    }
    private out():void{

    }
    private if():void{

    }
    private loop():void{

    }
    private assign():void{

    }
    private ro():void{

    }
    private addError(token: Token, expectedToken: TokenType):void{
        this.errorCount++;
        this.error += `ERROR: in line ${token.getLineNumber}. ${expectedToken.toString} Was expected found ${token.getType()} instead.\n`
    }
    public getError():string{
        return this.error;
    }
    public getState():boolean{
        return this.parsingState;
    }
}
