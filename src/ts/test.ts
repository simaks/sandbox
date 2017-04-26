import {EncodeRoot13} from './script/encode';

//
// **************************
// ****** ROT-13-Kata *******
// **************************
//
// Create a class that encodes a text by the [ROT-13] algorithm.
//
// -	The ROT-13 encoding exchanges every character by the character 13 positions further back in the alphabet.
// -	If the value lies behind the end of the alphabet it is fetched from the beginning.
// -	Characters that are no letters are not encoded.
// - 	Lower case letters are translated to upper case.
// -	The offset (13 in this case) should be variable.
//
//     Example:
// Hello, World -> URYYB, JBEYQ
// An 'e' gets to an 'R' and a 'W' gets to a 'J'.
//
//
//

describe("last", function () {
    it('Should return new index', function () {
        let encoder = new EncodeRoot13();
        expect(encoder.getEncodedIndex(0)).toBe(13);
        expect(encoder.getEncodedIndex(5)).toBe(18);
        expect(encoder.getEncodedIndex(4)).toBe(17);
        expect(encoder.getEncodedIndex(20)).toBe(7);
    });

    it('should encode single letter', function () {
        let encoder = new EncodeRoot13();
        expect(encoder.translateCharacter("H")).toBe("U");
        expect(encoder.translateCharacter("e")).toBe("R");
        expect(encoder.translateCharacter(" ")).toBe(" ");
        expect(encoder.translateCharacter(",")).toBe(",");
    });

    it('should encode Hello, World', function () {
        let encoder = new EncodeRoot13();
        expect(encoder.encode("Hello, World")).toBe("URYYB, JBEYQ");
    });

    it('should not allow empty string', function () {
        let encoder = new EncodeRoot13();
        expect(() => encoder.encode('')).toThrow();
    });

    it('It should return the same string', function () {
        let encoder = new EncodeRoot13(0);
        expect(encoder.encode('Hello, World')).toBe('HELLO, WORLD');
    });
});
