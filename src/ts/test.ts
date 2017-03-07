import 'js-polyfills';

import {HelloWorld} from './script/HelloWorld';
// let describe = describe || {};
// let it = it || {};
// let expect = expect || {};

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
