import express from "express";
import ViteExpress from "vite-express";
import { sanitizeError } from "../common/utils/error";
import { Action, UnifiedProcess } from "../common/types/general";
import { getApps, manageApp } from "./lib/pm2";
import { getContainers, manageContainer } from "./lib/docker";

const app = express();

app.use(express.json());

app.get("/api/pm2/apps", (_, res) => {
  try {
    res.send(getApps());
  } catch (err) {
    res.status(500).send(JSON.stringify(err));
  }
});

app.get("/api/docker/apps", (_, res) => {
  try {
    res.send(getContainers());
  } catch (err) {
    res.status(500).send(JSON.stringify(err));
  }
});

app.get("/api/apps", (_, res) => {
  try {
    const now = Date.now();

    const mappedPM2: UnifiedProcess[] = getApps().map((p) => {
      const running = p.pm2_env.status === "online";

      return {
        id: p.pm_id.toString(),
        name: p.name,
        status: running ? "running" : "stopped",
        uptime: running ? now - (p.pm2_env.pm_uptime ?? now) : 0,
        cpu: running ? p.monit.cpu : 0,
        memory: running ? p.monit.memory : 0,
        type: "pm2",
      };
    });

    const mappedDocker: UnifiedProcess[] = getContainers().map(
      ({ container, details, stats }) => {
        const running = details.State.Status === "running";

        const memoryUsage = running && stats ? stats.memory_stats.usage : 0;

        const cpuDelta =
          running && stats
            ? stats.cpu_stats.cpu_usage.total_usage -
              stats.precpu_stats.cpu_usage.total_usage
            : 0;

        const systemCpuDelta =
          running && stats
            ? stats.cpu_stats.system_cpu_usage -
              stats.precpu_stats.system_cpu_usage
            : 0;

        const cpuUsagePercent =
          running && stats
            ? systemCpuDelta > 0
              ? (cpuDelta / systemCpuDelta) *
                stats.cpu_stats.online_cpus *
                100.0
              : 0
            : 0;

        return {
          id: details.Id,
          name: details.Name.replace(/^\//, ""),
          status: running ? "running" : "stopped",
          uptime: Date.now() - new Date(details.State.StartedAt).getTime(),
          cpu: cpuUsagePercent,
          memory: memoryUsage,
          stack: container.Labels?.["com.docker.compose.project"] || undefined,
          type: "docker",
        };
      }
    );

    res.send([...mappedPM2, ...mappedDocker]);
  } catch (err) {
    res.status(500).send(sanitizeError(err));
  }
});

app.post("/api/:type/action/:action", async (req, res) => {
  const { ids } = req.body;
  const { type, action } = req.params;

  const validActions: Action[] = ["start", "stop", "restart"];

  if (!validActions.includes(action as any)) {
    res.status(400).send(`Invalid action: ${action}`);
    return;
  }

  try {
    if (!Array.isArray(ids) || !ids.length) {
      res.status(400).send("Invalid or missing 'ids'");
      return;
    }

    const promises = ids.map((id: string) => {
      switch (type) {
        case "docker":
          return manageContainer(id, action as (typeof validActions)[number]);
        case "pm2":
          return manageApp(id, action as (typeof validActions)[number]);
        default:
          throw new Error(`Unsupported type: ${type}`);
      }
    });

    await Promise.all(promises);
    res.sendStatus(200);
  } catch (err) {
    res.status(500).send(sanitizeError(err));
  }
});

ViteExpress.listen(app, 3000, () =>
  console.log("Server is listening on port 3000...")
);
