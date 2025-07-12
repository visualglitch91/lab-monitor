import { reduce } from "lodash";
import {
  styled,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
} from "@mui/material";

const columns = {
  name: "auto",
  type: 100,
  status: 140,
  cpu: 100,
  memory: 100,
  uptime: 160,
  actions: 100,
};

const ProcessStackTableRoot = styled("div")(({ theme }) => ({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  borderTop: `1px solid ${theme.palette.divider}`,
  "& .MuiTableRow-root": {
    width: "100%",
    display: "flex",
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  "& .MuiTableHead-root": {
    background: theme.palette.background.default,
    position: "sticky",
    top: 0,
    zIndex: 2,
  },
  "& .MuiTableHead-root .MuiTableRow-root:hover": {
    fontWeight: "bold",
  },
  "& .MuiTableBody-root .MuiTableRow-root:hover": {
    background: theme.palette.background.paper,
  },
  "& .MuiTableCell-root": {
    display: "flex",
    alignItems: "center",
  },
  "& .MuiTableCell-alignLeft": { justifyContent: "flex-start" },
  "& .MuiTableCell-alignCenter": { justifyContent: "center" },
  "& .MuiTableCell-alignRight": { justifyContent: "flex-end" },
  ...reduce(
    columns,
    (acc, width, key) => ({
      ...acc,
      [`& .MuiTableCell-root[data-column="${key}"]`]:
        width === "auto"
          ? { flex: 1 }
          : { minWidth: width, maxWidth: width, flexShrink: 0 },
    }),
    {}
  ),
}));

export default function ProcessStackTable({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProcessStackTableRoot>
      <TableHead component="div">
        <TableRow component="div">
          <TableCell data-column="name" component="div">
            Name
          </TableCell>
          <TableCell data-column="type" component="div" align="center">
            Type
          </TableCell>
          <TableCell data-column="status" component="div" align="center">
            Status
          </TableCell>
          <TableCell data-column="cpu" component="div" align="center">
            CPU
          </TableCell>
          <TableCell data-column="memory" component="div" align="center">
            Memory
          </TableCell>
          <TableCell data-column="uptime" component="div" align="center">
            Uptime
          </TableCell>
          <TableCell data-column="actions" component="div" />
        </TableRow>
      </TableHead>
      <TableBody component="div">{children}</TableBody>
    </ProcessStackTableRoot>
  );
}
