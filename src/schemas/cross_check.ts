import { FMIVersion, FMIVariant, FMIPlatform, ToolDetails } from './fmi';

export type CrossCheckStatus = "passed" | "rejected" | "failed";

export interface CrossCheckResult {
    version: FMIVersion;
    variant: FMIVariant;
    platform: FMIPlatform;
    importer: ToolDetails;
    exporter: ToolDetails;
    model: string;
    status: CrossCheckStatus;
}

export type CrossCheckTable = CrossCheckResult[];