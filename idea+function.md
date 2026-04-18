# Markdown 1：完整 Idea

# London Cuts

## 一句话版本

London Cuts 是一个用生成式 AI 将伦敦照片、地点、时间和短故事转化为多媒介叙事作品的交互平台。

## 核心概念

用户上传一组 **London memory set**，系统会自动把这些素材组织成一条结构化的城市叙事路线，并生成三种不同的媒介版本：

* **Punk**：更像 zine、拼贴、街头文化叙事
* **Fashion**：更像 editorial、lookbook、杂志式版面
* **Cinema**：更像 scene card、镜头顺序、字幕式叙事

同一组内容最终会产出：

* 一个可交互的城市故事网站
* 一个带路线结构的 London atlas
* 一组章节式 stop 页面
* 可生成、可导出、可打印的明信片 artifact

## 项目想解决的问题

现在大多数城市记忆内容的最终形态都比较单一，通常只会变成：

* 相册
* 社交媒体帖子
* 普通 blog
* 地图打点页面

London Cuts 的目标是把这些素材重新定义为 **可被 AI 组织、转译、编排和出版的媒介对象**。

用户上传的不是“几张图”，而是一组城市记忆；系统输出的也不是“一个网页”，而是一套可以被切换、被体验、被导出的作品系统。

## 用户输入

用户输入一组 **London memory set**，建议包括：

### 必要输入

* 照片
* 项目标题
* 简短项目描述

### 推荐输入

* 每个地点 1–3 句短故事
* 地点名
* 时间或时间段
* mood tag

### 可选输入

* 一句对话
* 一句感受
* 一小段语音 memo
* 这组内容更偏向哪种媒介模式

## 用户输出

系统最终生成：

1. **Public Story Website**

   * 首页
   * 城市 atlas
   * 章节式 stop 页面
   * 多模式浏览

2. **Three Narrative Modes**

   * Punk 版
   * Fashion 版
   * Cinema 版

3. **Postcard Artifacts**

   * 正面图像
   * 背面地点 / 日期 / 摘句 / QR
   * PNG / PDF 导出

4. **Share Assets**

   * 项目封面图
   * stop 分享卡
   * public link

## AI 在项目中的位置

AI 主要承担四件事：

### 1. 解析

读取 EXIF、时间、GPS、图片方向和尺寸。

### 2. 组织

把素材聚类成 4–6 个 stops，构成 route。

### 3. 转译

把同一组内容包装成 Punk / Fashion / Cinema 三种 narrative variants。

### 4. 出版

从同一套 canonical content model 生成网页和 postcard 等 artifact。

## 为什么它适合赛道一

这个项目和赛题的契合点非常清晰：

* 它把 **London identity** 直接变成了产品结构：punk、fashion、cinema
* 它让 AI 参与 **内容结构生成、媒介转译和 artifact 出版**
* 它把内容从单一网页扩展成 **可切换、可交互、可导出的作品系统**
* 它天然适合做成 **interactive art + product prototype** 的混合形态

## 演示时最抓人的一句话

**One city, three cuts.**
Upload a London memory set, and AI turns it into a story atlas, three narrative modes, and collectible postcards.

---

# Markdown 2：完整功能实现 / 产品实现说明

# London Cuts — Functional Spec

## 1. 产品结构

整个产品分成两层：

### A. 前台作品层

给评委、观众和访问者看的，重点是体验和视觉表达。

包括：

* Landing page
* Atlas page
* Chapter / Stop page
* Postcard page
* Share page

### B. 后台创作层

给创作者用，负责上传、组织、编辑和发布。

包括：

* Create Project
* Upload & Cluster
* Story Editor
* Publish / Export

---

## 2. 核心流程

## Flow 1：创建项目

用户进入后台后，新建一个 London memory project。

输入：

* project title
* one-line description
* cover preference（可选）

输出：

* 一个新的草稿项目

---

## Flow 2：上传 memory set

用户上传照片和可选文字。

### 上传内容

* 照片
* 文字片段
* 地点（可选）
* 时间（可选）

### 系统自动处理

