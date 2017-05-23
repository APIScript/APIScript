
import {PropertyType} from "./type/property-type";

export class Property {
    readonly constraints?: string;
    readonly isOptional?: boolean;
    readonly defaultValue?: string;

    public constructor(readonly name: string, readonly type: PropertyType, constraints?: string, isOptional?: boolean, defaultValue?: string) {
        if (constraints != null) { this.constraints = constraints; }
        if (isOptional) { this.isOptional = isOptional; }
        if (defaultValue != null) { this.defaultValue = defaultValue; }
    }
}