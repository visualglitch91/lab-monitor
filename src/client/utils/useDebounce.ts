import { useMemo } from "react";
import { debounce } from "lodash";

export default function useDebounce<F extends (...args: any[]) => any>(
  func: F,
  timeout: number = 300,
  deps: any[] = []
) {
  return useMemo(() => debounce(func, timeout), deps) as unknown as F;
}
