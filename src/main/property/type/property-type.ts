
import {PrimitivePropertyType} from "./primitive";
import {CustomPropertyType} from "./custom";
import {CollectionPropertyType} from "./collection";
import {ClosurePropertyType} from "./closure";

export interface PropertyType {
    readonly asPrimitive: PrimitivePropertyType;
    readonly asCustom: CustomPropertyType;
    readonly asCollection: CollectionPropertyType;
    readonly asClosure: ClosurePropertyType;
}