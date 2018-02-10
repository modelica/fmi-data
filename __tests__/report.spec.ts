import { createMatrixReport, MatrixReport } from "../src";
var tools = require("./sample_data/tools");
var xc_results = require("./sample_data/xc_results");

describe("Report related tests", () => {
    let report: MatrixReport;
    beforeEach(async () => {
        report = await createMatrixReport(tools, xc_results, {});
    });
    test("Create report", () => {
        expect(report).toBeDefined();
        expect(report).toMatchSnapshot();
    });
});
