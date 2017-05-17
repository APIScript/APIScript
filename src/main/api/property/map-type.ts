
import {CollectionType} from "./collection-type";
import {PropertyType} from "./property-type";

export class MapPropertyType extends CollectionType {

    public constructor(readonly keyType: PropertyType, readonly valueType: PropertyType) { super(); }

    get isMap() { return true; }

    toString() {
        return `<${this.keyType.toString()}, ${this.valueType.toString()}>`;
    }
}