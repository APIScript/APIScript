
import {CollectionType} from "./collection-type";
import {PropertyType} from "./property-type";

export class SetPropertyType extends CollectionType {

    public constructor(readonly type: PropertyType) { super(); }

    get isSet() { return true; }

    toString() {
        return `<${this.type.toString()}>`;
    }
}