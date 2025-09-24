import { generateID, Id, Step } from "./step";
import { StepDescriptor } from "./step_descriptor";
import { StorableObject } from "./StorableObject";

export class PrimitiveStep extends StorableObject implements Step {
    private static Name = 'a primitve'
    private static Description = 'a single step'

    _id: Id;

    public constructor(private nextStep: Id | null) {
        super(PrimitiveStep.Name, PrimitiveStep.Description,'step');
        this._id = generateID();
        this.id();
    }


    nextSteps(): StepDescriptor[] {
        return [{ next: this.nextStep, description: "", set: id => this.nextStep = id }];
    }
    id(): Id {
        return this._id;
    }

}