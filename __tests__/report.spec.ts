import { createMatrixReport } from "../src";
var tools = require("./sample_data/tools");
var xc_results = require("./sample_data/xc_results");

describe("Report related tests", () => {
    test("Create report", async () => {
        let report = await createMatrixReport(tools, xc_results, {});
        expect(report).toBeDefined();
    });
});
