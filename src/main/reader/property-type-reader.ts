
import {FileReader} from "./file-reader";
import {PropertyType} from "../api/property/property-type";
import {ListPropertyType} from "../api/property/list-type";
import {SetPropertyType} from "../api/property/set-type";
import {MapPropertyType} from "../api/property/map-type";
import * as Type from '../api/property/property-type';

export function readPropertyType(reader: FileReader): PropertyType {

    let type: PropertyType;

    if (reader.isCharacter('[')) {
        reader.next();
        type = new ListPropertyType(readPropertyType(reader));

        reader.assertCharacter(']');
        reader.skipWhitespaceOnLine();

    } else if (reader.isCharacter('<')) {

        reader.next();
        let firstType = readPropertyType(reader);

        if (reader.isCharacter('>')) {
            type = new SetPropertyType(firstType);

            reader.next();
            reader.skipWhitespaceOnLine();

        } else if (reader.isCharacter(',')) {
            reader.next();
            reader.skipWhitespaceOnLine();

            let secondType = readPropertyType(reader);
            type = new MapPropertyType(firstType, secondType);

            reader.assertCharacter('>');
            reader.skipWhitespaceOnLine();

        } else {
            reader.error(`Unexpected character "${reader.character()}", was expecting ">" or ","`);
        }

    } else {
        reader.skipWhitespaceOnLine();
        type = Type.getPropertyType(reader.readWord());
        reader.skipWhitespaceOnLine();
    }

    return type;
}