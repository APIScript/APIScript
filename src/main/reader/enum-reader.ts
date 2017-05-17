
import {FileReader} from "./file-reader";
import {Enum, BasicEnum} from "../api/enum";

export function readEnum(reader: FileReader): Enum {

    let closureIndex = reader.closureIndex;
    let enumValue = new BasicEnum(reader.readWord());

    reader.skipWhitespace();
    reader.assertCharacter('{');
    reader.skipWhitespace();

    while (!reader.isCharacter('}') || closureIndex != reader.closureIndex) {
        enumValue.addValue(reader.readWord());
        reader.skipWhitespace();
    }

    reader.assertCharacter('}');
    reader.skipWhitespace();

    return enumValue;
}