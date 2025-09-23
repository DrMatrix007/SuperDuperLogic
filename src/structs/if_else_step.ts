import { generateID, Id, Step } from "./step"
import { StepDescriptor } from "./step_descriptor";
import { StorableObject } from "./StorableObject";

export class IfElseStep extends StorableObject implements Step {
    private static Name = 'if else block'
    private static Description = 'a fucking if else. what did u expect?'

    _id: Id;

    constructor(private trueCase: Id | null, private falseCase: Id | null) {
        super(IfElseStep.Name, IfElseStep.Description);
        this._id = generateID();
    }

    id(): string {
        return this._id;
    }
    nextSteps(): StepDescriptor[] {
        return [
            { next: this.trueCase, description: "true", set: id => this.trueCase = id },
            { next: this.falseCase, description: "false", set: id => this.falseCase = id },
        ]
    }
}