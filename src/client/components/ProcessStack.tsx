import { useState } from "react";
import {
  Box,
  Stack,
  TableRow,
  Accordion,
  TableCell,
  IconButton,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import StopIcon from "@mui/icons-material/Stop";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import {
  Action,
  StackSummary,
  UnifiedProcess,
} from "../../common/types/general";
import { stringifyError } from "../../common/utils/error";
import { bytes, duration } from "../utils/formatting";
import StatusChip from "./StatusChip";

function CommonCells({
  item,
  uptime,
  onAction,
}: {
  item: Pick<StackSummary, "cpu" | "memory" | "status">;
  uptime: number | null;
  onAction: (action: Action) => Promise<void>;
}) {
  const [loading, setLoading] = useState(false);
  const running = item.status !== "stopped";

  const action = (type: Action) => {
    return (e: React.MouseEvent) => {
      e.stopPropagation();
      setLoading(true);
      onAction(type).finally(() => {
        setLoading(false);
      });
    };
  };

  return (
    <>
      <TableCell data-column="status" component="div" align="center">
        <StatusChip status={item.status} />
      </TableCell>
      <TableCell data-column="cpu" component="div" align="center">
        {running ? `${item.cpu.toFixed(1)}%` : "-"}
      </TableCell>
      <TableCell data-column="memory" component="div" align="center">
        {running ? bytes(item.memory) : "-"}
      </TableCell>
      <TableCell data-column="uptime" component="div" align="center">
        {running && uptime !== null ? duration(uptime) : "-"}
      </TableCell>
      <TableCell data-column="actions" component="div" align="right">
        <Stack
          direction="row"
          spacing={1}
          justifyContent="flex-end"
          width="100%"
        >
          {running ? (
            <>
              <IconButton
                disabled={loading}
                size="small"
                color="warning"
                onClick={action("restart")}
              >
                <RestartAltIcon fontSize="small" />
              </IconButton>
              <IconButton
                disabled={loading}
                size="small"
                color="error"
                onClick={action("stop")}
              >
                <StopIcon fontSize="small" />
              </IconButton>
            </>
          ) : (
            <IconButton
              disabled={loading}
              size="small"
              color="success"
              onClick={action("start")}
            >
              <PlayArrowIcon fontSize="small" />
            </IconButton>
          )}
        </Stack>
      </TableCell>
    </>
  );
}

export default function ProcessStack({ stack }: { stack: StackSummary }) {
  const [expanded, setExpanded] = useState(false);
  const isSingle = stack.processes.length === 1;

  const action = (processes: UnifiedProcess[]) => {
    return (type: Action) => {
      return fetch(`/api/${stack.type}/action/${type}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: processes.map((p) => p.id) }),
      })
        .then((res) => {
          return res.status >= 400
            ? Promise.reject(new Error(res.statusText))
            : undefined;
        })
        .catch((error) => {
          alert(stringifyError(error));
        });
    };
  };

  const stackElement = (
    <>
      <TableCell data-column="name" component="div">
        <Stack direction="row" alignItems="center">
          {!isSingle && (
            <ExpandMoreIcon
              sx={{
                fontSize: 20,
                transition: "transform 100ms linear",
                transform: `rotate(${expanded ? 0 : "-90deg"})`,
              }}
            />
          )}
          {stack.name}
        </Stack>
      </TableCell>
      <TableCell data-column="type" component="div" align="center">
        {stack.type}
      </TableCell>
      <CommonCells
        item={stack}
        uptime={isSingle ? stack.processes[0].uptime : null}
        onAction={action(stack.processes)}
      />
    </>
  );

  if (stack.processes.length === 1) {
    return <TableRow component="div">{stackElement}</TableRow>;
  }

  return (
    <Accordion
      disableGutters
      expanded={expanded}
      onChange={() => setExpanded(!expanded)}
      sx={{
        boxShadow: "none",
        background: "transparent",
        "&:before": { display: "none" },
        "& .MuiAccordionSummary-root": { padding: 0 },
        "& .MuiAccordionSummary-content": { margin: 0 },
        "& .MuiAccordionDetails-root": { padding: 0 },
      }}
    >
      <TableRow
        expandIcon={null}
        component={AccordionSummary}
        slotProps={{ root: { component: "div" } }}
      >
        {stackElement}
      </TableRow>
      <AccordionDetails>
        <Stack spacing={1}>
          {stack.processes.map((proc, i) => (
            <TableRow key={i} component="div">
              <TableCell data-column="name" component="div">
                <Box pl="20px">{proc.name}</Box>
              </TableCell>
              <CommonCells
                item={proc}
                uptime={proc.uptime}
                onAction={action([proc])}
              />
            </TableRow>
          ))}
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
}
