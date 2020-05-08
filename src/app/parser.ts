import {
    Token
  } from './token';
  import {
    TokenType
  } from './token-type.enum';
import{TreeNode, LeafType}from './treeNode';
export class Parser {
    tokens: Token[];
    parsingState: boolean;
    error: string
    errorCount: number;
    currentIndex: number;
    parserTree: TreeNode[];
    nodeCounter: number;
    rootNode: TreeNode;
    constructor(tokens: Token[]){
        this.tokens = tokens;
        this.parsingState = true;
        this.error = "";
        this.errorCount = 0;
        this.currentIndex = 0;
        this.nodeCounter = 0;
        this.parserTree = [];
        this.progran();
    }
    private progran(): void{
        this.addNode("PROGRAN",LeafType.Terminal);
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
            if(this.tokens.length == this.currentIndex){
                this.parsingState = false;
            }
        }else{
            this.addError(TokenType.Return);
        }
        this.parserTree.pop();
    }
    private block(): void{
        this.addNode("BLOCK",LeafType.Terminal);
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
        this.parserTree.pop();
    }
    private var(): void{
        this.addNode("VAR",LeafType.Terminal);
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
        this.parserTree.pop();
    }
    private type(): boolean{
        this.addNode("TYPE",LeafType.Terminal);
        if(this.tokenChecker(TokenType.var)){
            this.incrementIndex();
            this.parserTree.pop();

            return true;
        }
        
        return false;
        
    }
    private mvars(): void{
        this.addNode("MVARS",LeafType.Terminal);
        if(this.tokenChecker(TokenType.Colon)){
            this.incrementIndex();
            if(this.tokenChecker(TokenType.ID)){
                this.incrementIndex();
                this.mvars();
            }else{
                this.addError(TokenType.ID);
            }
        }
        this.parserTree.pop();
    }
    private expr():void{
        this.addNode("EXPR",LeafType.Terminal);
        this.t();
        if(this.tokenChecker(TokenType.Multiplication)){
            this.incrementIndex();
            this.expr();
        }else if(this.tokenChecker(TokenType.Division)){
            this.incrementIndex();
            this.expr();
        }
        this.parserTree.pop();
    }
    private t():void{
        this.addNode("T",LeafType.Terminal);
        this.f();
        if(this.tokenChecker(TokenType.Addition)){
            this.incrementIndex();
            this.t();
        }else if(this.tokenChecker(TokenType.Subtraction)){
            this.incrementIndex();
            this.t();
        }
        this.parserTree.pop();
    }
    private f():void{
        this.addNode("F",LeafType.Terminal);
        if(this.tokenChecker(TokenType.Subtraction)){
            this.incrementIndex();
            this.f();
        }else{
            this.r();
        }
        this.parserTree.pop();
    }
    private r():void{
        this.addNode("R",LeafType.Terminal);
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
            this.parserTree.pop();

    }
    private stats():void{
        this.addNode("STATS",LeafType.Terminal);
        if(this.stat()){
            this.mstat();
        }
        this.parserTree.pop();
    }
    private mstat():void{
        this.addNode("MSTAT",LeafType.Terminal);
        if(this.stat()){
            this.mstat();
        }
        this.parserTree.pop();
    }
    private stat():boolean{
        this.addNode("STAT",LeafType.Terminal);
        switch(this.currentToken().tokenType){
            case TokenType.Read:
                this.in();
                this.parserTree.pop();
    
                return true;
            case TokenType.Print:
                this.out();
                this.parserTree.pop();
    
                return true;
            case TokenType.If:
                this.IF();
                this.parserTree.pop();
    
                return true;
            case TokenType.begin:
                this.block();
                this.parserTree.pop();
    
                return true;
            case TokenType.Repeat:
                this.loop();
                this.parserTree.pop();
    
                return true;
                
            case TokenType.ID:
                this.assign();
                this.parserTree.pop();
    
                return true;
            default:
                this.parserTree.pop();
    
                return false;
                
        }
        
    }
    private in():void{
        this.addNode("IN",LeafType.Terminal);
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
        this.parserTree.pop();
    }
    private out():void{
        this.addNode("OUT",LeafType.Terminal);
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
        this.parserTree.pop();
    }
    private IF():void{
        this.addNode("IF",LeafType.Terminal);
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
        this.parserTree.pop();
    }
    private loop():void{
        this.addNode("LOOP",LeafType.Terminal);
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
        this.parserTree.pop();
    }
    private assign():void{
        this.addNode("ASSIGN",LeafType.Terminal);
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
        this.parserTree.pop();
    }
    private ro():void{
        this.addNode("RO",LeafType.Terminal);
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
        this.parserTree.pop();
    }
    private incrementIndex():void{
        this.addNode(this.currentToken().getType(),LeafType.NonTerminal);
        this.currentIndex++;
    }
    private tokenChecker(token: TokenType): boolean{
        return this.currentTokenString() == token.toString()

    }
    private currentTokenString():string{
        if(this.tokens.length == this.currentIndex){
            this.addNoReturnError();
            return "Return";

        }
        return this.tokens[this.currentIndex].getType()
    }
    private currentToken():Token{
        return this.tokens[this.currentIndex]
    }
    private addNode(name:string,type: LeafType){
        let node: TreeNode;
        if(type == LeafType.NonTerminal){
            node = new TreeNode(this.nodeCounter, this.tokens[this.currentIndex].lex,type);
        }else{
            node = new TreeNode(this.nodeCounter, name,type);
        }
        if(this.parserTree.length == 0){
            this.rootNode = node;
        }else{
            this.parserTree[this.parserTree.length-1].children.push(node);
        }
        //node.setParent(this.parserTree[this.parserTree.length-1]);
        if(type == LeafType.Terminal){
            this.parserTree.push(node);
        }
        this.nodeCounter++;
    }
    private addError(expectedToken: TokenType):void{
        
        let token = this.currentToken();
        this.error += `ERROR: in line ${token.getLineNumber()}. ${expectedToken.toString()} Was expected found ${token.getType()} instead.\n`;
        this.parsingState = false;
    }
    private addNoReturnError():void{
        this.errorCount++;
        this.error += `ERROR: in line Return wasn't found at the end of the file !\n`;
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
    public getErrorCount():number{
        return this.errorCount;
    }
    public getState():boolean{
        return this.parsingState;
    }
    public getRootNode():TreeNode{
        return this.rootNode;
    }
}