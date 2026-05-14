---
name: chapter-progress-bar-plus
description: >
  根据用户提供的章节时间戳，生成可在 Remotion Studio 中实时编辑的章节进度条视频（透明背景 overlay）。
  支持在 Studio UI 中直接编辑章节名称、起止时间戳（m:ss 格式）、章节数量、不透明度和进度条高度，
  无需改代码，视频总时长自动计算。米色配色，可叠加在任何视频上方。
  Use when the user wants to create a chapter/section progress bar overlay for a video
  and wants to be able to tweak parameters (chapters, timestamps, opacity, height)
  directly in the Remotion Studio preview UI without editing source code.
metadata:
  author: user
  version: "1.0"
---

## References

- [component.md](./references/component.md) — 文件结构、Schema 参数说明、渲染命令
- [src/schema.ts](./src/schema.ts) — Zod 参数定义
- [src/ChapterProgressBar.tsx](./src/ChapterProgressBar.tsx) — 主组件源码
- [src/Root.tsx](./src/Root.tsx) — Composition 注册（含 schema + calculateMetadata）

# Chapter Progress Bar Plus

与原版 chapter-progress-bar 的核心区别：**所有参数均可在 Remotion Studio 右侧面板实时编辑**，无需修改源码。

## 第一步：收集章节信息

**模式 A — 用户提供 `.srt` 字幕文件**

读取文件，找出自然话题转换点，向用户建议章节划分，**确认后再继续**。

**模式 B — 用户直接给出时间戳和章节名**

```
0:00 开始
2:07 文件夹结构
4:46 自动化输入流
```

直接使用。视频总时长 = 最后一个章节的结束时间（用户若未给结束时间则询问）。

---

两种模式都需确认：
- **视频比例**：16:9（横屏，默认）还是 9:16（竖屏 Shorts / Reels）

其余参数（不透明度、进度条高度）用户在 Studio 里实时调，无需提前询问。

> [!IMPORTANT]
> **此 skill 的最终 output 是启动预览 server（`npm run dev`），不是渲染视频。**
> 禁止主动执行任何 `remotion render` 命令，除非用户明确说"帮我渲染"。

## 第二步：准备 Remotion 项目

询问用户：是否已有 overlay 项目？如有，直接 `cd` 进去；如没有，在用户指定目录新建：

```bash
npx create-video@latest --yes --overlay chapter-progress-bar-plus
cd chapter-progress-bar-plus
npm install
npm install @remotion/google-fonts
```

## 第三步：写入三个组件文件

### `src/schema.ts`

直接复制 [src/schema.ts](./src/schema.ts)，无需修改。

### `src/ChapterProgressBar.tsx`

直接复制 [src/ChapterProgressBar.tsx](./src/ChapterProgressBar.tsx)，无需修改。

### `src/Root.tsx`

复制 [src/Root.tsx](./src/Root.tsx)，然后：

1. 填入用户提供的章节数据（`defaultProps.chapters`），格式为 `startTime`/`endTime` 字符串（`"m:ss"` 或 `"mm:ss"`）：

```ts
chapters: [
  { name: "开场",   startTime: "0:00",  endTime: "0:34"  },
  { name: "章节二", startTime: "0:34",  endTime: "1:45"  },
  // ...
],
```

2. 根据视频比例设置尺寸：
   - 16:9 横屏：`width={1920} height={1080}`
   - 9:16 竖屏：`width={1080} height={1920}`

**无需**手动设置 `durationInFrames`——`calculateMetadata` 会自动从最大 `endTime` 计算。

## 第四步：启动预览服务器

```bash
npm run dev
```

告诉用户：
> 预览已启动，请打开 http://localhost:3000。在右侧 Props 面板可直接编辑章节名称、时间戳、不透明度和高度，实时预览效果。满意后告诉我，我给你渲染命令。

## 第五步：用户明确要求后，给出渲染命令（不要帮用户执行）

```bash
# WebM 透明背景（通用，DaVinci / Premiere / 剪映）
npx remotion render ChapterProgressBar --codec=vp8 out/progress-bar.webm

# ProRes 4444 透明背景（Final Cut Pro）
npx remotion render ChapterProgressBar --codec=prores --prores-profile=4444 out/progress-bar.mov
```

渲染完成后，在剪辑软件里把文件拖到视频轨道最上层即可。

## Studio 可编辑参数一览

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `barOpacity` | number (0–1) | `0.82` | 进度条整体不透明度 |
| `barHeight` | number (px) | `52` | 进度条高度 |
| `colorFilled` | string (hex) | `#C09070` | 已播放部分颜色 |
| `colorUnfilled` | string (hex) | `#EDE4D4` | 未播放部分颜色 |
| `chapters[n].name` | string | — | 章节显示名称 |
| `chapters[n].startTime` | string `m:ss` | — | 章节起始时间戳 |
| `chapters[n].endTime` | string `m:ss` | — | 章节结束时间戳 |

在 Studio 的 Props 面板中：
- 增删章节：点击数组旁的 **+** / **−** 按钮
- 修改后视频总时长**自动重新计算**，无需手动改代码
- 支持 `Cmd+Z` 撤销

## 同时输出 YouTube 章节格式

生成进度条后，顺便把章节整理成 YouTube 描述格式：

```
0:00 章节一
2:07 章节二
...
```

（YouTube 要求第一个时间戳必须是 `0:00`）
