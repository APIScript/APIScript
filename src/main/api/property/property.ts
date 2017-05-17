
import {PropertyType} from "./property-type";

export class Property {

    readonly name: string;
    readonly type: PropertyType;
    readonly constraints?: string;
    readonly isOptional?: boolean;
    readonly defaultValue?: string;

    public constructor(name: string, type: PropertyType, constraints?: string, isOptional?: boolean, defaultValue?: string) {
        this.name = name;
        this.type = type;

        if (constraints != null) { this.constraints = constraints; }
        if (isOptional) { this.isOptional = isOptional; }
        if (defaultValue != null) { this.defaultValue = defaultValue; }
    }
}