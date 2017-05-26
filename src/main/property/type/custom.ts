
import {PropertyType} from "./property-type";
import {PrimitivePropertyType} from "./primitive";
import {CollectionPropertyType} from "./collection";
import {ClosurePropertyType} from "./closure";

export interface CustomPropertyType extends PropertyType {
    readonly type: string;

    readonly asEnum: EnumPropertyType;
    readonly asEntity: EntityPropertyType;
}

export abstract class AbstractCustomPropertyType implements CustomPropertyType {
    public constructor(readonly type: string) {}

    readonly asEnum: EnumPropertyType = null;
    readonly asEntity: EntityPropertyType = null;

    readonly asPrimitive: PrimitivePropertyType = null;
    readonly asCustom: CustomPropertyType = this;
    readonly asCollection: CollectionPropertyType = null;
    readonly asClosure: ClosurePropertyType = null;
}

export class EnumPropertyType extends AbstractCustomPropertyType {
    public constructor(type: string) { super(type); }
    readonly asEnum: EnumPropertyType = this;
}

export class EntityPropertyType extends AbstractCustomPropertyType {
    public constructor(type: string) { super(type); }
    readonly asEntity: EntityPropertyType = this;
}