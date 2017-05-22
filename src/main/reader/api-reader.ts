
import {API, BasicAPI} from "../api/api";
import {FileReader} from "./file-reader";
import {RequestMethod} from "../api/request-method";

import {readEntity} from "./entity-reader";
import {readProperty} from "./property-reader";
import {readEnum} from "./enum-reader";
import {readEndpoint} from "./endpoint-reader";
import {readGroup} from "./group-reader";

export function readAPI(file: string): API {

    let reader = new FileReader(file);
    let closureIndex = reader.closureIndex;

    let api: BasicAPI;

    reader.skipWhitespace();
    reader.assertString('api');
    reader.skipWhitespace();

    if (!reader.isCharacter('{')) {
        api = new BasicAPI(reader.readWord());
        reader.skipWhitespace();
    } else {
        api = new BasicAPI('api');
    }

    reader.assertCharacter('{');

    while (!reader.isEnd() && (!reader.isCharacter('}') || closureIndex != reader.closureIndex)) {

        reader.skipWhitespace();
        let instruction = reader.readWord();
        reader.skipWhitespace();

        if (instruction === 'entity') {
            api.addEntity(readEntity(reader));
        } else if (instruction === 'enum') {
            api.addEnum(readEnum(reader));
        } else if (instruction === 'import') {
            let value = reader.readString();

            api.addImport(value);
            reader.include(value);

        } else if (instruction === 'inject') {
            api.addInject(readProperty(reader));
        } else if (instruction === 'get') {
            api.addEndpoint(readEndpoint(reader, api, RequestMethod.Get));
        } else if (instruction === 'post') {
            api.addEndpoint(readEndpoint(reader, api, RequestMethod.Post));
        } else if (instruction === 'put') {
            api.addEndpoint(readEndpoint(reader, api, RequestMethod.Put));
        } else if (instruction === 'delete') {
            api.addEndpoint(readEndpoint(reader, api, RequestMethod.Delete));
        } else if (instruction === 'group') {
            api.addGroup(readGroup(reader, api));
        } else {
            reader.error(`Invalid instruction "${instruction}"`);
        }

        reader.skipWhitespace();
    }

    return api;
}