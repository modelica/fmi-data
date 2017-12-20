import { FMIVersion, FMIVariant, FMIPlatform } from './fmi';

export interface FMUDetails {
    name: string;
    vendorId: string;
    version: FMIVersion;
    variant: FMIVariant;
    platform: FMIPlatform;
    export_tool: string;
    export_version: string;
}

export type FMUTable = FMUDetails[];