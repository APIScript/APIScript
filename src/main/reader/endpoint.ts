
import {FileReader} from "./file";
import {Endpoint, BasicEndpoint} from "../api/endpoint";
import {RequestMethod} from "../api/request-method";
import {readPropertyType} from "./property-type";
import {Group} from "../api/group";
import {API} from "../api/api";

export function readEndpoint(reader: FileReader, api: API, parent: Group, requestMethod: RequestMethod): Endpoint {
    let endpoint = new BasicEndpoint(reader.readWord(), parent, requestMethod);
    reader.skipWhitespace();

    while (!reader.isCharacter('\n')) {
        let modifier = reader.readWord();
        reader.skipWhitespaceOnLine();

        if (modifier === 'request') {
            if (endpoint.requestType) { reader.error('Request has already been defined'); }
            endpoint.requestType = readPropertyType(reader, api);

        } else if (modifier === 'body') {
            if (endpoint.bodyType) { reader.error('Body has already been defined'); }
            endpoint.bodyType = readPropertyType(reader, api);

        } else if (modifier === 'response') {
            if (endpoint.responseType) { reader.error('Response has already been defined'); }
            endpoint.responseType = readPropertyType(reader, api);
        } else {
            reader.error(`Unrecognised modifier ${modifier}`);
        }

        reader.skipWhitespaceOnLine();
    }

    reader.skipWhitespace();
    return endpoint;
}