import { Side } from "./side";
import { generateID, Id, Step } from "./step";
import { StepDescriptor, StepDescriptorData } from "./step_descriptor";
import { StorableObject } from "./StorableObject";

export class PrimitiveStep extends StorableObject implements Step {
    private static Name = 'a primitve'
    private static Description = 'a single step'

    _id: Id;
    private nextStep: StepDescriptorData | null;
    public constructor(next:StepDescriptorData | null = null) {
        super(PrimitiveStep.Name, PrimitiveStep.Description);
        this._id = generateID();
        this.nextStep = next;
    }


    nextSteps(): StepDescriptor[] {
        return [{ data: this.nextStep, description: "", set: data => this.nextStep = data }];
    }
    id(): Id {
        return this._id;
    }

}