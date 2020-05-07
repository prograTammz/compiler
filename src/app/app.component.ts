
import { Scanner } from './scanner';
import { TableElement } from './table-element';
import{Parser} from './parser';
import { MatTable } from '@angular/material/table';
import { Component, ViewChild } from '@angular/core';
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
  isAnalyzed = false;
  anaylze(code: string): void{
    //splits the input into separate lines represented as an array of strings.
    let scanner = new Scanner(code);
    this.displayedColumns = ['number', 'tokenName', 'lineNumber', 'tokenType'];
    this.dataSource = scanner.getLexTable();
    this.isAnalyzed = true;
    let parser = new Parser(scanner.getTokenList());
    console.log(parser.getError());
    console.log(parser.getState());
  }
}


