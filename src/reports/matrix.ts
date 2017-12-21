import { ToolSummary, CrossCheckResult } from '../tables';

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
    columns: ColumnReport[];
}

export interface MatrixReport {
    tools: string[];
    exporters: RowReport[];
    importers: RowReport[];
};

function tallySummary(results: CrossCheckResult[]): SupportStatus {
    let passed = 0;
    let failed = 0;
    let rejected = 0;
    results.forEach((r) => {
        if (r.status == "passed") passed++;
        if (r.status == "failed") failed++;
        if (r.status == "rejected") rejected++;
    })
    return {
        passed: passed,
        failed: failed,
        rejected: rejected,
    }
}

function valuesOf<T, K extends keyof T>(attr: K, data: T[]): T[K][] {
    let ret = new Set<T[K]>();
    data.forEach((d) => { ret.add(d[attr]) });
    return Array.from(ret);
}

function nameMap(tools: ToolSummary[]): { [id: string]: string } {
    let ret: { [id: string]: string } = {};
    tools.forEach((tool) => {
        ret[tool.id] = tool.displayName;
    })
    return ret;
}

function collectRows(results: CrossCheckResult[], names: { [id: string]: string }, transpose: boolean, toolarg: string | undefined): RowReport[] {
    let toolSort = (a: string, b: string) => names[a] > names[b] ? 1 : (names[a] < names[b] ? -1 : 0);
    let toolFilter = (t: string) => !toolarg || t == toolarg;

    let row_tool: "import_tool" | "export_tool" = transpose ? "import_tool" : "export_tool";
    let row_version: "import_version" | "export_version" = transpose ? "import_version" : "export_version";
    let col_tool: "export_tool" | "import_tool" = transpose ? "export_tool" : "import_tool";
    let col_version: "export_version" | "import_version" = transpose ? "export_version" : "import_version";

    let row_tools = valuesOf(row_tool, results).filter(toolFilter);
    row_tools.sort(toolSort);

    return row_tools.map((row) => {
        let rres = results.filter((t) => t[row_tool] == row)
        let row_versions = valuesOf(row_version, rres);
        row_versions.sort((a: string, b: string) => a > b ? 1 : (a < b ? -1 : 0));

        let col_tools = valuesOf(col_tool, rres);
        col_tools.sort(toolSort);

        return {
            id: row,
            name: names[row],
            columns: col_tools.map((col) => {
                let cres = rres.filter((t) => t[col_tool] == col);
                let col_versions = valuesOf(col_version, cres);
                col_versions.sort((a: string, b: string) => a > b ? 1 : (a < b ? -1 : 0));
                return {
                    id: col,
                    name: names[col],
                    summary: tallySummary(cres),
                    rows: row_versions.map((rowv) => ({
                        version: rowv,
                        cols: col_versions.map((colv) => ({
                            version: colv,
                            status: tallySummary(cres.filter((r) => r[row_version] == rowv && r[col_version] == colv)),
                        }))
                    }))
                }
            })
        }
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

export async function createMatrixReport(tools: ToolSummary[], docs: CrossCheckResult[], query: MatrixReportQuery): Promise<MatrixReport> {
    let names = await nameMap(tools);

    let results = docs.filter((doc) => {
        if (query.version && doc.version != query.version) return false;
        if (query.variant && doc.variant != query.variant) return false;
        if (query.platform && doc.platform != query.platform) return false;
        return true;
    });

    let exporters = collectRows(results, names, false, query.tool);
    let importers = collectRows(results, names, true, query.tool);

    let all = [...exporters, ...importers];
    // Sort by **name**
    all.sort((a, b) => a.name > b.name ? 1 : (a.name < b.name) ? -1 : 0);
    // Extract **ids**
    let toolsIds = uniq(all.map((x) => x.id));

    return {
        tools: toolsIds,
        exporters: exporters,
        importers: importers,
    }
}
