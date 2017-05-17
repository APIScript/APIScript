
import {Property} from "./property/property";

export interface Entity {
    readonly name: string;
    readonly inherits?: string;

    readonly propertyCount: number;
    forEachProperty(callback: (property: Property, index: number) => void);
}

export class BasicEntity implements Entity {

    private properties: Property[] = [];

    public constructor(readonly name: string, readonly inherits?: string) {}

    public addProperty(property: Property) {
        this.properties.push(property);
    }

    public get propertyCount() { return this.properties.length; }

    public forEachProperty(callback: (property: Property, index: number) => void) {
        this.properties.forEach((property, index) => { callback(property, index); });
    }
}