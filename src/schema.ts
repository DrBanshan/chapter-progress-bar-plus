import { z } from "zod";

export const ChapterSchema = z.object({
  name: z.string(),
  startTime: z.string().regex(/^\d+:\d{2}$/, 'Format: m:ss or mm:ss'),
  endTime: z.string().regex(/^\d+:\d{2}$/, 'Format: m:ss or mm:ss'),
});

export const ProgressBarSchema = z.object({
  barOpacity: z.number().min(0).max(1),
  barHeight: z.number().min(10).max(300),
  colorFilled: z.string(),
  colorUnfilled: z.string(),
  chapters: z.array(ChapterSchema),
});

export type ProgressBarProps = z.infer<typeof ProgressBarSchema>;

/** "m:ss" or "mm:ss" → seconds */
export const parseTime = (t: string): number => {
  const [m, s] = t.split(":").map(Number);
  return m * 60 + s;
};
