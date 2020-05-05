import {
  Token
} from './token';
import {
  TokenType
} from './token-type.enum';
import {
  TableElement
} from './table-element';

export class Scanner {
  line: number;
  tokenNumber: number;
  tableValues: TableElement[];
  lines: string[];


  constructor(code: string) {
    this.line = 1;
    this.tokenNumber = 1;
    this.lines = code.split('\n');
    this.tableValues = [];
    this.scan();
  }


  private checkKeyword(str: string): Token {
    if(str[str.length-1] === " "){
        	
        str = str.substring(0, str.length - 1);

    }

    switch (str) {
        
      case "var":
        return new Token(str, "Reserved word", TokenType.var, this.line, this.tokenNumber++);

      case "do":
        return new Token(str, "Reserved word", TokenType.Do, this.line, this.tokenNumber++);
      case "begin":
        return new Token(str, "Reserved word", TokenType.begin, this.line, this.tokenNumber++);
      case "end":
        return new Token(str, "Reserved word", TokenType.end, this.line, this.tokenNumber++);
      case "read":
        return new Token(str, "Reserved word", TokenType.Read, this.line, this.tokenNumber++);
      case "repeat":
        return new Token(str, "Reserved word", TokenType.Repeat, this.line, this.tokenNumber++);
      case "print":
        return new Token(str, "Reserved word", TokenType.Print, this.line, this.tokenNumber++);
      case "if":
        return new Token(str, "Reserved word", TokenType.If, this.line, this.tokenNumber++);
      case "return":
        return new Token(str, "Reserved word", TokenType.Return, this.line, this.tokenNumber++);
      default:
        return new Token(str, "ID", TokenType.ID, this.line, this.tokenNumber++);
    }
  }

  private checkToken(line: any) {
    let token: Token;
    for (let index = 0; index < line.length; index++) {
      //skip the checking if it's a white space
      if (line[index] === ' ') {
        continue;
      } else if (line[index] == ';') {
        token =  new Token(';', "Symbol", TokenType.SemiColon, this.line, this.tokenNumber++);
      } else if (line[index] == ':') {
        token = new Token(':', "Symbol", TokenType.Colon, this.line, this.tokenNumber++);
      } else if (line[index] == '[') {
        token = new Token('[', "Open Squared Brace", TokenType.OpenSquareBrace, this.line, this.tokenNumber++);
      } else if (line[index] == ']') {
        token = new Token(']', "Closed Square Brace", TokenType.CloseSquareBrace, this.line, this.tokenNumber++);
      } else if (line[index] == '(') {
        token = new Token('(', "OpenBrace", TokenType.OpenBrace, this.line, this.tokenNumber++);
      } else if (line[index] == ')') {
        token = new Token(')', "CloseBrace", TokenType.CloseBrace, this.line, this.tokenNumber++);
      } else if (line[index] == '+') {
        token = new Token('+', "Addition", TokenType.Addition, this.line, this.tokenNumber++);
      } else if (line[index] == '*') {
        token = new Token('*', "Multiplication", TokenType.Multiplication, this.line, this.tokenNumber++);
      } else if (line[index] == '-') {
        token = new Token('-', "Subtraction", TokenType.Subtraction, this.line, this.tokenNumber++);
      } else if (line[index] == '/') {
        token = new Token('/', "Division", TokenType.Division, this.line, this.tokenNumber++);
      } else if (line[index] == '>') {
        token = new Token('>', "Greater than", TokenType.Great, this.line, this.tokenNumber++);
      } else if (line[index] == '<') {
        token = new Token('<', "Less than", TokenType.Les, this.line, this.tokenNumber++);
      } else if (!isNaN(line[index]) && line[index] != " "){

          let tempDigit: string = line[index].toString();
          while(index+1 <= line.length-1){
              if(!isNaN(line[index+1]) && line[index] != " "){
                  tempDigit= line[index];
                  index++;
              }else{
                  break;
              }
          }
        token =  new Token(tempDigit, "Number", TokenType.Num, this.line, this.tokenNumber++);
      }else if(line[index] == '='&& index+1 <= line.length-1)
      {
          switch(line[index+1])
          {
              case '=':
                  token = new Token("==", "Is Equal", TokenType.Equal, this.line, this.tokenNumber++);
                  index++;
                  break;
              case '<':
                    token = new Token("=<", "Less Or Equal", TokenType.LessEqual, this.line, this.tokenNumber++);
                    index++;
                    break;
              case '>':
                    token = new Token("=>", "Greater Or Equal", TokenType.GreatEqual, this.line, this.tokenNumber++);
                    index++;
                    break;
              case '!':
                  if(index+1 <= line.length-1)
                  {
                      if(line[index] == '=')
                      { 
                        token = new Token("=!=", "Not Equal", TokenType.NotEqual, this.line, this.tokenNumber++);
                        index+= 2
                      }
                      else{
                        token = new Token(line[index-2].toString()+line[index-1].toString()+line[index].toString(),"Error", TokenType.Other, this.line, this.tokenNumber++);
                        index+= 2
                      }
                       
                  }
                  break;
              default:
                  token = new Token("=", "Assign", TokenType.Assign, this.line, this.tokenNumber++);
          }
      }else if(this.isLetter(line[index])){
          let temp: string = line[index].toString();
          console.log(temp);
          while (index+1<=line.length-1 ) 
          {
              if((!isNaN(line[index+1]) || this.isLetter(line[index+1])) || line[index+1] =="_" && line[index] != " "){
                temp += line[index+1];
                index++;
              }
                  
              else{
                break;
              }
                 
          }
          token = this.checkKeyword(temp);
      }
      else{
          token = new Token(line[index]+"" , "LexicalError", TokenType.Other, this.line, this.tokenNumber++);
        }
        let tableValue: TableElement = {number: token.tokenNumber, tokenName: token.lex, lineNumber: token.lineNumber, tokenType: token.tokenName}
        this.tableValues.push(tableValue);
    }
    
  }
  isLetter(char: string) {
    return char.toLowerCase() != char.toUpperCase();
  }

  scan(){
    for (const line of this.lines) {
        this.checkToken(line);
        this.line++;
    }
  }

  getLexTable():TableElement[]{
      
      return this.tableValues;
  }
}
