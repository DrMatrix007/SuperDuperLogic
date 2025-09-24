
export type Type = 'step' | 'wrapper' | 'error handler'
export class StorableObject {
    constructor(protected name: string, protected description: string, private type: Type, private code: string = 'yes code', private id: number = 0) {
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
    public get Code() {
        return this.code
    }
    public get Type() {
        return this.type
    }
    public get Id() {
        return this.id
    }
}