
import {ClosurePropertyType} from "../property/type/closure";

export interface Entity {
    readonly name: string;
    readonly closure: ClosurePropertyType;
    readonly inherits?: string;
}

export class BasicEntity implements Entity {
    public constructor(readonly name: string, readonly closure: ClosurePropertyType, readonly inherits?: string) {}
}