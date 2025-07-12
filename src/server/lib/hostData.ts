import si from "systeminformation";
import { ServerData } from "../../common/types/general";

let hostData: Omit<ServerData, "apps"> = {
  hostname: "",
  cpuUsage: 0,
  memory: { free: 0, used: 0, total: 0 },
};

async function loop() {
  const mem = await si.mem();
  const cpuLoad = await si.currentLoad();
  const hostname = await si.osInfo().then((info) => info.hostname);

  const totalMem = mem.total;
  const freeMem = mem.available;
  const usedMem = totalMem - freeMem;
  const cpuUsage = cpuLoad.currentLoad;

  hostData = {
    hostname,
    cpuUsage: cpuUsage,
    memory: {
      free: freeMem,
      total: totalMem,
      used: usedMem,
    },
  };

  setTimeout(loop, 1000);
}

loop();

export function getHostData() {
  return hostData;
}
