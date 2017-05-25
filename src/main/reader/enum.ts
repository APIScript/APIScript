
import {FileReader} from "./file";
import {Enum, BasicEnum} from "../api/enum";

export function readEnum(reader: FileReader): Enum {
    let enumValue = new BasicEnum(reader.readWord());

    reader.skipWhitespace();
    reader.assertCharacter('{');
    reader.skipWhitespace();

    while (!reader.isCharacter('}')) {
        enumValue.addValue(reader.readWord());

        if (reader.isCharacter(',')) { reader.next(); }
        reader.skipWhitespace();
    }

    reader.assertCharacter('}');
    reader.skipWhitespace();

    return enumValue;
}