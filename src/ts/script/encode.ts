const alphabetUpper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export class EncodeRoot13 {
    position = 13;

    constructor(encodingPosition = 13) {
        this.position = encodingPosition;
    }

    translateCharacter(char) {
        let upperChar = char.toUpperCase();
        if (alphabetUpper.indexOf(upperChar) > -1) {
            let charPosition = alphabetUpper.indexOf(upperChar);
            return alphabetUpper[this.getEncodedIndex(charPosition)];
        } else {
            return char;
        }
    }

    getEncodedIndex(input) {
        let result = input + this.position;

        if (result >= alphabetUpper.length) {
            let diff = result - alphabetUpper.length;
            return diff;
        }

        return result;
    }


    encode(input: string) {
        if (input === '') {
            throw "Empty string is not allowed as an input.";
        }

        let result = '';

        for (let i = 0; i < input.length; i++) {
            result += this.translateCharacter(input[i]);
        }

        return result;
    }
}
