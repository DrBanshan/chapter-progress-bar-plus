# 📊 视频进度条动画 Plus · Chapter Progress Bar Plus

**在 Remotion Studio 中实时编辑章节进度条** —— 无需改代码，所有参数在浏览器 UI 里直接调整，透明背景，可直接叠加在视频上。

与原版 `chapter-progress-bar` 的区别：**所有参数（章节名称、时间戳、数量、透明度、高度）均可在 Remotion Studio 右侧 Props 面板实时编辑**，修改即时生效，视频总时长自动重算。

---

## 功能 · Features

- **Studio 实时编辑**：章节名称、`startTime` / `endTime`、章节数量、透明度、高度——全部在 UI 里改，不碰代码
- **时间戳格式**：直接输入 `m:ss`（如 `4:55`、`11:19`），清晰直观
- **自动计算时长**：`calculateMetadata` 根据最大 `endTime` 自动更新 `durationInFrames`
- **透明背景**：导出 WebM 或 ProRes，直接叠加在视频上
- **米色配色**：暖棕 + 浅米，低调不抢戏
- **横/竖屏**：支持 16:9 和 9:16

---

## 文件结构 · File Structure

```
src/
├── schema.ts              ← Zod 参数定义（章节数组 + 样式参数）
├── ChapterProgressBar.tsx ← 主渲染组件
├── Root.tsx               ← Composition 注册（schema + calculateMetadata + defaultProps）
└── package.json
```

---

## Studio 可编辑参数

| 参数 | 说明 |
|------|------|
| `barOpacity` | 不透明度（0–1） |
| `barHeight` | 进度条高度（px） |
| `colorFilled` | 已播放颜色（hex，默认 `#C09070`） |
| `colorUnfilled` | 未播放颜色（hex，默认 `#EDE4D4`） |
| `chapters[].name` | 章节名称 |
| `chapters[].startTime` | 起始时间戳，格式 `m:ss` |
| `chapters[].endTime` | 结束时间戳，格式 `m:ss` |

---

## 渲染输出 · Output

```bash
# WebM 透明背景（通用，DaVinci / Premiere / 剪映）
npx remotion render ChapterProgressBar --codec=vp8 out/progress-bar.webm

# ProRes 4444 透明背景（Final Cut Pro）
npx remotion render ChapterProgressBar --codec=prores --prores-profile=4444 out/progress-bar.mov
```
