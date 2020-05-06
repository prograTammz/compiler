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

        if(this.tokenChecker(TokenType.var)){
            this.var();
        }else{
            this.addError(TokenType.var);
            return;
        }

        if(this.tokenChecker(TokenType.Do)){
            this.currentIndex++;
            this.block();
        }else{
            this.addError(TokenType.Do);
            return;
        }

        if(this.tokenChecker(TokenType.Return)){
            this.parsingState = true;
        }else{
            this.addError(TokenType.Return);
        }
    }
    private block(): void{

    }
    private var(): void{
        if(this.type()){
            if(this.tokenChecker(TokenType.ID)){
                this.currentIndex++;
                this.mvars();
            }else{
                this.addError(TokenType.ID);
            }
            if(this.tokenChecker(TokenType.SemiColon)){
                this.currentIndex++;
            }else{
                this.addError(TokenType.SemiColon)
            }
        }
    }
    private type(): boolean{
        if(this.tokenChecker(TokenType.var)){
            this.currentIndex ++;
            return true;
        }
        return false;
    }
    private mvars(): void{
        if(this.tokenChecker(TokenType.Colon)){
            this.currentIndex++;
            if(this.tokenChecker(TokenType.ID)){
                this.currentIndex++;
                this.mvars();
            }else{
                this.addError(TokenType.ID);
            }
        }
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
        if(this.stat()){
            this.mstat();
        }
    }
    private mstat():void{
        if(this.stat()){
            this.mstat();
        }
    }
    private stat():boolean{
        switch(this.currentToken().tokenType){
            case TokenType.Read:
                this.in();
                return true;
            case TokenType.Print:
                this.out();
                return true;
            case TokenType.If:
                this.IF();
                return true;
            case TokenType.begin:
                this.block();
                return true;
            case TokenType.Repeat:
                this.loop();
                return true;
            case TokenType.ID:
                this.assign();
                return true;
            default:
                return false;
        }
    }
    private in():void{
        if(this.tokenChecker(TokenType.Read)){
            this.currentIndex++;
        }else{
            this.addError(TokenType.Read);
        }

        if(this.tokenChecker(TokenType.ID)){
            this.currentIndex++;
        }else{
            this.addError(TokenType.ID);
        }

        if(this.tokenChecker(TokenType.SemiColon)){
            this.currentIndex++;
        }else{
            this.addError(TokenType.SemiColon);
        }
    }
    private out():void{

    }
    private IF():void{

    }
    private loop():void{

    }
    private assign():void{

    }
    private ro():void{

    }
    private tokenChecker(token: TokenType): boolean{
        return this.currentTokenString() == token.toString()

    }
    private currentTokenString():string{
        return this.tokens[this.currentIndex].getType()
    }
    private currentToken():Token{
        return this.tokens[this.currentIndex]
    }
    private addError(expectedToken: TokenType):void{
        this.errorCount++;
        let token = this.currentToken();
        this.error += `ERROR: in line ${token.getLineNumber}. ${expectedToken.toString} Was expected found ${token.getType()} instead.\n`;
        this.parsingState = false;
    }
    public getError():string{
        return this.error;
    }
    public getState():boolean{
        return this.parsingState;
    }
}
