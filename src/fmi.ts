/**
 * The contents of this file represent types specifically in the FMI standard (but
 * mapped to TypeScript).
 */

export enum FMIVersion {
    FMI1 = "FMI_1.0",
    FMI2 = "FMI_2.0",
}
export function parseVersion(str: string): FMIVersion | null {
    if (str == FMIVersion.FMI1) return FMIVersion.FMI1;
    if (str == FMIVersion.FMI2) return FMIVersion.FMI2;
    return null;
}

export enum FMIVariant {
    CS = "CoSimulation",
    ME = "ModelExchange",
}
export function parseVariant(str: string): FMIVariant | null {
    if (str == FMIVariant.CS) return FMIVariant.CS;
    if (str == FMIVariant.ME) return FMIVariant.ME;
    return null;
}

export enum FMIPlatform {
    Code = "c-code",
    Win32 = "win32",
    Win64 = "win64",
    Linux32 = "linux32",
    Linux64 = "linux64",
    Darwin32 = "darwin32",
    Darwin64 = "darwin64",
}

export function parsePlatform(str: string): FMIPlatform | null {
    switch (str) {
        case "c-code":
            return FMIPlatform.Code;
        case "win32":
            return FMIPlatform.Win32;
        case "win64":
            return FMIPlatform.Win64;
        case "linux32":
            return FMIPlatform.Linux32;
        case "linux64":
            return FMIPlatform.Linux64;
        case "darwin32":
            return FMIPlatform.Darwin32;
        case "darwin64":
            return FMIPlatform.Darwin64;
        default:
            return null;
    }
}
