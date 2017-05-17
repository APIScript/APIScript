
import {FileReader} from "./file-reader";
import {Property} from "../api/property/property";
import {PropertyType} from "../api/property/property-type";
import {readPropertyType} from "./property-type-reader";
import {PrimitivePropertyType} from "../api/property/primitive-type";

export function readProperty(reader: FileReader): Property {

    let name = reader.readWord();

    reader.skipWhitespaceOnLine();
    reader.assertCharacter(':');
    reader.skipWhitespaceOnLine();

    let type: PropertyType = readPropertyType(reader);

    let isOptional = false;
    let constraints: string = null;
    let defaultValue: string = null;

    while (!reader.isCharacter(';') && !reader.isCharacter('\n')) {

        if (reader.isCharacter('?')) {
            if (isOptional) {
                reader.error('Unexpected character "?", property has already been set as optional');
            }  else if (defaultValue != null) {
                reader.error('Property cannot be optional and have a default value');
            }

            reader.next();
            reader.skipWhitespaceOnLine();
            isOptional = true;

        } else if (reader.isCharacter('=')) {

            if (defaultValue != null) {
                reader.error('Unexpected character "=", property has already been set a default value');
            } else if (isOptional) {
                reader.error('Property cannot be optional and have a default value');
            }

            reader.next();
            reader.skipWhitespaceOnLine();

            if (!type.isPrimitive) {
                reader.error('A default type can only be set on a primitive property');
            }

            if (type === PrimitivePropertyType.String) {
                defaultValue = reader.readString();
            } else {
                defaultValue = reader.readToSpace();
            }

            reader.skipWhitespaceOnLine();

        } else if (reader.isCharacter('(')) {
            if (constraints != null) {
                reader.error('Unexpected character "(", constraints have already been set');
            }

            reader.next();
            constraints = reader.readToCharacter(')');
            reader.next();
            reader.skipWhitespaceOnLine();

        } else {
            reader.error(`Invalid character, found "${reader.character()}" was expecting "?", "(", ";", or "\\n"`);
        }

    }

    reader.next();
    reader.skipWhitespace();

    return new Property(name, type, constraints, isOptional, defaultValue);
}