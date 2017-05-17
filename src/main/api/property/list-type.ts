
import {CollectionType} from "./collection-type";
import {PropertyType} from "./property-type";

export class ListPropertyType extends CollectionType {

    public constructor(readonly type: PropertyType) { super(); }

    get isList() { return true; }

    toString() {
        return `[${this.type.toString()}]`;
    }
}