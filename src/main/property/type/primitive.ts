
import {PropertyType} from "./property-type";
import {CustomPropertyType} from "./custom";
import {CollectionPropertyType} from "./collection";
import {ClosurePropertyType} from "./closure";

export interface PrimitivePropertyType extends PropertyType {
    readonly asInteger: IntegerPropertyType;
    readonly asFloat: FloatPropertyType;
    readonly asBoolean: BooleanPropertyType;
    readonly asString: StringPropertyType;
}

export abstract class AbstractPrimitivePropertyType implements PrimitivePropertyType {
    readonly asInteger: IntegerPropertyType = null;
    readonly asFloat: FloatPropertyType = null;
    readonly asBoolean: BooleanPropertyType = null;
    readonly asString: StringPropertyType = null;

    readonly asPrimitive: PrimitivePropertyType = this;
    readonly asCustom: CustomPropertyType = null;
    readonly asCollection: CollectionPropertyType = null;
    readonly asClosure: ClosurePropertyType = null;
}

export class IntegerPropertyType extends AbstractPrimitivePropertyType {
    readonly asInteger: IntegerPropertyType = this;
}

export class FloatPropertyType extends AbstractPrimitivePropertyType {
    readonly asFloat: FloatPropertyType = this;
}

export class BooleanPropertyType extends AbstractPrimitivePropertyType {
    readonly asBoolean: BooleanPropertyType = this;
}

export class StringPropertyType extends AbstractPrimitivePropertyType {
    readonly asString: StringPropertyType = this;
}