* 提取 EXIF
* 提取 GPS
* 提取时间
* 判断图片方向与尺寸
* 自动排序
* 自动聚类

### 结果

系统生成 4–6 个建议 stops，并给出 route 初稿。

---

## Flow 3：Review & Cluster

用户进入 stop review 页面，检查自动分组结果。

### 页面功能

* 查看所有已上传照片
* 查看系统建议的 stops
* 拖拽图片到不同 stop
* 修改 stop 名称
* 修改地点
* 修正地图 pin
* 选择 stop cover image

### 目标

把自动分组结果变成可发布的结构化旅程。

---

## Flow 4：Story Editor

这是创作者最关键的工作区。

### 用户可以编辑

* project title
* stop title
* stop place
* stop time
* short story beat
* quote / excerpt
* cover image
* stop order

### 系统生成

系统为每个 stop 预生成三套 narrative packaging：

* punk variant
* fashion variant
* cinema variant

### 用户可以做的事情

* 审核 variant 标题和摘句
* 预览三种模式
* 微调文字
* 确认最终发布版本

---

## Flow 5：Publish

用户点击 publish 后，系统生成 public-facing site。

### 发布生成的内容

* public landing
* project atlas
* stop pages
* mode switch data
* postcard templates
* share assets

### 发布方式

* local preview
* deployed link

---

## Flow 6：Artifact Generation

用户可以从项目、stop 或图片生成 postcard。

### postcard 正面

* 大图
* edition label
* mode label

### postcard 背面

* 地点
* 日期
* 故事摘句
* address area
* stamp area
* QR code

### 导出

* PNG
* PDF

---

## 3. 前台完整界面

## A. Landing Page

### 目标

建立项目气质，让用户迅速理解 “One city, three cuts”。

### 页面模块

* top nav
* hero image / collage
* project title
* subtitle
* three mode preview cards
* CTA: Explore the Story
* CTA: Create a Memory Set
* postcard preview strip

---

## B. Atlas Page

### 目标

作为整个项目的总览入口。

### 页面布局

* 左侧：stop list + short excerpts
* 右侧：stylized London atlas
* 顶部：mode switch
* 底部：project summary / current route status

### atlas 功能

* route line
* stop markers
* hover preview
* click to open chapter
* mode-aware styling

### mode 变化

#### Punk

* 粗粝路线
* 更强的 collage 感
* 不规则标签

#### Fashion

* 极简标签
* 大留白
* 更 editorial 的节奏

#### Cinema

* scene number
* 更明显的 route progression
* 更像分镜入口

---

## C. Stop / Chapter Page

### 目标

承载单个 stop 的主叙事体验。

### 页面模块

* hero image
* stop title
* place + time
* short story beat
* supporting gallery
* next / previous stop
* route progress
* make postcard button

### mode 变化

#### Punk

* 断裂 grid
* zine 风格标题
* raw quote block

#### Fashion

* 极简版心
* 大图优先
* 少量高质量文字

#### Cinema

* scene card 样式
* subtitle / voice-over 感
* more linear progression

---

## D. Postcard Page

### 目标

把数字叙事转成实体 artifact。

### 页面布局

* 左：front preview
* 右：back preview
* mode selector
* quote selector
* export buttons

### 功能

* 选择当前图片或当前 stop
* 自动生成背面文本
* 生成 QR
* 导出 PNG/PDF

---

## E. Share Page

### 目标

便于评委、观众和朋友访问与传播。

### 页面模块

* project preview image
* share summary
* public URL
* QR code
* one-click copy

---

## 4. 后台完整界面

## A. Create Project

### 模块

* title input
* description input
* start button

---

## B. Upload & Cluster

### 模块

* drag & drop upload
* upload list
* metadata parse status
* cluster suggestion panel
* photo-to-stop assignment
* re-cluster button
* continue button

---

## C. Story Editor

### 页面布局

* 左：stop list
* 中：editor form
* 右：live preview

### 字段

* stop title
* place
* time
* short story
* quote
* cover image
* order

### 交互

* save draft
* generate variants
* preview public site
* publish

