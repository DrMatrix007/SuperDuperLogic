import { ErrorHandler } from "./ErrorHandler"
import { Step } from "./step"
import { Wrapper } from "./wrapper"

class ComplexWrapper extends Wrapper {
    private errorHandler: ErrorHandler
    constructor(name: string, description: string, step: Step, errorHandler: ErrorHandler) {
        super(name, description, step)
        this.errorHandler = errorHandler
    }
}