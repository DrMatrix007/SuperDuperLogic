import { Side } from "./side";
import { Id } from "./step";

export interface StepDescriptor {
    data: StepDescriptorData | null,
    description: string;
    set: (id: StepDescriptorData | null) => void;
}

export interface StepDescriptorData {
    next_id: Id,
}