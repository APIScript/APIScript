
import {PropertyType} from "./property-type";
import {PrimitivePropertyType} from "./primitive";
import {CustomPropertyType} from "./custom";
import {ClosurePropertyType} from "./closure";

export interface CollectionPropertyType extends PropertyType {
    readonly asList: ListPropertyType;
    readonly asSet: SetPropertyType;
    readonly asMap: MapPropertyType;
}

export abstract class AbstractCollectionPropertyType implements CollectionPropertyType {
    readonly asList: ListPropertyType = null;
    readonly asSet: SetPropertyType = null;
    readonly asMap: MapPropertyType = null;

    readonly asPrimitive: PrimitivePropertyType = null;
    readonly asCustom: CustomPropertyType = null;
    readonly asCollection: CollectionPropertyType = this;
    readonly asClosure: ClosurePropertyType = null;
}

export class ListPropertyType extends AbstractCollectionPropertyType {
    public constructor(readonly type: PropertyType) { super(); }
    readonly asList: ListPropertyType = this;
}

export class SetPropertyType extends AbstractCollectionPropertyType {
    public constructor(readonly type: PropertyType) { super(); }
    readonly asSet: SetPropertyType = this;
}

export class MapPropertyType extends AbstractCollectionPropertyType {
    public constructor(readonly keyType: PropertyType, readonly valueType: PropertyType) { super(); }
    readonly asMap: MapPropertyType = this;
}