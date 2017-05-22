
import {PrimitivePropertyType} from "./primitive-type";
import {EntityPropertyType} from "./entity-type";

export interface PropertyType {

    readonly isPrimitive: boolean;
    readonly isCollection: boolean;
    readonly isEntity: boolean;
    readonly isInteger: boolean;
    readonly isFloat: boolean;
    readonly isBoolean: boolean;
    readonly isString: boolean;
    readonly isList: boolean;
    readonly isSet: boolean;
    readonly isMap: boolean;
}

export namespace PropertyType {

    export function getPropertyType(name: string): PropertyType {

        switch (name) {
            case 'integer': return PrimitivePropertyType.Integer;
            case 'float': return PrimitivePropertyType.Float;
            case 'boolean': return PrimitivePropertyType.Boolean;
            case 'string': return PrimitivePropertyType.String;

            default: return new EntityPropertyType(name);
        }
    }
}