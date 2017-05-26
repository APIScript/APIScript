
import {FileReader} from "./file";
import {Entity, BasicEntity} from "../api/entity";
import {API} from "../api/api";
import {readClosure} from "./closure";

export function readEntity(reader: FileReader, api: API): Entity {
    let documentation = reader.documentation;

    let entity: BasicEntity;
    let name = reader.readWord();

    reader.skipWhitespace();

    if (!reader.isCharacter('{')) {
        let instruction = reader.readWord();

        if (instruction === 'extends') {
            reader.skipWhitespace();
            let inherits = reader.readWord();
            reader.skipWhitespace();

            entity = new BasicEntity(name, readClosure(reader, api), inherits, documentation);
            reader.skipWhitespace();
        } else {
            reader.error(`Invalid instruction "${instruction}" expected "{" or "extends"`);
        }
    } else {
        entity = new BasicEntity(name, readClosure(reader, api), null, documentation);
        reader.skipWhitespace();
    }

    return entity;
}