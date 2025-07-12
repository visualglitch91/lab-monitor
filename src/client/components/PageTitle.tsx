import { Chip, Stack } from "@mui/material";
import { ClientData } from "../../common/types/general";
import { bytes } from "../utils/formatting";
import { useEffect } from "react";

export default function PageTitle({
  data: { stacks, server },
}: {
  data: ClientData;
}) {
  const pageTitle = `${server.hostname} dashboard`;

  const totalProcesses = stacks.reduce(
    (acc, stack) => acc + stack.processes.length,
    0
  );

  const totalRunning = stacks.reduce(
    (acc, stack) =>
      acc + stack.processes.filter((p) => p.status === "running").length,
    0
  );

  useEffect(() => {
    document.title = pageTitle;
  }, [pageTitle]);

  return (
    <Stack gap={1}>
      {pageTitle}
      <Stack direction="row" gap={1} alignItems="center" flexWrap="wrap">
        <Chip size="small" label={<>CPU: {server.cpuUsage.toFixed(2)}%</>} />
        <Chip
          size="small"
          label={
            <>
              Memory Used: {bytes(server.memory.used)} of{" "}
              {bytes(server.memory.total)}
            </>
          }
        />
        <Chip size="small" label={<>Stacks: {stacks.length}</>} />
        <Chip size="small" label={<>Processes: {totalProcesses}</>} />
        <Chip size="small" label={<>Running: {totalRunning}</>} />
      </Stack>
    </Stack>
  );
}
