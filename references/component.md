# ChapterProgressBar Plus — 组件参考

## 文件结构

```
src/
├── schema.ts              ← Zod schema：ProgressBarSchema / ChapterSchema / parseTime
├── ChapterProgressBar.tsx ← 主组件，接收 ProgressBarProps
├── Root.tsx               ← Composition 注册
└── package.json
```

---

## Schema 参数（`schema.ts`）

| 字段 | 类型 | 说明 |
|------|------|------|
| `barOpacity` | `number` 0–1 | 进度条整体不透明度 |
| `barHeight` | `number` px | 进度条高度 |
| `colorFilled` | `string` hex | 已播放部分颜色 |
| `colorUnfilled` | `string` hex | 未播放部分颜色 |
| `chapters[].name` | `string` | 章节名称 |
| `chapters[].startTime` | `string` `m:ss` | 起始时间戳 |
| `chapters[].endTime` | `string` `m:ss` | 结束时间戳 |

`parseTime(t: string): number` — 将 `"m:ss"` 转为秒数。

---

## Root.tsx 关键点

- `schema={ProgressBarSchema}` — 启用 Studio Props 编辑面板
- `defaultProps` — 填入实际章节数据
- `calculateMetadata` — 自动从最大 `endTime` 计算 `durationInFrames`，**不需要手动设置帧数**

```ts
calculateMetadata={({ props }) => {
  const totalS = Math.max(...props.chapters.map((ch) => parseTime(ch.endTime)));
  return { durationInFrames: Math.max(1, Math.round(totalS * 30)) };
}}
```

---

## 配色常量（在 `ChapterProgressBar.tsx` 中修改）

| 常量 | 默认值 | 说明 |
|------|--------|------|
| `colorFilled` prop | `#C09070` | 已播放（暖棕）— 在 Studio Props 面板修改 |
| `colorUnfilled` prop | `#EDE4D4` | 未播放（浅米）— 在 Studio Props 面板修改 |
| `COLORS.divider` | `#CBBFA8` | 分隔线 |
| `COLORS.text` | `#4A3220` | 章节文字 |

---

## 渲染命令

```bash
# WebM 透明背景（通用）
npx remotion render ChapterProgressBar --codec=vp8 out/progress-bar.webm

# ProRes 4444 透明背景（Final Cut / DaVinci）
npx remotion render ChapterProgressBar --codec=prores --prores-profile=4444 out/progress-bar.mov
```
