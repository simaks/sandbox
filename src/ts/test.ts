import {last} from './script/last';

describe("last", function () {
    it("Array input should return last element", function () {
        expect(last([1, 2, 3, 4])).toBe(4);
    });

    it("String input should return last symbol", function () {
        expect(last("xyz")).toBe("z");
    });

    it("Multi-argument input should return last element", function () {
        expect(last(1, 2, 3, 4)).toBe(4);
    });
});
