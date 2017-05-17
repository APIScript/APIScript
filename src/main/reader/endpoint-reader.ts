
import {FileReader} from "./file-reader";
import {Endpoint, BasicEndpoint} from "../api/endpoint";
import {RequestMethod} from "../api/request-method";
import {readProperty} from "./property-reader";
import {readPropertyType} from "./property-type-reader";
import {Group} from "../api/group";

export function readEndpoint(reader: FileReader, parent: Group, requestMethod: RequestMethod): Endpoint {

    let closureIndex = reader.closureIndex;
    let name = reader.readString();

    let endpoint: BasicEndpoint;
    reader.skipWhitespace();

    if (reader.isCharacter('{')) {
        reader.next();
        reader.skipWhitespace();

        endpoint = new BasicEndpoint(name, parent, requestMethod);

    } else {

        reader.assertString('returns');
        reader.skipWhitespace();

        let returnType = readPropertyType(reader);
        reader.skipWhitespace();

        reader.assertCharacter('{');
        reader.skipWhitespace();

        endpoint = new BasicEndpoint(name, parent, requestMethod, returnType);
    }

    while (!reader.isCharacter('}') || closureIndex != reader.closureIndex) {
        endpoint.addProperty(readProperty(reader));
    }

    reader.assertCharacter('}');
    reader.skipWhitespace();

    return endpoint;
}