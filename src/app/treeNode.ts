export enum LeafType{
    Terminal= "Terminal",
    NonTerminal = "Non-Terminal"
}
export class TreeNode {
    private id: number;
    private name: string;
    private type: LeafType;
    private parentId: number;
    constructor(id:number, name: string,type: LeafType, parentId: number = null){
        this.id = id;
        this.name = name;
        this.type = type;
        this.parentId = parentId;
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
    public getParentID():number{
        return this.parentId;
    }
    public setParentId(id: number):void{
        this.parentId =id;
        return;
    }
}
