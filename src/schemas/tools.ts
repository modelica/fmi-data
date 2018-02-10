/**
 * Levels of support: A=Available (but no exports) and P=Planned
 */
export type VariantSupportValues = "A" | "P";

/**
 * Optional indications of support for each variant of FMI
 *
 * @export
 * @interface VariantSupport
 */
export interface VariantSupportFields {
    export?: VariantSupportValues;
    import?: VariantSupportValues;
    slave?: VariantSupportValues;
    master?: VariantSupportValues;
}

/**
 * This applies to <ToolName>.tool files
 */
export interface ToolFile {
    displayName: string;
    homepage: string | null;
    note: string;
    email: string | null;
    FMI1_0: VariantSupportFields;
    FMI2_0: VariantSupportFields;
}
