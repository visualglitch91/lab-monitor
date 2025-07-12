import { useEffect, useState } from "react";
import {
  Stack,
  CardHeader,
  CssBaseline,
  ThemeProvider,
  CardContent,
  TextField,
} from "@mui/material";
import { ClientData, ServerData, StackSummary } from "../common/types/general";
import { stringifyError } from "../common/utils/error";
import theme from "./utils/theme";
import useDebounce from "./utils/useDebounce";
import groupByStack from "./utils/groupByStack";
import ProcessStack from "./components/ProcessStack";
import ProcessStackTable from "./components/ProcessStackTable";
import PageTitle from "./components/PageTitle";

export default function App() {
  const [query, setQuery] = useState("");
  const [data, setData] = useState<ClientData | null>(null);

  useEffect(() => {
    let timeout = 0;

    const loadData = async () => {
      try {
        const { apps, ...server }: ServerData = await fetch("/api/data").then(
          (res) => res.json()
        );

        setData({ server, stacks: groupByStack(apps) });
      } catch (err) {
        alert(stringifyError(err));
        setData(null);
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

  if (!data) {
    return null;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Stack>
        <CardHeader title={<PageTitle data={data} />} sx={{ pb: 0 }} />
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
            {data.stacks
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
