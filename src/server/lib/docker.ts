import Docker, {
  ContainerInfo,
  ContainerInspectInfo,
  ContainerStats,
} from "dockerode";

const docker = new Docker();

interface ContainerWithStats {
  container: ContainerInfo;
  details: ContainerInspectInfo;
  stats: ContainerStats | null;
}

let lastContainers: ContainerWithStats[] = [];
let lastError: unknown = null;

async function loop(): Promise<void> {
  try {
    const containers = await docker.listContainers({ all: true });

    const details = await Promise.all(
      containers.map((c) => docker.getContainer(c.Id).inspect())
    );

    const statsArray = await Promise.all(
      containers.map(async (c) => {
        try {
          const container = docker.getContainer(c.Id);
          const stream = await container.stats({ stream: false });
          return stream;
        } catch {
          return null;
        }
      })
    );

    lastContainers = containers.map((container, i) => ({
      container,
      details: details[i],
      stats: statsArray[i],
    }));

    lastError = null;
  } catch (err) {
    lastError = err;
    console.error(err);
  } finally {
    setTimeout(loop, 1000);
  }
}

void loop();

export function getContainers(): ContainerWithStats[] {
  if (lastError) throw lastError;
  return lastContainers;
}

export async function manageContainer(
  id: string,
  action: "start" | "stop" | "restart"
): Promise<void> {
  const container = docker.getContainer(id);
  const info = await container.inspect();

  switch (action) {
    case "start":
      if (info.State.Running) return; // skip if already started
      return container.start();
    case "stop":
      if (!info.State.Running) return; // skip if already stopped
      return container.stop();
    case "restart":
      return container.restart();
    default:
      return Promise.reject(new Error(`Invalid action: ${action}`));
  }
}
