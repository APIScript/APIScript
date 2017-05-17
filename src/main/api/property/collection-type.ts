
import {PropertyType} from "./property-type";

export class CollectionType implements PropertyType {

    get isPrimitive() { return false; }
    get isCollection() { return true; }
    get isEntity() { return false; }

    get isInteger() { return false; }
    get isFloat() { return false; }
    get isBoolean() { return false; }
    get isString() { return false; }

    get isList() { return false; }
    get isSet() { return false; }
    get isMap() { return false; }
}