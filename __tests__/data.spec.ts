var tools = require("./sample_data/tools");
var fmus = require("./sample_data/fmus");
var xc_results = require("./sample_data/xc_results");

describe("Test raw data", () => {
    test("Raw tool data", () => {
        expect(tools).toBeDefined();
        expect(Array.isArray(tools)).toBeTruthy();
        expect(tools).toMatchSnapshot();
    });
    test("Raw export data", () => {
        expect(fmus).toBeDefined();
        expect(Array.isArray(fmus)).toBeTruthy();
        expect(fmus).toMatchSnapshot();
    });
    test("Raw cross-check data", () => {
        expect(xc_results).toBeDefined();
        expect(Array.isArray(xc_results)).toBeTruthy();
        expect(xc_results).toMatchSnapshot();
    });
});
