import { get } from "lodash";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";

export function field(
  field: string,
  label: string,
  extra?: Omit<GridColDef, "field">
) {
  return {
    field,
    headerName: label,
    valueGetter: (_: unknown, row: any) => get(row, field),
    headerAlign: extra?.align || undefined,
    ...extra,
  };
}

export function custom<T extends { id: string }>(
  fieldName: string,
  label: string,
  renderer: (item: T) => React.ReactNode,
  extra?: Omit<GridColDef, "field">
) {
  return field(fieldName, label, {
    renderCell: ({ row }: GridRenderCellParams<T>) => renderer(row),
    ...extra,
  });
}

export function actions<T extends { id: string }>(
  renderer: (item: T) => React.ReactNode,
  extra?: Omit<GridColDef, "field">
) {
  return custom("actions", "", renderer, { align: "right", ...extra });
}
