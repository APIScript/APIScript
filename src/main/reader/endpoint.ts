
import {FileReader} from "./file";
import {Endpoint, BasicEndpoint} from "../api/endpoint";
import {RequestMethod} from "../api/request-method";
import {readProperty} from "./property";
import {readPropertyType} from "./property-type";
import {Group} from "../api/group";
import {PropertyType} from "../property/type/property-type";
import {API} from "../api/api";

export function readEndpoint(reader: FileReader, api: API, parent: Group, requestMethod: RequestMethod): Endpoint {

    let closureIndex = reader.closureIndex;
    let name = reader.readWord();

    let endpoint: BasicEndpoint;
    reader.skipWhitespace();

    let requestType: PropertyType;
    let returnType: PropertyType;

    if (reader.isCharacter('{')) {
        reader.next();
        reader.skipWhitespace();
    } else {

        while (!reader.isCharacter('{')) {
            let modifier = reader.readWord();

            if (modifier === 'requests') {
                if (requestType) { reader.error('Request has already been defined'); }
                reader.skipWhitespace();

                requestType = readPropertyType(reader, api);
                reader.skipWhitespace();

            } else if (modifier === 'returns') {
                if (returnType) { reader.error('Returns has already been defined'); }
                reader.skipWhitespace();

                returnType = readPropertyType(reader, api);
                reader.skipWhitespace();

            } else {
                reader.error(`Unrecognised modifier ${modifier}`);
            }
        }

        reader.assertCharacter('{');
        reader.skipWhitespace();
    }

    endpoint = new BasicEndpoint(name, parent, requestMethod, requestType, returnType);

    while (!reader.isCharacter('}') || closureIndex != reader.closureIndex) {
        endpoint.addProperty(readProperty(reader, api));
    }

    reader.assertCharacter('}');
    reader.skipWhitespace();

    return endpoint;
}