import { Id } from "./step";

export interface StepDescriptor {
    next: Id | null;
    description: string;
    set: (id: Id | null) => void;
}