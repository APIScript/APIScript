
import {PropertyType} from "./property-type";

export module PrimitivePropertyType {

    export class PrimitivePropertyType implements PropertyType {

        public constructor(private name: string) {}

        get isPrimitive() { return true; }
        get isCollection() { return false; }
        get isEntity() { return false; }

        get isInteger() { return false; }
        get isFloat() { return false; }
        get isBoolean() { return false; }
        get isString() { return false; }

        get isList() { return false; }
        get isSet() { return false; }
        get isMap() { return false; }

        toString() {
            return this.name;
        }
    }

    export class IntegerPropertyType extends PrimitivePropertyType { get isInteger() { return true; } }
    export class FloatPropertyType extends PrimitivePropertyType { get isFloat() { return true; } }
    export class BooleanPropertyType extends PrimitivePropertyType { get isBoolean() { return true; } }
    export class StringPropertyType extends PrimitivePropertyType { get isString() { return true; } }

    export const Integer = new IntegerPropertyType('Integer');
    export const Float = new FloatPropertyType('Float');
    export const Boolean = new BooleanPropertyType('Boolean');
    export const String = new StringPropertyType('String');
}