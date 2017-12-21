# Tables

The types defined in this package correspond directly to the different types of "tables"
that we persist as a result of processing the tool data.

These tables may be actual database tables or they may simply be stored as JSON.  But in each
case, this is the data that we expect to read and write to and from such tables, regardless
of how they are persisted.

## Tools Table

The tools table contains information about known tools.  Each tool is associated with a specified vendor
via the `vendorId` field.

## FMUs Table

The FMUs table contains information about exported FMUs.  Each FMU is associated with an exporting tool
via the `export_tool` field as well as a vendor via the `vendorId` field.

## Cross-Check Table

The cross-check table contains information about imported FMUs.  Each cross-check result is associated both
with the tool that exported the FMU (via the `export_tool` field) and the tool that imported the FMU
(via the `import_tool` field).  In the cross-check results, the `vendorId` field is associated with
the **importing** tool (since it is that vendor that is actually asserting this result).
