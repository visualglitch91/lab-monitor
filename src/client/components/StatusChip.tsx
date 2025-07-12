import { Chip } from "@mui/material";

type Status = "running" | "partial" | "stopped";

const colorMap = {
  running: "success",
  partial: "warning",
  stopped: "error",
} satisfies Record<Status, "success" | "warning" | "error">;

export default function StatusChip({ status }: { status: Status }) {
  return <Chip size="small" label={status} color={colorMap[status]} />;
}
