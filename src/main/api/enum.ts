
export interface Enum {
    readonly name: string;

    readonly valueCount: number;
    forEachValue(callback: (value: string, index: number) => void);
}

export class BasicEnum implements Enum {

    private values: string[] = [];

    public constructor(readonly name: string) {}

    public addValue(value: string) {
        this.values.push(value);
    }

    public get valueCount() { return this.values.length; }

    public forEachValue(callback: (value: string, index: number) => void) {
        this.values.forEach((value, index) => { callback(value, index); });
    }
}