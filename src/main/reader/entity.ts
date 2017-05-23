
import {FileReader} from "./file";
import {Entity, BasicEntity} from "../api/entity";
import {readProperty} from "./property";
import {API} from "../api/api";

export function readEntity(reader: FileReader, api: API): Entity {

    let closureIndex = reader.closureIndex;

    let entity: BasicEntity;
    let name = reader.readWord();

    reader.skipWhitespace();

    if (!reader.isCharacter('{')) {
        let instruction = reader.readWord();

        if (instruction === 'extends') {
            reader.skipWhitespace();
            entity = new BasicEntity(name, reader.readWord());

            reader.skipWhitespace();
            reader.assertCharacter('{');
            reader.skipWhitespace();
        } else {
            reader.error(`Invalid instruction "${instruction}" expected "{" or "extends"`);
        }
    } else {
        entity = new BasicEntity(name);
        reader.next();
        reader.skipWhitespace();
    }

    while (!reader.isCharacter('}') || closureIndex != reader.closureIndex) {
        entity.addProperty(readProperty(reader, api));
    }
    reader.next();

    return entity;
}