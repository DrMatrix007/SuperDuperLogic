import { Step } from "./step";
import { StorableObject } from "./StorableObject";

export class Wrapper extends StorableObject {
    private root:Step;

    constructor(name:string,description:string,step:Step) {
        super(name,description,"wrapper"); 
        this.root = step
    }
    
    public deleteStep(){
        //here add the delete step 
    }
}