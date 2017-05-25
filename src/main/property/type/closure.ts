
import {CustomPropertyType} from "./custom";
import {CollectionPropertyType} from "./collection";
import {Property} from "../property";
import {PropertyType} from "./property-type";
import {PrimitivePropertyType} from "./primitive";

export interface ClosurePropertyType extends PropertyType {
    readonly propertyCount: number;
    forEachProperty(callback: (property: Property, index: number) => void);
}

export class BasicClosurePropertyType implements ClosurePropertyType {
    private properties: Property[] = [];

    readonly asPrimitive: PrimitivePropertyType = null;
    readonly asCustom: CustomPropertyType = null;
    readonly asCollection: CollectionPropertyType = null;
    readonly asClosure: ClosurePropertyType = this;

    public constructor() {}

    public addProperty(property: Property) {
        this.properties.push(property);
    }

    public get propertyCount() { return this.properties.length; }

    public forEachProperty(callback: (property: Property, index: number) => void) {
        this.properties.forEach((property, index) => { callback(property, index); });
    }
}