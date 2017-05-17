
import {FileReader} from "./file-reader";
import {Entity, BasicEntity} from "../api/entity";
import {readProperty} from "./property-reader";

export function readEntity(reader: FileReader): Entity {

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
        entity.addProperty(readProperty(reader));
    }
    reader.next();

    return entity;
}