---

## D. Publish & Export

### 模块

* site preview
* postcards generated
* share assets generated
* publish link
* export controls

---

## 5. 数据模型

## Core Entities

* Project
* PhotoAsset
* Stop
* StoryBeat
* RouteSegment
* NarrativeVariant
* Artifact
* Theme

## Key Notes

### Project

整个 London memory set 的容器。

### PhotoAsset

存原始图片、元数据、解析状态和归属 stop。

### Stop

一个结构化场景节点，包含地点、时间、图片、故事。

### StoryBeat

每个 stop 的核心文字段落。

### RouteSegment

stop 与 stop 之间的顺序关系。

### NarrativeVariant

同一内容在不同模式下的包装结果。

字段建议包括：

* mode
* alt_title
* alt_quote
* layout_preset
* caption_style
* motion_preset

### Artifact

postcard、share image 等导出对象。

---

## 6. 技术实现建议

## 推荐技术栈

* Next.js App Router
* TypeScript
* Tailwind CSS
* Framer Motion
* MapLibre 或轻量地图组件
* EXIF parsing library
* server-side export pipeline
* SQLite / Prisma 或轻量 JSON-first storage

## 架构建议

### 前台

* `/` landing
* `/projects/[slug]`
* `/projects/[slug]/atlas`
* `/projects/[slug]/stops/[stopId]`
* `/projects/[slug]/postcards/[artifactId]`

### 后台

* `/studio`
* `/studio/projects/new`
* `/studio/projects/[id]/upload`
* `/studio/projects/[id]/editor`
* `/studio/projects/[id]/publish`

### 生成策略

比赛版建议把 AI 生成的 variants 放在：

* upload 后生成
* publish 前确认
* public 端直接读取

这样更稳，demo 更快。

---

## 7. MVP 边界

## 必须完成

* 首页
* atlas
* 4–6 个 stop
* 三模式切换
* upload + metadata parse
* stop clustering review
* story editor
* postcard export
* deployed demo

## 加分项

* mode-specific share card
* QR 回链
* compare mode
* 移动端适配

## 后续版本

* remix lab
* mini-zine export
* voice memo
* multi-project
* multi-user

---

## 8. 5 分钟 demo 路径

1. 打开 Landing page
2. 进入 Atlas
3. 点开一个 Stop
4. 切换 Punk / Fashion / Cinema
5. 展示后台 Upload & Cluster
6. 展示 Story Editor
7. 点击 Generate Postcard
8. 导出 postcard 并展示 QR 回链

---

# Markdown 3：给多-agent 系统的提示词

## A. 总协调 Prompt（适合 Claude Code / Codex 主线程）

你可以把下面这段当作主协调 agent 的系统任务：

> 你是 London Cuts 项目的主协调 agent。
> 目标是在 hackathon 时间约束下，构建一个完整、可演示、可部署的 AI-native 城市叙事作品系统。
>
> 项目核心：
> 用户上传一组 London memory set（照片为主，可附地点、时间和简短故事），系统自动组织成 4–6 个 stops，并生成一个 public-facing 的 story atlas。
> 同一组内容要支持三种 narrative modes：Punk、Fashion、Cinema。
> 系统还要支持 postcard artifact 的生成与导出。
>
> 你的任务：
>
> 1. 检查代码库与资源
> 2. 定义最小可赢的 MVP scope
> 3. 建立 canonical data model
> 4. 协调并行子 agent
> 5. 集成 landing / atlas / chapter / upload / editor / postcard
> 6. 运行验证、部署、整理 demo 路径
>
> 产品必须包含：
>
> * Landing page
> * Atlas page
> * Stop / Chapter page
> * Upload & Cluster page
> * Story Editor
> * Postcard generation/export
>
> 实现原则：
>
> * 先完成可跑闭环，再做增强
> * narrative variants 尽量预生成，不依赖脆弱的现场实时生成
> * public 端优先稳定和视觉完成度
> * 只有一个主线程负责最终集成
> * 子 agent 只做独立任务，不要多人同时改同一模块
>
> 最终交付：
>
> * 一个可部署的 vertical slice
> * 清楚的数据模型
> * 清楚的页面路由
> * 可演示的 upload → organize → edit → publish → postcard 闭环
> * 简明的 README / run instructions / demo notes

