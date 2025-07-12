// @ts-ignore
import humanizeDuration from "humanize-duration";
// @ts-ignore
import prettyBytes from "pretty-bytes";

const shortEnglishHumanizer = humanizeDuration.humanizer({
  language: "shortEn",
  languages: {
    shortEn: {
      y: () => "y",
      mo: () => "mo",
      w: () => "w",
      d: () => "d",
      h: () => "h",
      m: () => "m",
      s: () => "s",
      ms: () => "ms",
    },
  },
});

export function duration(miliseconds: number): string {
  return shortEnglishHumanizer(miliseconds, {
    largest: 1,
    units: ["d", "h", "m"],
    round: true,
  }).replaceAll(" ", "");
}

export function bytes(bytes: number): string {
  return prettyBytes(bytes, { space: true });
}
