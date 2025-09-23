import { StepDescriptor } from "./step_descriptor";

export type Id = string;

export function generateID(): Id {
    return "n" + Math.random().toString();
}

export interface Step {
    id(): Id;
    nextSteps(): StepDescriptor[];
}