---

## B. Claude Design Prompt（先做设计与 handoff）

官方说明里，Claude Design 适合先做 prototype、flow 和 pitch deck，并能 handoff 给 Claude Code。 ([Anthropic][1])

你可以直接这样喂：

> 你正在为一个名为 London Cuts 的项目做完整设计。
>
> 项目是一个 AI-native 的城市叙事平台。
> 输入是一组 London memory set：照片、地点、时间、短故事。
> 输出是：
>
> * 一个 story atlas
> * 三种 narrative modes：Punk / Fashion / Cinema
> * collectible postcards
>
> 请完成以下设计任务：
>
> 1. 定义整体视觉系统
> 2. 设计首页、atlas、chapter、postcard、creator upload/editor 五个核心界面
> 3. 清楚区分三种 mode 的 layout grammar、typography、image treatment、motion rhythm
> 4. 生成一套能 handoff 给工程实现的设计说明
> 5. 给出最适合 hackathon MVP 的设计方向
>
> 设计要求：
>
> * London-specific
> * editorial
> * premium
> * cinematic
> * image-first
> * buildable in React + Tailwind
>
> 交付内容：
>
> * 核心设计方向
> * 关键页面原型
> * 组件层级
> * 响应式规则
> * handoff notes

---

## C. 多-agent 拆分建议

### 你最适合的并行结构

如果是 Claude Code：

* 用 `.claude/agents/` 放 project-specific subagents
* 用清晰的 `description` 触发自动委派
* 编辑型 agent 用隔离工作树
* 用 `CLAUDE.md` 固化全局规则
  这些都是官方推荐的工作流。 ([Claude API Docs][2])

如果是 Codex：

* 主线程 + 最多 6 个直接子任务
* 不做递归 fan-out
* `max_threads` 默认 6，`max_depth` 默认 1
  这也是官方配置说明。 ([OpenAI Developers][3])

---

## D. 子 Agent Prompt 1：Repo / Architecture

> 你是 London Cuts 项目的 repo 与架构分析 agent。
>
> 你的任务：
>
> * 检查当前仓库结构、依赖、脚手架、可复用模块
> * 判断应该在现有项目上迭代，还是快速搭一个新骨架
> * 识别风险：路由、图片处理、部署、导出、地图
> * 给出最小可行 build order
>
> 输出：
>
> 1. 当前 repo 状态
> 2. 推荐技术路径
> 3. 风险列表
> 4. 实施顺序
>
> 只读优先，除非主线程明确让你改文件。

---

## E. 子 Agent Prompt 2：Experience / IA

> 你是 London Cuts 的体验与信息架构 agent。
>
> 请定义：
>
> * 用户旅程
> * 页面层级
> * Landing → Atlas → Chapter → Postcard 的导航逻辑
> * Creator workflow：Create → Upload → Cluster → Edit → Publish
> * Punk / Fashion / Cinema 三种模式分别在：标题、排版、图片、动画、caption 上怎么变化
>
> 输出：
>
> 1. IA tree
> 2. 关键 user flows
> 3. mode behavior spec
> 4. 页面优先级
> 5. 需要避免的 UX 问题
>
> 目标是让产品既好看又能在 hackathon 时间里完成。

---

## F. 子 Agent Prompt 3：Public UI / Story Atlas

> 你是 London Cuts 的前台体验实现 agent。
>
> 请构建：
>
> * Landing page
> * Atlas page
> * Stop / Chapter page
> * 全局 mode switch
>
> 要求：
>
> * Atlas 是带 route 的 London story overview
> * Chapter 是 stop-based narrative page
> * mode switch 会真正改变 layout grammar，而不仅是换颜色
> * 保持 React + Tailwind 可维护性
> * 保持 demo 稳定
>
> 输出：
>
> * 关键页面组件
> * 交互状态
> * 页面集成说明

