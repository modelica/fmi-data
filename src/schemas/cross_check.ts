import { FMIVersion, FMIVariant, FMIPlatform } from './fmi';

export type CrossCheckStatus = "passed" | "rejected" | "failed";

export interface CrossCheckResult {
    version: FMIVersion;
    variant: FMIVariant;
    platform: FMIPlatform;
    vendorId: string; // This is the importing vendor (since they are the ones doing the reporting)
    export_tool: string;
    export_version: string;
    import_tool: string;
    import_version: string;
    model: string;
    status: CrossCheckStatus;
}

export type CrossCheckTable = CrossCheckResult[];