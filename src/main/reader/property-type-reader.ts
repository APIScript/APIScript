
import {FileReader} from "./file-reader";
import {PropertyType} from "../property/type/property-type";
import {ListPropertyType, SetPropertyType, MapPropertyType} from "../property/type/collection";
import {FloatPropertyType, IntegerPropertyType, BooleanPropertyType, StringPropertyType} from "../property/type/primitive";
import {EntityPropertyType} from "../property/type/custom";
import {readProperty} from "./property-reader";
import {Property} from "../property/property";
import {BasicClosurePropertyType} from "../property/type/closure";

export function readPropertyType(reader: FileReader): PropertyType {

    let type: PropertyType;

    if (reader.isCharacter('{')) {
        reader.next();
        reader.skipWhitespace();

        let properties: Property[] = [];

        while (!reader.isCharacter('}')) {
            properties.push(readProperty(reader));
            reader.skipWhitespace();
        }

        type = new BasicClosurePropertyType(properties);

        reader.next();
        reader.skipWhitespaceOnLine();

    } else if (reader.isCharacter('[')) {
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
        type = getWordType(reader.readWord());
        reader.skipWhitespaceOnLine();
    }

    return type;
}

function getWordType(name: string): PropertyType {
    // TODO DISTINGUISH BETWEEN ENTITY AND ENUM

    if (name === 'integer') { return new IntegerPropertyType(); }
    if (name === 'float') { return new FloatPropertyType(); }
    if (name === 'boolean') { return new BooleanPropertyType(); }
    if (name === 'string') { return new StringPropertyType(); }

    return new EntityPropertyType(name);
}