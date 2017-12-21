import { FMIVersion, FMIVariant, FMIPlatform } from '../fmi';

export type CrossCheckStatus = "passed" | "rejected" | "failed";

/**
 * Entry for each cross-check result as a "row" in a "table"
 */
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

/**
 * Complete table of cross-check results
 */
export type CrossCheckTable = CrossCheckResult[];