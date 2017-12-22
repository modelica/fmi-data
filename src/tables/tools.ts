export enum Status {
    Unsupported = "unsupported",
    Planned = "planned",
    Available = "available",
}

export interface VariantStatus {
    export: Status;
    import: Status;
    slave: Status;
    master: Status;
}

export interface ToolSummary {
    id: string;
    vendorId: string; // Vendor who "owns" this tool
    displayName: string;
    homepage: string;
    email: string;
    note: string;
    fmi1: VariantStatus,
    fmi2: VariantStatus,
}

export type ToolsTable = ToolSummary[];

