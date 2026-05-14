import "./index.css";
import { Composition } from "remotion";
import { ChapterProgressBar } from "./ChapterProgressBar";
import { parseTime, ProgressBarSchema } from "./schema";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="ChapterProgressBar"
        component={ChapterProgressBar}
        fps={30}
        width={1920}
        height={1080}
        schema={ProgressBarSchema}
        defaultProps={{
          barOpacity: 0.82,
          barHeight: 52,
          colorFilled: "#C09070",
          colorUnfilled: "#EDE4D4",
          chapters: [
            { name: "开场",            startTime: "0:00",  endTime: "0:34"  },
            { name: "为什么用AI知识库", startTime: "0:34",  endTime: "1:45"  },
            { name: "知识库结构",       startTime: "1:45",  endTime: "4:55"  },
            { name: "构建和使用演示",   startTime: "4:55",  endTime: "9:48"  },
            { name: "结语",            startTime: "9:48",  endTime: "11:19" },
          ],
        }}
        calculateMetadata={({ props }) => {
          const totalS = Math.max(
            ...props.chapters.map((ch) => parseTime(ch.endTime))
          );
          return {
            durationInFrames: Math.max(1, Math.round(totalS * 30)),
          };
        }}
      />
    </>
  );
};
