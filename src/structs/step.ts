class Step extends StorableObject {
    private id: number;
    private static currentId : number = 1;
    
    constructor(name:string,description:string,branchCount:number = 1) {
        super(name,description);
        this.id = Step.currentId++;
        this.branchCount = branchCount
        this.nextSteps = []
    }

    /**
     * Id
     */
    public Id() {
        return this.id
    }
    
    public get BranchCount() : number {
        return this.branchCount
    }
    
    public NextSteps(){
        return this.nextSteps.map((step,branch)=>{return{step,branch}})
    }

    public addStep(step:Step){
        this.nextSteps.push(step)
    }

    public replaceStep(step:Step,branch:number){
        this.nextSteps[branch] = step
    }
}