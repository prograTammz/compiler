
import { Scanner } from './scanner';
import { TableElement } from './table-element';
import{Parser} from './parser';
import { MatTable } from '@angular/material/table';
import { Component, ViewChild } from '@angular/core';
import {
  Token
} from './token';
import { TreeNode, LeafType } from './treeNode';
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
  isParsed = false;
  currentTab = 0;
  errorCount: number = 0;
  errors: string[];
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
    console.log(parser.getRootNode());
    this.isParsed = true;
    this.currentTab = 1;
    if(!parser.getState()){
      this.errorCount = parser.getErrorCount();
      this.errors = parser.getError().split("\n");
      this.currentTab = 2;
    }else{
      setTimeout(() => {
        document.getElementById("tree").innerHTML= "";
        this.processTree(parser.getRootNode(),document.getElementById("tree"));
        
      }, 500);
      this.errorCount = parser.getErrorCount();
      this.errors = parser.getError().split("\n");
    }
  }
  processTree(node: TreeNode,element){
    var li = document.createElement('li');
  li.innerText = node.getName();
  element.appendChild(li);
  if (node.children.length) {
    var ul = document.createElement('ul');
    li.appendChild(ul);
    for (var i = 0; i < node.children.length; i++) {
      if (node.children[i].getType() == LeafType.Terminal && node.children[i].children.length == 0){
        continue;
      }
      this.processTree(node.children[i], ul);
    }
  }
  }
  constructList(nodes: TreeNode[]): HTMLElement{
    let list:HTMLElement = document.createElement("UL");
    for(let node of nodes){
        let textElm = document.createTextNode(node.getName());
        let listItem = document.createElement("LI");
        listItem.appendChild(textElm);
        list.appendChild(listItem);
    }
    return list;
  }
}


