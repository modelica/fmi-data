import { ToolSummary, CrossCheckResult, Status } from "../tables";
import { FMIVersion, FMIVariant } from "../fmi";

import * as debug from "debug";
const debugReport = debug("fmi-data:report");
debugReport.enabled = false;

export interface SupportStatus {
    passed: number;
    rejected: number;
    failed: number;
}

export interface ColumnVersion {
    version: string;
    status: SupportStatus;
}

export interface RowVersion {
    version: string;
    cols: ColumnVersion[];
}

export interface ColumnReport {
    id: string;
    name: string;
    summary: SupportStatus;
    rows: RowVersion[];
}

export interface RowReport {
    id: string;
    name: string;
    best: Status;
    columns: ColumnReport[];
}

export interface MatrixReport {
    tools: string[];
    exporters: RowReport[];
    importers: RowReport[];
}

function tallySummary(results: CrossCheckResult[]): SupportStatus {
    let passed = 0;
    let failed = 0;
    let rejected = 0;
    results.forEach(r => {
        if (r.status == "passed") passed++;
        if (r.status == "failed") failed++;
        if (r.status == "rejected") rejected++;
    });
    return {
        passed: passed,
        failed: failed,
        rejected: rejected,
    };
}

function valuesOf<T, K extends keyof T>(attr: K, data: T[]): T[K][] {
    let ret = new Set<T[K]>();
    data.forEach(d => {
        ret.add(d[attr]);
    });
    return Array.from(ret);
}

function nameMap(tools: ToolSummary[]): { [id: string]: string } {
    let ret: { [id: string]: string } = {};
    tools.forEach(tool => {
        ret[tool.id] = tool.displayName;
    });
    return ret;
}

function collectRows(
    results: CrossCheckResult[],
    _tools: ToolSummary[],
    supporters: SupportMap,
    names: { [id: string]: string },
    transpose: boolean,
    toolarg: string | undefined,
): RowReport[] {
    let toolSort = (a: string, b: string) => (names[a] > names[b] ? 1 : names[a] < names[b] ? -1 : 0);
    let toolFilter = (t: string) => !toolarg || t == toolarg;

    let row_tool: "import_tool" | "export_tool" = transpose ? "import_tool" : "export_tool";
    let row_version: "import_version" | "export_version" = transpose ? "import_version" : "export_version";
    let col_tool: "export_tool" | "import_tool" = transpose ? "export_tool" : "import_tool";
    let col_version: "export_version" | "import_version" = transpose ? "export_version" : "import_version";

    // First, find all tools that have cross check results for either importing or exporting (depending on what we are looking for)
    let xc_tools = valuesOf(row_tool, results);
    // Second, find all tools that claim some level of support
    let supported_tools = Object.keys(supporters).filter(key => supporters[key] !== Status.Unsupported);
    // Merge the two sets of tools into a unique list and filter
    let row_tools = uniq([...xc_tools, ...supported_tools]).filter(toolFilter);
    // Sort the remaining tools
    row_tools.sort(toolSort);

    return row_tools.map(row => {
        debugReport.enabled = row == "20sim";
        debugReport("Processing %j as %s", row, row_tool);
        let rres = results.filter(t => t[row_tool] == row);
        debugReport("  %d cross-check results for this tool", rres.length);
        let row_versions = valuesOf(row_version, rres);
        row_versions.sort((a: string, b: string) => (a > b ? 1 : a < b ? -1 : 0));

        let col_tools = valuesOf(col_tool, rres);
        col_tools.sort(toolSort);
        debugReport("  %ss: %j", col_tool, col_tools);

        let columns = col_tools.map(col => {
            let cres = rres.filter(t => t[col_tool] == col);
            debugReport("    %d cross-check results that also have %s as %s", cres.length, col, col_tool);
            let col_versions = valuesOf(col_version, cres);
            col_versions.sort((a: string, b: string) => (a > b ? 1 : a < b ? -1 : 0));
            return {
                id: col,
                name: names[col],
                summary: tallySummary(cres),
                rows: row_versions.map(rowv => ({
                    version: rowv,
                    cols: col_versions.map(colv => ({
                        version: colv,
                        status: tallySummary(cres.filter(r => r[row_version] == rowv && r[col_version] == colv)),
                    })),
                })),
            };
        });
        debugReport("    columns: %j", columns);
        return {
            id: row,
            name: names[row],
            best: supporters[row],
            columns: columns,
        };
    });
}

