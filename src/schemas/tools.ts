export enum Status {
    Unsupported = "unsupported",
    Planned = "planned",
    Available = "available",
}

export interface VariantSupport {
    status: Status;
    num: number;
    // TODO: I don't think this should be here.  This should be
    // part of a query that performs some kind of reduce operation
    platforms: {
        darwin64?: number;
        linux32?: number;
        linux64?: number;
        win32?: number;
        win64?: number;
    }
}

export interface ToolSummary {
    id: string;
    displayName: string;
    homepage: string;
    email: string;
    note: string;
    fmi1: {
        "export": VariantSupport,
        "import": VariantSupport,
        "slave": VariantSupport,
        "master": VariantSupport,
    },
    fmi2: {
        "export": VariantSupport,
        "import": VariantSupport,
        "slave": VariantSupport,
        "master": VariantSupport,
    },
    repo: string; // Home repository for this data
}

export type ToolsTable = ToolSummary[];

