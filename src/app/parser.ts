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
        console.log("PROGRAN");

        if(this.tokenChecker(TokenType.var)){
            this.var();
        }

        if(this.tokenChecker(TokenType.Do)){
            this.incrementIndex();
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
        console.log("GO BACK");
    }
    private block(): void{
        console.log("BLOCK");
        if(this.tokenChecker(TokenType.begin)){
            this.incrementIndex();
        }else{
            this.addError(TokenType.begin);
        }
        if(this.tokenChecker(TokenType.var)){
            this.var();
        }
        this.stats();
        if(this.tokenChecker(TokenType.end)){
            this.incrementIndex();
        }else{
            this.addError(TokenType.end);
        }
        console.log("GO BACK");
    }
    private var(): void{
        console.log("VAR");
        if(this.type()){
            if(this.tokenChecker(TokenType.ID)){
                this.incrementIndex();
                this.mvars();
            }else{
                this.addError(TokenType.ID);
            }
            if(this.tokenChecker(TokenType.SemiColon)){
                this.incrementIndex();
            }else{
                this.addError(TokenType.SemiColon)
            }
        }
        console.log("GO BACK");
    }
    private type(): boolean{
        console.log("TYPE");
        if(this.tokenChecker(TokenType.var)){
            this.incrementIndex();
            console.log("GO BACK");
            return true;
        }
        
        return false;
        
    }
    private mvars(): void{
        console.log("MVARS");
        if(this.tokenChecker(TokenType.Colon)){
            this.incrementIndex();
            if(this.tokenChecker(TokenType.ID)){
                this.incrementIndex();
                this.mvars();
            }else{
                this.addError(TokenType.ID);
            }
        }
        console.log("GO BACK");
    }
    private expr():void{
        console.log("EXPR");
        this.t();
        if(this.tokenChecker(TokenType.Multiplication)){
            this.incrementIndex();
            this.expr();
        }else if(this.tokenChecker(TokenType.Division)){
            this.incrementIndex();
            this.expr();
        }
        console.log("GO BACK");
    }
    private t():void{
        console.log("T");
        this.f();
        if(this.tokenChecker(TokenType.Addition)){
            this.incrementIndex();
            this.t();
        }else if(this.tokenChecker(TokenType.Subtraction)){
            this.incrementIndex();
            this.t();
        }
        console.log("GO BACK");
    }
    private f():void{
        console.log("F");
        if(this.tokenChecker(TokenType.Subtraction)){
            this.incrementIndex();
            this.f();
        }else{
            this.r();
        }
        console.log("GO BACK");
    }
    private r():void{
        console.log("R");
        switch(this.currentToken().tokenType){
            case TokenType.OpenBrace:
                this.incrementIndex();
                this.expr();
                if(this.tokenChecker(TokenType.CloseBrace)){
                    this.incrementIndex();
                }else{
                    this.addError(TokenType.CloseBrace);
                    return;
                }
                break;
            case TokenType.ID:
                this.incrementIndex();
                break;
            case TokenType.Num:
                this.incrementIndex();
                break;
            default:
                this.addPossibleError(TokenType.ID,TokenType.Num);
            }
            console.log("GO BACK");
    }
    private stats():void{
        console.log("STATS");
        if(this.stat()){
            this.mstat();
        }
        console.log("GO BACK");
    }
    private mstat():void{
        console.log("MSTAT");
        if(this.stat()){
            this.mstat();
        }
        console.log("GO BACK");
    }
    private stat():boolean{
        console.log("STAT");
        switch(this.currentToken().tokenType){
            case TokenType.Read:
                this.in();
                console.log("GO BACK");
                return true;
            case TokenType.Print:
                this.out();
                console.log("GO BACK");
                return true;
            case TokenType.If:
                this.IF();
                console.log("GO BACK");
                return true;
            case TokenType.begin:
                this.block();
                console.log("GO BACK");
                return true;
            case TokenType.Repeat:
                this.loop();
                console.log("GO BACK");
                return true;
                
            case TokenType.ID:
                this.assign();
                console.log("GO BACK");
                return true;
            default:
                console.log("GO BACK");
                return false;
                
        }
        
    }
    private in():void{
        console.log("IN");
        if(this.tokenChecker(TokenType.Read)){
            this.incrementIndex();
        }else{
            this.addError(TokenType.Read);
        }

        if(this.tokenChecker(TokenType.ID)){
            this.incrementIndex();
        }else{
            this.addError(TokenType.ID);
        }

        if(this.tokenChecker(TokenType.SemiColon)){
            this.incrementIndex();
        }else{
            this.addError(TokenType.SemiColon);
        }
        console.log("GO BACK");
    }
    private out():void{
        console.log("OUT");
        if(this.tokenChecker(TokenType.Print)){
            this.incrementIndex();
        }else{
            this.addError(TokenType.Print);
        }

        this.expr();

        if(this.tokenChecker(TokenType.SemiColon)){
            this.incrementIndex();
        }else{
            this.addError(TokenType.SemiColon);
        }
        console.log("GO BACK");
    }
    private IF():void{
        console.log("IF");
        if(this.tokenChecker(TokenType.If)){
            this.incrementIndex();
        }else{
            this.addError(TokenType.If);
        }
        if(this.tokenChecker(TokenType.OpenSquareBrace)){
            this.incrementIndex();
        }else{
            this.addError(TokenType.OpenSquareBrace);
        }
        this.expr();
        this.ro();
        this.expr();
        if(this.tokenChecker(TokenType.CloseSquareBrace)){
            this.incrementIndex();
        }else{
            this.addError(TokenType.CloseSquareBrace);
        }
        this.block();
        console.log("GO BACK");
    }
    private loop():void{
        console.log("LOOP");
        if(this.tokenChecker(TokenType.Repeat)){
            this.incrementIndex();
        }else{
            this.addError(TokenType.Repeat);
        }

        if(this.tokenChecker(TokenType.OpenSquareBrace)){
            this.incrementIndex();
        }else{
            this.addError(TokenType.OpenSquareBrace);
        }
        this.expr();
        this.ro();
        this.expr();
        if(this.tokenChecker(TokenType.CloseSquareBrace)){
            this.incrementIndex();
        }else{
            this.addError(TokenType.CloseSquareBrace);
        }
        this.block();
        console.log("GO BACK");
    }
    private assign():void{
        console.log("ASSIGN");
        if(this.tokenChecker(TokenType.ID)){
            this.incrementIndex();
        }

        if(this.tokenChecker(TokenType.Assign)){
            this.incrementIndex();
        }

        this.expr();

        if(this.tokenChecker(TokenType.SemiColon)){
            this.incrementIndex();
        }
        console.log("GO BACK");
    }
    private ro():void{
        console.log("RO");
        //Less than and Equal
        switch(this.currentToken().tokenType){
            case TokenType.LessEqual:
                this.incrementIndex();
                break;
            case TokenType.GreatEqual:
                this.incrementIndex();
                break;
            case TokenType.Great:
                this.incrementIndex();
                break;
            case TokenType.Les:
                this.incrementIndex();
                break;
            case TokenType.NotEqual:
                this.incrementIndex();
                break;
            default:
                this.addPossibleError(TokenType.Les, TokenType.NotEqual);
        }
        console.log("GO BACK");
    }
    private incrementIndex():void{
        console.log(this.currentToken());
        this.currentIndex++;
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
        this.error += `ERROR: in line ${token.getLineNumber()}. ${expectedToken.toString()} Was expected found ${token.getType()} instead.\n`;
        this.parsingState = false;
    }
    private addPossibleError(expectedTokenOne: TokenType, expectedTokenTwo: TokenType):void{
        this.errorCount++;
        let token = this.currentToken();
        this.error += `ERROR: in line ${token.getLineNumber()}. ${expectedTokenOne} or ${expectedTokenTwo} Was expected found ${token.getType()} instead.\n`;
        this.parsingState = false;
    }
    public getError():string{
        return this.error;
    }
    public getState():boolean{
        return this.parsingState;
    }
}