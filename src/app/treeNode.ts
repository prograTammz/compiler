export enum LeafType{
    Terminal= "Terminal",
    NonTerminal = "Non-Terminal"
}
export class TreeNode {
    private id: number;
    private name: string;
    private type: LeafType;
    //private parentNode: TreeNode;
    public children: TreeNode[];
    constructor(id:number, name: string,type: LeafType){
        this.id = id;
        this.name = name;
        this.type = type;
        this.children =[];
        //this.parentNode = null;
    }

    public getName(): string{
        return this.name;
    }
    public getID(): number{
        return this.id;
    }
    public getType(): LeafType{
        return this.type;
    }
    // public getParent():TreeNode{
    //     return this.parentNode;
    // }
    // public setParent(node: TreeNode):void{
    //     this.parentNode = node;
    //     return;
    // }
}
