import { loadFont } from "@remotion/google-fonts/NotoSansSC";
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { parseTime, ProgressBarProps } from "./schema";

const { fontFamily } = loadFont("normal", {
  weights: ["700"],
});

const COLORS = {
  divider: "#CBBFA8",
  text:    "#4A3220",
  shadow:  "rgba(60, 40, 20, 0.18)",
};

export const ChapterProgressBar: React.FC<ProgressBarProps> = ({
  barOpacity,
  barHeight,
  colorFilled,
  colorUnfilled,
  chapters,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentTimeS = frame / fps;

  const chaptersWithTimes = chapters.map((ch) => ({
    ...ch,
    startS: parseTime(ch.startTime),
    endS: parseTime(ch.endTime),
  }));

  const totalDurationS = Math.max(...chaptersWithTimes.map((ch) => ch.endS));

  return (
    <AbsoluteFill style={{ background: "transparent" }}>
      {/* 底部阴影 */}
      <div
        style={{
          position: "absolute",
          top: barHeight,
          left: 0,
          right: 0,
          height: 8,
          background: `linear-gradient(to bottom, ${COLORS.shadow}, transparent)`,
        }}
      />

      {/* 进度条主体 */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: barHeight,
          display: "flex",
          opacity: barOpacity,
        }}
      >
        {chaptersWithTimes.map((chapter, i) => {
          const segmentDuration = chapter.endS - chapter.startS;
          const segmentWidthPct = (segmentDuration / totalDurationS) * 100;

          const isCompleted = currentTimeS >= chapter.endS;
          const isActive =
            currentTimeS >= chapter.startS && currentTimeS < chapter.endS;

          const fillProgress = isCompleted
            ? 1
            : isActive
            ? (currentTimeS - chapter.startS) / segmentDuration
            : 0;

          return (
            <div
              key={i}
              style={{
                width: `${segmentWidthPct}%`,
                height: "100%",
                position: "relative",
                backgroundColor: colorUnfilled,
                borderRight:
                  i < chaptersWithTimes.length - 1
                    ? `2px solid ${COLORS.divider}`
                    : "none",
                overflow: "hidden",
              }}
            >
              {/* 进度填充 */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: `${fillProgress * 100}%`,
                  height: "100%",
                  backgroundColor: colorFilled,
                }}
              />

              {/* 章节名称 */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily,
                  fontSize: 20,
                  fontWeight: "700",
                  color: COLORS.text,
                  letterSpacing: "0.08em",
                  userSelect: "none",
                }}
              >
                {chapter.name}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
