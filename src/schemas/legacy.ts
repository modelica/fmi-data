import { VariantSupportValues } from "./tools";

/**
 * This applies to older <ToolName>.info
 */
export interface LegacyToolFile {
    Tool: {
        name: string;
        href: string | null;
        email: string | null;
        note: string;
        import_me: VariantSupportValues;
        export_me: VariantSupportValues;
        slave_cs: VariantSupportValues;
        master_cs: VariantSupportValues;
        import_me_20: VariantSupportValues;
        export_me_20: VariantSupportValues;
        slave_cs_20: VariantSupportValues;
        master_cs_20: VariantSupportValues;
        vendor: string;
    };
}
