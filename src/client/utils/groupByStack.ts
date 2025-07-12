import { StackSummary, UnifiedProcess } from "../../common/types/general";

export default function groupByStack(
  processes: UnifiedProcess[]
): StackSummary[] {
  const stackMap = new Map<string, UnifiedProcess[]>();

  for (const proc of processes) {
    const key = proc.stack?.trim() || proc.name;

    if (!stackMap.has(key)) {
      stackMap.set(key, []);
    }

    stackMap.get(key)!.push(proc);
  }

  const result: StackSummary[] = [];

  for (const [stack, procs] of stackMap.entries()) {
    let searchIndex = stack;
    let totalMemory = 0;
    let totalCpu = 0;
    let runningCount = 0;

    procs.forEach((p) => {
      searchIndex += `|${p.name}`;
      totalMemory += p.memory || 0;
      totalCpu += p.cpu || 0;

      if (p.status === "running") {
        runningCount += 1;
      }
    });

    const status =
      runningCount === procs.length
        ? "running"
        : runningCount === 0
        ? "stopped"
        : "partial";

    result.push({
      type: procs[0].type,
      name: stack,
      processes: procs,
      memory: totalMemory,
      cpu: totalCpu,
      status,
      searchIndex: searchIndex.toLowerCase(),
    });
  }

  return result;
}
