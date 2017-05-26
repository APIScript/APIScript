
import {API, BasicAPI} from "../api/api";
import {FileReader} from "./file";
import {RequestMethod} from "../api/request-method";

import {readEntity} from "./entity";
import {readProperty} from "./property";
import {readEnum} from "./enum";
import {readEndpoint} from "./endpoint";
import {readGroup} from "./group";

export function readAPI(file: string, debug = false): API {
    let reader = new FileReader(file, debug);
    let api: BasicAPI;

    reader.skipWhitespace();
    let documentation = reader.documentation;

    reader.assertString('api');
    reader.skipWhitespace();

    if (!reader.isCharacter('{')) {
        api = new BasicAPI(reader.readWord(), documentation);
        reader.skipWhitespace();
    } else {
        api = new BasicAPI('api', documentation);
    }

    reader.assertCharacter('{');

    while (!reader.isEnd() && !reader.isCharacter('}')) {

        reader.skipWhitespace();
        let instruction = reader.readWord();
        reader.skipWhitespace();

        if (instruction === 'entity') {
            api.addEntity(readEntity(reader, api));
        } else if (instruction === 'enum') {
            api.addEnum(readEnum(reader));
        } else if (instruction === 'import') {
            let value = reader.readPath();

            api.addImport(value);
            reader.include(value);

        } else if (instruction === 'inject') {
            api.addInject(readProperty(reader, api));
        } else if (instruction === 'get') {
            api.addEndpoint(readEndpoint(reader, api, api, RequestMethod.Get));
        } else if (instruction === 'post') {
            api.addEndpoint(readEndpoint(reader, api, api, RequestMethod.Post));
        } else if (instruction === 'put') {
            api.addEndpoint(readEndpoint(reader, api, api, RequestMethod.Put));
        } else if (instruction === 'delete') {
            api.addEndpoint(readEndpoint(reader, api, api, RequestMethod.Delete));
        } else if (instruction === 'group') {
            api.addGroup(readGroup(reader, api, api));
        } else {
            reader.error(`Invalid instruction "${instruction}"`);
        }

        reader.skipWhitespace();
    }

    return api;
}