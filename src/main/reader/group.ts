
import {FileReader} from "./file";
import {RequestMethod} from "../api/request-method";
import {Group, BasicGroup} from "../api/group";

import {readProperty} from "./property";
import {readEndpoint} from "./endpoint";
import {API} from "../api/api";

export function readGroup(reader: FileReader, api: API, parent: Group): Group {
    let documentation = reader.documentation;
    let group = new BasicGroup(reader.readWord(), parent, documentation);

    reader.skipWhitespace();
    reader.assertCharacter('{');
    reader.skipWhitespace();

    while (!reader.isCharacter('}')) {

        reader.skipWhitespace();
        let instruction = reader.readWord();
        reader.skipWhitespace();

        if (instruction === 'import') {
            let value = reader.readString();

            group.addImport(value);
            reader.include(value);

        } else if (instruction === 'inject') {
            group.addInject(readProperty(reader, api));
        } else if (instruction === 'get') {
            group.addEndpoint(readEndpoint(reader, api, group, RequestMethod.Get));
        } else if (instruction === 'post') {
            group.addEndpoint(readEndpoint(reader, api, group, RequestMethod.Post));
        } else if (instruction === 'put') {
            group.addEndpoint(readEndpoint(reader, api, group, RequestMethod.Put));
        } else if (instruction === 'delete') {
            group.addEndpoint(readEndpoint(reader, api, group, RequestMethod.Delete));
        } else if (instruction === 'group') {
            group.addGroup(readGroup(reader, api, group));
        } else {
            reader.error(`Invalid instruction "${instruction}"`);
        }

        reader.skipWhitespace();
    }

    reader.next();
    return group;
}