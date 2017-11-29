import { ToolDetails, FMIVersion, FMIVariant, FMIPlatform } from './fmi';

export interface FMUDetails {
    name: string;
    version: FMIVersion;
    variant: FMIVariant;
    platform: FMIPlatform;
    exporter: ToolDetails;
}

export type FMUTable = FMUDetails[];