import { createMatrixReport, MatrixReport, Status } from "../src";
var tools = require("./sample_data/tools");
var xc_results = require("./sample_data/xc_results");

const knownExporters: { [key: string]: { expby: string[]; impby: string[] } } = {
    "20sim": { impby: ["FMPy", "COE", "dSPACE_VEOS"], expby: [] },
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
            let expby = knownExporters[tool].expby;

            if (impby.length > 0) {
                let exportRows = report.exporters.find(row => row.id === tool);
                expect(exportRows).toBeDefined();
                console.log(JSON.stringify(exportRows));
                if (exportRows) {
                    expect(exportRows.best).toEqual(Status.CrossChecked);
                    let importers = exportRows.columns.map(col => col.id);
                    expect(importers).toEqual(impby);
                }

                if (expby.length > 0) {
                    let importRows = report.importers.find(row => row.id === tools);
                    expect(importRows).toBeDefined();
                    if (importRows) {
                        let exporters = importRows.columns.map(col => col.id);
                        expect(exporters).toEqual(knownExporters[tool].expby);
                    }
                }
            }
        });
    });
});
