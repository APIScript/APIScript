
import {PropertyType} from "./property-type";

export class EntityPropertyType implements PropertyType {

    public constructor(readonly type: string) {}

    get isEntity() { return true; }
    get isPrimitive() { return false; }
    get isCollection() { return false; }

    get isInteger() { return false; }
    get isFloat() { return false; }
    get isBoolean() { return false; }
    get isString() { return false; }

    get isList() { return false; }
    get isSet() { return false; }
    get isMap() { return false; }

    toString() {
        return `${this.type}`;
    }
}