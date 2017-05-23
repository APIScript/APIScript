
import {CustomPropertyType} from "./custom";
import {CollectionPropertyType} from "./collection";
import {Property} from "../property";
import {PropertyType} from "./property-type";
import {PrimitivePropertyType} from "./primitive";

export interface ClosurePropertyType extends PropertyType {
    readonly properties: Property[];
}

export class BasicClosurePropertyType implements ClosurePropertyType {
    readonly asPrimitive: PrimitivePropertyType = null;
    readonly asCustom: CustomPropertyType = null;
    readonly asCollection: CollectionPropertyType = null;
    readonly asClosure: ClosurePropertyType = this;

    public constructor(readonly properties: Property[]) {}
}