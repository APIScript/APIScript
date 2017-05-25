
import {FileReader} from "./file";
import {PropertyType} from "../property/type/property-type";
import {ListPropertyType, SetPropertyType, MapPropertyType} from "../property/type/collection";
import {FloatPropertyType, IntegerPropertyType, BooleanPropertyType, StringPropertyType} from "../property/type/primitive";
import {EntityPropertyType, EnumPropertyType} from "../property/type/custom";
import {API} from "../api/api";
import {readClosure} from "./closure";

export function readPropertyType(reader: FileReader, api: API): PropertyType {
    let type: PropertyType;

    if (reader.isCharacter('{')) {
        type = readClosure(reader, api);
        reader.skipWhitespaceOnLine();

    } else if (reader.isCharacter('[')) {
        reader.next();
        type = new ListPropertyType(readPropertyType(reader, api));

        reader.assertCharacter(']');
        reader.skipWhitespaceOnLine();

    } else if (reader.isCharacter('<')) {

        reader.next();
        let firstType = readPropertyType(reader, api);

        if (reader.isCharacter('>')) {
            type = new SetPropertyType(firstType);

            reader.next();
            reader.skipWhitespaceOnLine();

        } else if (reader.isCharacter(',')) {
            reader.next();
            reader.skipWhitespaceOnLine();

            let secondType = readPropertyType(reader, api);
            type = new MapPropertyType(firstType, secondType);

            reader.assertCharacter('>');
            reader.skipWhitespaceOnLine();

        } else {
            reader.error(`Unexpected character "${reader.character()}", was expecting ">" or ","`);
        }

    } else {
        reader.skipWhitespaceOnLine();
        type = getWordType(reader.readWord(), api);
        reader.skipWhitespaceOnLine();
    }

    return type;
}

function getWordType(name: string, api: API): PropertyType {
    let result: PropertyType;

    api.forEachEnum((enumerator) => {
        if (enumerator.name === name) { result = new EnumPropertyType(name); }
    });

    api.forEachEntity((entity) => {
        if (entity.name === name) { result = new EntityPropertyType(name); }
    });

    if (name === 'integer') { result = new IntegerPropertyType(); }
    if (name === 'float') { result = new FloatPropertyType(); }
    if (name === 'boolean') { result = new BooleanPropertyType(); }
    if (name === 'string') { result = new StringPropertyType(); }

    if (result == null) { throw new Error(`Could not find type ${name}`); }
    return result;
}