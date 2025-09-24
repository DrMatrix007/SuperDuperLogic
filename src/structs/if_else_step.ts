import { generateID, Id, Step } from "./step"
import { StepDescriptor, StepDescriptorData } from "./step_descriptor";
import { StorableObject } from "./StorableObject";

export class IfElseStep extends StorableObject implements Step {
    private static Name = 'if else block'
    private static Description = 'a fucking if else. what did u expect?'

    _id: Id;
    private trueCase: StepDescriptorData | null;
    private falseCase: StepDescriptorData | null;
    constructor() {
        super(IfElseStep.Name, IfElseStep.Description);
        this._id = generateID();
        this.trueCase = null;
        this.falseCase = null;
    }

    id(): string {
        return this._id;
    }
    nextSteps(): StepDescriptor[] {
        return [
            { data: this.trueCase, description: "true", set: id => this.trueCase = id },
            { data: this.falseCase, description: "false", set: id => this.falseCase = id },
        ]
    }
}