---

## G. 子 Agent Prompt 4：Upload / Metadata / Story Editor

> 你是 London Cuts 的 creator workflow agent。
>
> 请实现：
>
> * project creation
> * photo upload
> * metadata extraction
> * stop clustering suggestion
> * manual stop review
> * story editor
>
> 数据模型至少支持：
>
> * Project
> * PhotoAsset
> * Stop
> * StoryBeat
> * NarrativeVariant
> * Artifact
>
> 设计原则：
>
> * 人写的故事是 source of truth
> * AI suggestions 可编辑
> * happy path 清楚
> * 先把 photo + text 做稳
>
> 输出：
>
> * creator flow 页面
> * 数据结构
> * integration notes

---

## H. 子 Agent Prompt 5：Artifact / Postcard

> 你是 London Cuts 的 artifact generation agent。
>
> 请实现：
>
> * postcard front
> * postcard back
> * location / date / excerpt / QR composition
> * PNG export
> * PDF export
>
> 要求：
>
> * 来自同一个 canonical content model
> * 设计与当前 mode 一致
> * 导出是真实可用的
> * 可作为未来 zine / poster 的基础
>
> 输出：
>
> * postcard templates
> * export pipeline
> * required data fields
> * limitations

---

## I. 子 Agent Prompt 6：QA / Release / Demo

> 你是 London Cuts 的 QA 与发布检查 agent。
>
> 请检查：
>
> * Landing
> * Atlas
> * Chapter
> * Upload
> * Stop review
> * Story editor
> * Postcard export
> * 移动端基础适配
> * 关键 bug
>
> 输出：
>
> 1. 发现的问题
> 2. 已修复的问题
> 3. 剩余风险
> 4. demo checklist
>
> 优先做最小、最有效的修复，确保现场稳定。

---

## J. `CLAUDE.md` 建议内容

因为官方文档写明 `CLAUDE.md` 会在会话开始时加载，非常适合放项目规则。 ([Claude API Docs][4])

你可以放这段：

> # London Cuts
>
> ## Mission
>
> Build a hackathon-ready AI-native interactive media product that turns London memory sets into a story atlas, three narrative modes, and collectible postcards.
>
> ## MVP
>
> * landing page
> * atlas page
> * stop/chapter page
> * upload + cluster review
> * story editor
> * postcard export
> * deployed demo
>
> ## Design Priorities
>
> * editorial
> * premium
> * image-first
> * London-specific
> * mode switching must alter media grammar
>
> ## Engineering Priorities
>
> * complete the happy path first
> * precompute narrative variants when possible
> * keep data model clean
> * keep public demo stable
>
> ## Guardrails
>
> * one integrator owns the final branch
> * avoid simultaneous edits on the same module
> * artifact generation must be real
> * story text remains editable and human-led

---

## K. 最后的并行策略建议

### 如果你用 Claude 体系

* **Claude Design**：先出视觉、原型、deck、handoff
* **Claude Code 主线程**：控 repo、控 scope、做最终集成
* **Claude Code subagents**：分出去做 architecture、public UI、creator flow、artifact、QA
  这些流程和官方文档描述是对齐的。 ([Anthropic][1])

### 如果你用 Codex

* 保持 **1 个主协调 + 4–6 个直接子任务**
* 不做 deeper recursion
* 优先拆成：architecture、public UI、creator flow、artifact、QA
  这最贴合 Codex 当前的默认并发配置。 ([OpenAI Developers][3])


[1]: https://www.anthropic.com/news/claude-design-anthropic-labs?utm_source=chatgpt.com "Introducing Claude Design by Anthropic Labs"
[2]: https://docs.anthropic.com/en/docs/claude-code/sub-agents?utm_source=chatgpt.com "Create custom subagents - Claude Code Docs"
[3]: https://developers.openai.com/codex/subagents?utm_source=chatgpt.com "Subagents – Codex"
[4]: https://docs.anthropic.com/en/docs/claude-code/memory?utm_source=chatgpt.com "How Claude remembers your project - Claude Code Docs"
