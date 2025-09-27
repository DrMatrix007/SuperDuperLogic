import { StepDescriptor } from "./step_descriptor";
import { StorableObject } from "./StorableObject";

export type Id = string;

export function generateID(): Id {
    return "n" + Math.random().toString();
}

export interface Step extends StorableObject {
    id(): Id;
    nextSteps(): StepDescriptor[];
}