class StorableObject {
    protected name : string;
    protected description: string;

    constructor(name:string,description:string) {
        this.name = name
        this.description = description
    }

    /**
     * Name
     */
    public get Name() {
        return this.name
    }

    /**
     * description
     */
    public get Description() {
        return this.description
    }
}