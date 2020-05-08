
import { Scanner } from './scanner';
import { TableElement } from './table-element';
import{Parser} from './parser';
import { MatTable } from '@angular/material/table';
import { Component, ViewChild } from '@angular/core';
import {
  Token
} from './token';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild(MatTable,{static:true}) table: MatTable<any>;
  title = 'compiler';
  lineArray = [];
  dataSource: TableElement[];
  displayedColumns: string[];
  tokenList: Token[];
  isAnalyzed = false;
  anaylze(code: string): void{
    //splits the input into separate lines represented as an array of strings.
    let scanner = new Scanner(code);
    this.displayedColumns = ['number', 'tokenName', 'lineNumber', 'tokenType'];
    this.dataSource = scanner.getLexTable();
    this.isAnalyzed = true;
    this.tokenList = scanner.getTokenList();
    
  }
  parse(){
    let parser = new Parser(this.tokenList);
    console.log(parser.getError());
    console.log(parser.getState());
    console.log(parser.getParserTree());
    parser.createMapping();
  }

}


