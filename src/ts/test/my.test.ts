import {HelloWorld} from '../script/HelloWorld';

describe("my suite", function () {
    it("should be true", function () {
        expect(true).toBe(true);
        // console.log('testas', new HelloWorld());
    })
});

describe("HelloWorld", () => {
    let world = new HelloWorld();

    it("should say hello", () => {
        expect(world.hello).toBe("Hello, world!");
    });
});

