import { createMatrixReport, MatrixReport } from "../src";
var tools = require("./sample_data/tools");
var xc_results = require("./sample_data/xc_results");

const knownExporters: { [key: string]: { expto: string[]; impby: string[] } } = {
    "20sim": { impby: ["FMPy", "COE", "dSPACE_VEOS"], expto: [] },
};

describe("Report related tests", () => {
    let report: MatrixReport;
    beforeEach(async () => {
        report = await createMatrixReport(tools, xc_results, {});
    });
    test("Create report", () => {
        expect(report).toBeDefined();
    });
    Object.keys(knownExporters).forEach(tool => {
        test("Ensure " + tool + " is marked as an exporter", () => {
            let impby = knownExporters[tool].impby;
            let expto = knownExporters[tool].expto;

            if (impby.length > 0) {
                let exportedTo = report.exportsTo.find(row => row.id === tool);
                expect(exportedTo).toBeDefined();
                console.log(JSON.stringify(exportedTo));
                if (exportedTo) {
                    let importers = exportedTo.columns.map(col => col.id);
                    expect(importers).toEqual(impby);
                }
            }

            if (expto.length > 0) {
                let importRows = report.importsFrom.find(row => row.id === tools);
                expect(importRows).toBeDefined();
                if (importRows) {
                    let exporters = importRows.columns.map(col => col.id);
                    expect(exporters).toEqual(knownExporters[tool].expto);
                }
            }
        });
    });
});