export interface MatrixReportQuery {
    version?: string;
    variant?: string;
    platform?: string;
    tool?: string;
}

function uniq<T>(list: T[]): T[] {
    let ret: T[] = [];
    for (let i = 0; i < list.length; i++) {
        let idx = ret.indexOf(list[i]);
        if (idx == -1) {
            ret.push(list[i]);
        }
    }
    return ret;
}

export function bestSupport(s1: Status, s2: Status): Status {
    if (s1 === Status.Unsupported) return s2;
    if (s2 === Status.Unsupported) return s1;
    if (s1 === Status.Planned) return s2;
    if (s2 === Status.Planned) return s1;
    if (s1 === Status.Available) return s2;
    if (s2 === Status.Available) return s1;
    return s1;
}

export function worstSupport(s1: Status, s2: Status): Status {
    if (s1 === Status.CrossChecked) return s2;
    if (s2 === Status.CrossChecked) return s1;
    if (s1 === Status.Available) return s2;
    if (s2 === Status.Available) return s1;
    if (s1 === Status.Planned) return s2;
    if (s2 === Status.Planned) return s1;
    return s1;
}

function bestSupportOfQuery(query: MatrixReportQuery, tool: ToolSummary, exp: boolean): Status {
    if (query.platform !== undefined) return Status.Unsupported;
    let best = Status.Unsupported;
    let matches = (s: string, v: string | undefined) => v == undefined || s === v;
    if (matches(FMIVersion.FMI1, query.version)) {
        if (matches(FMIVariant.ME, query.variant)) {
            if (exp) {
                best = bestSupport(best, tool.fmi1.export);
            } else {
                best = bestSupport(best, tool.fmi1.import);
            }
        }
        if (matches(FMIVariant.CS, query.variant)) {
            if (exp) {
                best = bestSupport(best, tool.fmi1.slave);
            } else {
                best = bestSupport(best, tool.fmi1.master);
            }
        }
    }
    if (matches(FMIVersion.FMI2, query.version)) {
        if (matches(FMIVariant.ME, query.variant)) {
            if (exp) {
                best = bestSupport(best, tool.fmi2.export);
            } else {
                best = bestSupport(best, tool.fmi2.import);
            }
        }
        if (matches(FMIVariant.CS, query.variant)) {
            if (exp) {
                best = bestSupport(best, tool.fmi2.slave);
            } else {
                best = bestSupport(best, tool.fmi2.master);
            }
        }
    }
    return best;
}

export type SupportMap = { [id: string]: Status };
function supportLevel(query: MatrixReportQuery, tools: ToolSummary[], exports: boolean): SupportMap {
    let ret: SupportMap = {};
    for (let i = 0; i < tools.length; i++) {
        let tool = tools[i];
        ret[tool.id] = bestSupportOfQuery(query, tool, exports);
    }
    return ret;
}

export async function createMatrixReport(
    tools: ToolSummary[],
    docs: CrossCheckResult[],
    query: MatrixReportQuery,
): Promise<MatrixReport> {
    let names = await nameMap(tools);

    // Remove all results that don't match our query criteria
    let results = docs.filter(doc => {
        if (query.version && doc.version != query.version) return false;
        if (query.variant && doc.variant != query.variant) return false;
        if (query.platform && doc.platform != query.platform) return false;
        return true;
    });

    // Collect all tools that claim to support export under this query filter
    let exportSupport = supportLevel(query, tools, true);
    // Collect results using export tool as the row and import tool as the column
    let exporters = collectRows(results, tools, exportSupport, names, false, query.tool);

    // Collect all tools that claim to support import under this query filter
    let importSupport = supportLevel(query, tools, true);
    // Collect results using import tool as the row and export tool as the column
    let importers = collectRows(results, tools, importSupport, names, true, query.tool);

    let all = [...exporters, ...importers];
    // Sort by **name**
    all.sort((a, b) => (a.name > b.name ? 1 : a.name < b.name ? -1 : 0));
    // Extract **ids**
    let toolsIds = uniq(all.map(x => x.id));

    return {
        tools: toolsIds, // TODO: Use tool summaries?
        exporters: exporters,
        importers: importers,
    };
}
