import { useEffect, useState } from "react";
import {
  Stack,
  CardHeader,
  CssBaseline,
  ThemeProvider,
  CardContent,
  TextField,
  Chip,
  Box,
} from "@mui/material";
import { StackSummary } from "../common/types/general";
import { stringifyError } from "../common/utils/error";
import theme from "./utils/theme";
import useDebounce from "./utils/useDebounce";
import groupByStack from "./utils/groupByStack";
import ProcessStack from "./components/ProcessStack";
import ProcessStackTable from "./components/ProcessStackTable";
import { bytes } from "./utils/formatting";

export default function App() {
  const [data, setData] = useState<StackSummary[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    let timeout = 0;

    const loadData = async () => {
      try {
        const data = await fetch("/api/apps").then((res) => res.json());
        setData(groupByStack(data));
      } catch (err) {
        alert(stringifyError(err));
        setData([]);
      }

      timeout = window.setTimeout(loadData, 1_000);
    };

    loadData();

    return () => {
      window.clearTimeout(timeout);
    };
  }, []);

  const updateQuery = useDebounce((value: string) => {
    setQuery(value);
  }, 120);

  const totalCpu = data.reduce((acc, stack) => acc + stack.cpu, 0);
  const totalMemory = data.reduce((acc, stack) => acc + stack.memory, 0);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Stack>
        <CardHeader
          title={
            <Stack direction="row" gap={1} alignItems="center">
              <Box mt="-g2px">Lab Monitor</Box>
              <Chip size="small" label={<>CPU: {totalCpu.toFixed(1)}%</>} />
              <Chip size="small" label={<>Memory: {bytes(totalMemory)}</>} />
            </Stack>
          }
          sx={{ pb: 0 }}
        />
        <CardContent>
          <TextField
            fullWidth
            sx={{ mb: 2 }}
            size="small"
            variant="outlined"
            label="Search"
            defaultValue={query}
            onChange={(e) => updateQuery(e.target.value)}
          />
          <ProcessStackTable>
            {data
              .filter((it) => {
                return it.searchIndex.includes(query.trim().toLowerCase());
              })
              .map((stack, i) => {
                return <ProcessStack key={i} stack={stack} />;
              })}
          </ProcessStackTable>
        </CardContent>
      </Stack>
    </ThemeProvider>
  );
}
