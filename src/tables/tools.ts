import { VendorDetails } from "../schemas";

export enum Status {
    Unsupported = "unsupported",
    Planned = "planned",
    Available = "available",
    // No higher levels of support are included here because
    //   a) This is largely a normalization of the ToolInfo data from the vendor
    //   b) The tool doesn't get to decide if it is cross-checked
    //   c) The cross check results and some logic are required to determine this
}

export interface VariantStatus {
    export: Status;
    import: Status;
    slave: Status;
    master: Status;
}

export interface ToolSummary {
    id: string;
    vendor: VendorDetails;
    displayName: string;
    homepage: string | null;
    email: string | null;
    note: string;
    fmi1: VariantStatus;
    fmi2: VariantStatus;
}

export type ToolsTable = ToolSummary[];
