
import {FileReader} from "./file-reader";
import {RequestMethod} from "../api/request-method";
import {Group, BasicGroup} from "../api/group";

import {readProperty} from "./property-reader";
import {readEndpoint} from "./endpoint-reader";

export function readGroup(reader: FileReader, parent: Group): Group {

    let closureIndex = reader.closureIndex;
    let group = new BasicGroup(reader.readWord(), parent);

    reader.skipWhitespace();
    reader.assertCharacter('{');
    reader.skipWhitespace();

    while (!reader.isCharacter('}') || closureIndex != reader.closureIndex) {

        reader.skipWhitespace();
        let instruction = reader.readWord();
        reader.skipWhitespace();

        if (instruction === 'import') {
            let value = reader.readString();

            group.addImport(value);
            reader.include(value);

        } else if (instruction === 'inject') {
            group.addInject(readProperty(reader));
        } else if (instruction === 'get') {
            group.addEndpoint(readEndpoint(reader, group, RequestMethod.Get));
        } else if (instruction === 'post') {
            group.addEndpoint(readEndpoint(reader, group, RequestMethod.Post));
        } else if (instruction === 'put') {
            group.addEndpoint(readEndpoint(reader, group, RequestMethod.Put));
        } else if (instruction === 'delete') {
            group.addEndpoint(readEndpoint(reader, group, RequestMethod.Delete));
        } else if (instruction === 'group') {
            group.addGroup(readGroup(reader, group));
        } else {
            reader.error(`Invalid instruction "${instruction}"`);
        }

        reader.skipWhitespace();
    }

    reader.next();
    return group;
}