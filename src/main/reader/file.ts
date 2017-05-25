
import * as shell from 'shelljs';
import * as path from 'path';
import * as fs from 'fs';

export class FileReader {

    private characterIndex = 0;
    private lineIndex = 0;

    private index = -1;
    private closureLevel = 0;
    private data: string;
    private isReadingString = false;

    public constructor(private file: string) {
        this.data = shell.cat(file).toString();
        this.next();
    }

    include(file: string) {

        let fileDir = path.dirname(this.file);

        if (fileDir !== ".") {
            file = fileDir + "/" + file;
        }

        let data = shell.cat(file + '.api').toString();

        this.data = `${this.data.substring(0, this.index + 1)}\n${data}
            \n${this.data.substring(this.index + 1, this.data.length)}`;
    }

    private step(assetNotEnd: boolean = true) {
        if (assetNotEnd) { this.assertNotEnd(); }
        this.index++;
        this.characterIndex++;

        if (this.isNewLine()) {
            this.lineIndex++;
            this.characterIndex = 1;
        }
    }

    next(): string {
        this.step();

        if (!this.isReadingString) {

            if (this.isCharacter('/')) {
                this.step();
                if (this.isCharacter('/')) {
                    this.readToCharacterOrEnd('\n');

                } else if (this.isCharacter('*')) {

                    let reading = true;
                    while (reading) {
                        this.readToCharacter('*');
                        this.step();

                        if (this.isCharacter('/')) {
                            reading = false;
                        }
                    }

                    this.step();

                } else {
                    this.error(`Unexpected character "${this.character()}", was expecting "/" or "*"`);
                }
            } else if (this.isCharacter('{')) {
                this.closureLevel++;
            } else if (this.isCharacter('}')) {
                this.closureLevel--;
            }
        }

        return this.character();
    }

    character(): string {
        return this.data.charAt(this.index);
    }

    lookBack() {
        return this.data.charAt(this.index - 1);
    }

    get closureIndex() {
        return this.closureLevel;
    }

    isNewLine(): boolean {
        return this.character() === '\n';
    }

    isEnd() {
        return this.index >= this.data.length;
    }

    isNumber(): boolean {
        return /[0-9]/.test(this.character());
    }

    isWordCharacter(): boolean {
        return /[-a-zA-Z_0-9]/.test(this.character());
    }

    isWhitespace(): boolean {
        let character = this.data.charAt(this.index);
        return character === ' ' || character === '\n' || character === '\r' || character === '\t';
    }

    isWhitespaceOnLine(): boolean {
        let character = this.data.charAt(this.index);
        return character === ' ' || character === '\r' || character === '\t';
    }

    isCharacter(character: string): boolean {
        return this.character() === character;
    }

    skipWhitespace() {
        while (!this.isEnd() && this.isWhitespace()) {
            this.next();
        }
    }

    skipWhitespaceOnLine() {
        while (!this.isEnd() && this.isWhitespaceOnLine()) {
            this.next();
        }
    }

    readWord(): string {
        if (this.isNumber()) { this.error('Word cannot begin with number character'); }
        if (!this.isWordCharacter()) { this.error(`Expecting word character found "${this.character()}"`); }

        let text = '';

        while (!this.isWhitespace() && this.isWordCharacter()) {
            text += this.character();
            this.next();
        }

        return text;
    }

    readToCharacter(character: string) {
        let text = '';

        while (!this.isCharacter(character)) {
            text += this.character();
            this.next();
        }

        return text;
    }

    readToCharacterOrEnd(character: string) {
        let text = '';

        while (!this.isCharacter(character) && !this.isEnd()) {
            text += this.character();
            this.next();
        }

        return text;
    }

    readToSpace() {
        let text = '';

        while (!this.isWhitespace()) {
            text += this.character();
            this.next();
        }

        return text;
    }

    readToMatch(pattern: RegExp) {
        let text = '';

        while (!pattern.test(this.character())) {
            text += this.character();
            this.next();
        }

        return text;
    }

    readToNoMatch(pattern: RegExp) {
        let text = '';

        while (pattern.test(this.character())) {
            text += this.character();
            this.next();
        }

        return text;
    }

    readString() {
        let text = '';
        let quote = this.character();

        if (quote !== '\'' && quote !== '"') {
            this.error(`Expecting string opening character, found "${quote}", expecting "\"" or "'"`);
        }

        this.isReadingString = true;

        this.next();
        text += this.readToCharacter(quote);
        this.next();

        this.isReadingString = false;
        return text;
    }

    assertNotEnd(): boolean {

        if (this.isEnd()) {
            this.error('Unexpected end of file');
        }

        return true;
    }

    assertCharacter(character: string): boolean {

        if (!this.isCharacter(character)) {
            this.error(`Unexpected character, found "${this.character()}" but expected "${character}"`);
            return false;
        }

        this.next();
    }

    assertString(string: string): boolean {
        let text = '';

        for (let i = 0; i < string.length; i++) {
            text += this.character();
            this.next();
        }

        if (text !== string) {
            this.error(`Unexpected string, found "${text}" but expected "${string}"`);
            return false;
        }

        this.next();
    }

    error(message?: string) {
        fs.writeFileSync('error-log.api', this.data);

        console.log(`Error reading script at line [${this.lineIndex}] character [${this.characterIndex}]`);
        if (message) { console.log(message); }
        process.exit(0);
    }
}