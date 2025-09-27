export class StorableObject {
    protected _name : string;
    protected _description: string;

    constructor(name:string,description:string) {
        this._name = name
        this._description = description
    }

    /**
     * Name
     */
    public get name() {
        return this._name
    }

    /**
     * description
     */
    public get Description() {
        return this._description
    }
}