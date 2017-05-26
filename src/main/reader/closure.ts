
import {FileReader} from "./file";
import {BasicClosurePropertyType, ClosurePropertyType} from "../property/type/closure";
import {API} from "../api/api";
import {readProperty} from "./property";

export function readClosure(reader: FileReader, api: API): ClosurePropertyType {
    let closure = new BasicClosurePropertyType();

    reader.assertCharacter('{');
    reader.skipWhitespace();

    while (!reader.isCharacter('}')) {
        closure.addProperty(readProperty(reader, api));

        if (reader.isCharacter(',')) { reader.next(); }
        reader.skipWhitespace();
    }

    reader.assertCharacter('}');
    reader.skipWhitespaceOnLine();

    return closure;
}