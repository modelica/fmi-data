export enum Status {
    Unsupported = "unsupported",
    Planned = "planned",
    Available = "available",
}

export interface ToolSummary {
    id: string;
    vendorId: string; // Vendor who "owns" this tool
    displayName: string;
    homepage: string;
    email: string;
    note: string;
    fmi1: {
        "export": Status,
        "import": Status,
        "slave": Status,
        "master": Status,
    },
    fmi2: {
        "export": Status,
        "import": Status,
        "slave": Status,
        "master": Status,
    },
}

export type ToolsTable = ToolSummary[];

