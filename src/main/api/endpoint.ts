
import {RequestMethod} from "./request-method";
import {Property} from "../property/property";
import {PropertyType} from "../property/type/property-type";
import {Group} from "./group";

export interface Endpoint {
    readonly name: string;
    readonly parent: Group;
    readonly requestMethod: RequestMethod;
    readonly requestType?: PropertyType;
    readonly returnType?: PropertyType;
    readonly url: string;

    readonly propertyCount: number;
    forEachProperty(callback: (property: Property, index: number) => void);
}

export class BasicEndpoint implements Endpoint {

    private properties: Property[] = [];

    public constructor(readonly name: string, readonly parent: Group,
                       readonly requestMethod: RequestMethod,
                       readonly requestType?: PropertyType,
                       readonly returnType?: PropertyType) {}

    public get url() {
        let url = this.name;
        let parent = this.parent;

        while (parent != null) {
            url = `${parent.name}/${url}`;
            parent = parent.parent;
        }

        return url;
    }

    public addProperty(property: Property) {
        this.properties.push(property);
    }

    public get propertyCount() { return this.properties.length; }

    public forEachProperty(callback: (property: Property, index: number) => void) {
        this.properties.forEach((property, index) => { callback(property, index); });
    }
}