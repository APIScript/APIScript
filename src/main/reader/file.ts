
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

    private docComment: string = null;
    private docLine: number = -1;

    public constructor(private file: string, private debug = false) {
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
            if (this.lineIndex != this.docLine) { this.docComment = null; }

            this.lineIndex++;
            this.characterIndex = 1;
        }
    }

    next(): string {
        this.step();

        if (!this.isReadingString) {

            if (this.isCharacter('/')) {
                if (this.peak() === '/') { this.readToCharacterOrEnd('\n'); }

            } else if (this.isCharacter('#')) {
                this.step();
                this.docLine = this.lineIndex;

                if (!this.docComment) {
                    this.docComment = '';
                } else {
                    this.docComment += ' ';
                }

                this.skipWhitespaceOnLine();
                this.docComment += this.readToNewLine();
                this.step();

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

    peak() {
        return this.data.charAt(this.index + 1);
    }

    get documentation() {
        return this.docComment;
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

    isPathCharacter(): boolean {
        return /[-a-zA-Z_0-9/]/.test(this.character());
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

    readPath(): string {
        if (!this.isPathCharacter()) { this.error(`Expecting path character found "${this.character()}"`); }

        let text = '';

        while (!this.isWhitespace() && this.isPathCharacter()) {
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

    readToSpace(): string {
        let text = '';

        while (!this.isWhitespace()) {
            text += this.character();
            this.next();
        }

        return text;
    }

    readToNewLine(): string {
        let text = '';

        while (!this.isCharacter('\r') && !this.isCharacter('\n')) {
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
        fs.writeFileSync('apiscript-error.log', this.data);

        console.log(`Error reading script at line [${this.lineIndex + 1}] character [${this.characterIndex + 1}]`);
        if (message) { console.log(message); }

        if (this.debug) {
            throw new Error();
        } else {
            process.exit(0);
        }
    }
}