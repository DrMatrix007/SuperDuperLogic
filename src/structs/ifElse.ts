class IfElse extends Step {
    private static Name = 'if else block'
    private static Description = 'a fucking if else. what did u expect?'
    private static TrueBranch = 0
    private static FalseBranch = 1
    constructor() {
        super(IfElse.Name,IfElse.Description)
    }

    
    public get TrueStep() : Step {
        return this.nextSteps[IfElse.TrueBranch]
    }
    
    public get FalseS
}