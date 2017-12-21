import { FMIVersion, FMIVariant, FMIPlatform } from '../fmi';

/**
 * Entry for each exported FMU as a "row" in a "table"
 */
export interface FMUDetails {
    name: string;
    vendorId: string;
    version: FMIVersion;
    variant: FMIVariant;
    platform: FMIPlatform;
    export_tool: string;
    export_version: string;
}

/**
 * A complete table of exported FMUs
 */
export type FMUTable = FMUDetails[];