# EduCore · 光合啟途

**开发中 · 离线优先（弱网）· MIT**  
**In development · offline-first for weak networks · MIT**

> 让偏远地区、网络差或很慢的学生也能继续学习；有条件时，再用 AI 帮忙。  
> Help students in remote areas with poor or slow internet keep learning offline, with AI assistance when possible.

[![Status: in development](https://img.shields.io/badge/status-in%20development-yellow.svg)](https://github.com/EnglandTong/educore)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/EnglandTong/educore/blob/main/LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/EnglandTong/educore.svg)](https://github.com/EnglandTong/educore/stargazers)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/EnglandTong/educore/pulls)

这不是已经交付的硬件产品，也不是打磨好的商业发布。仓库里有可运行的软件原型，但整体仍在开发，接口和用法都可能变。

This is not finished hardware, and not a polished product launch. There is a software prototype in this repo; it is still in development and may change.

---

## 🌍 中文 | English

**中文** | [English](#english)

---

## 现在处在什么阶段 | Current status

| 事实 | Fact |
|------|------|
| **还在开发** | The system is still in development. |
| **硬件先放下** | Raspberry Pi / edge-device work is **paused for now** — time is limited; other things come first, then this returns. |
| **为谁做** | Students in remote areas with poor or slow internet, so learning can continue **offline**, with AI help **when it actually works**. |
| **难点（说实话）** | Large models often do **not** run well on small machines. Progress will be step-by-step testing, trying, and optimizing — not overnight. |
| **开源** | **MIT**（README 以前写过 AGPLv3；GitHub About 可能显示过 Other。现已与 MIT 对齐。） |

我们相信：**教育公平，不是给每个孩子一样的东西，而是给每个孩子最适合他们的东西。**  
Educational equity means giving every child what they need, not the same thing for everyone.

---

## 想解决什么问题 | The problem

很多孩子不是不想学，而是网不稳定、老师顾不过来、身边也没有人把题讲清楚。光合啟途想做的是能在弱网下用的学习基础设施，不是一场产品发布会。

Many students are not unwilling to learn — the network is unreliable, teachers are stretched across grades, and there is nobody nearby to explain. EduCore is trying to be learning infrastructure for weak networks, not a product launch.

| 痛点 | Pain | 方向（多为进行中 / 规划） | Direction (in progress or planned) |
|------|------|--------------------------|-------------------------------------|
| 师资不够 | Too few teachers | 自适应练习 + 条件允许时的 AI 讲解 | Adaptive practice, plus AI explanation when it is feasible |
| 没网 / 弱网 | No or slow internet | 离线优先：先保证能学 | Offline-first: keep learning possible first |
| 家里联系不上 | Parents far from school | 家校同步、学习报告 | Family updates and reports |

**微信小程序每周报告：规划中，尚未实现。** 仓库里没有小程序代码。  
**WeChat mini program weekly reports: planned, not shipped.** There is no mini-program in this repository.

**树莓派 + 本地大模型「完全离线基站」：不是已完成交付物。** 硬件路径目前暂停。  
**Raspberry Pi + on-device LLM as a full offline station: not a shipped deliverable.** Hardware work is paused.

---

## 核心理念 | Principles

这些是设计方向，不是「已经全部做到」的功能清单。

These are design directions, not a claim that everything below is finished.

| 方向 | Direction | 说明 |
|------|-----------|------|
| 科学自适应 | Adaptive practice | 仓库里有 BKT / IRT / SM-2 等算法原型，仍在打磨 |
| 温暖、不评判 | Warm, non-judgmental | 反馈尽量鼓励，避免羞辱 |
| 离线优先 | Offline-first | 目标是弱网也能学；PWA / 本地同步仍是原型，不能当成已完成的离线产品 |
| 一起参与 | Students, parents, teachers, volunteers | 长期想连在一起；不少角色能力还在规划或很薄 |

---

## 技术方向 | Architecture (intent)

仓库是 **pnpm + Turborepo** 单体仓库：Fastify API、React 前端、共享算法包。AI 侧有一层模型抽象，**设想中的**降级顺序是：

```
本地 Ollama（树莓派 / 小机器）→ 云端 Ark API → 规则引擎
Local Ollama (Pi / small device) → Cloud Ark API → Rule engine
```

这是目标形态，不是已经在真实教室里验证过的硬件方案。小机器跑大模型会很吃力，需要以后一步步试。

This is the intended shape, not a classroom-proven hardware setup. Small machines will struggle with large models; that work will be gradual.

更细的模块划分见 [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)（其中部分描述仍偏理想，请以本 README 的阶段说明为准）。

| 层级 | Layer | 当前仓库里大致是 |
|------|-------|------------------|
| 后端 | Backend | Fastify + TypeScript + MongoDB + Redis |
| 前端 | Frontend | React 19 + Vite + Tailwind CSS + Zustand |
| 算法 | Algorithms | TypeScript（BKT、IRT、SM-2 等） |
| AI | AI | 提供者抽象；Ollama / Ark / 规则兜底（能力视环境和配置而定） |
| 单体仓库 | Monorepo | Turborepo + pnpm workspaces |

---

## 快速开始 | Quick Start（WIP，可能会变）

本地软件路径存在真实脚本（`pnpm`、`.env.example`、`docker/`）。下面步骤**可能随时改**，跑不通是预期内的，请对照 [CONTRIBUTING.md](CONTRIBUTING.md)、[AGENTS.md](AGENTS.md) 和 `docs/`。

The local software path has real scripts (`pnpm`, `.env.example`, `docker/`). Treat this as **WIP** — it may change or fail.

**硬件 / 树莓派部署：已暂停，请先不要按「成品基站」去装。**  
**Pi / edge deploy: paused. Do not treat this as a finished station.**

### 需要 | Requirements

- Node.js 20+
- pnpm 9+（`packageManager` 现为 `pnpm@9.15.0`）
- 本机或容器里的 MongoDB、Redis（见 `.env.example` 默认 `localhost`）

### 软件开发（本机） | Software (local)

```bash
git clone https://github.com/EnglandTong/educore.git
cd educore

cp .env.example .env
# 前端可选：对照 apps/web/.env.example

pnpm install

# MongoDB :27017 与 Redis :6379 需要已在运行。
# 若只用 Docker 起数据库（不是整套生产栈）：
docker run -d --name educore-mongo -p 27017:27017 mongo:7
docker run -d --name educore-redis -p 6379:6379 redis:7-alpine

pnpm dev
```

常见端口：API `4000`，Web `5173`（以实际终端输出为准）。可选：`pnpm typecheck`、`pnpm test`。

### Docker 整栈 | Full compose

`docker/docker-compose.yml` 带 API、Web、Mongo、Redis，偏生产向。先复制 `docker/.env.example`。这条路径同样是 WIP，**不保证一次就能跑起来**。

```bash
cp docker/.env.example docker/.env
# 填入 MONGO_USER、MONGO_PASSWORD、JWT_SECRET、CORS_ORIGIN
docker compose -f docker/docker-compose.yml --env-file docker/.env up --build
```

硬件成本与板子调研（仅记录，不是在售套件）：[docs/HARDWARE-COST-ANALYSIS.md](docs/HARDWARE-COST-ANALYSIS.md)。

---

## 如何参与 | How to contribute

欢迎修文档、报 bug、写测试、补内容。请先读 [CONTRIBUTING.md](CONTRIBUTING.md)。

硬件捐赠、树莓派基站等：**等硬件工作恢复以后再谈**；现在不是在募集「已经能装进教室的套件」。

Hardware donations / Pi stations: **later**, when that work resumes. This is not a campaign for classroom-ready kits today.

---

## 文档 | Docs

| 文档 | 说明 |
|------|------|
| [CONTRIBUTING.md](CONTRIBUTING.md) | 贡献与本地开发 |
| [AGENTS.md](AGENTS.md) | 给协作 agent 的仓库规则（规划 / 验收循环） |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | 架构与模块（设计文档，含尚未落地的部分） |
| [docs/PROJECT_ROADMAP.md](docs/PROJECT_ROADMAP.md) | 路线图（内部里程碑记录，不等于产品已完成） |
| [docs/HARDWARE-COST-ANALYSIS.md](docs/HARDWARE-COST-ANALYSIS.md) | 硬件调研（路径已暂停） |
| [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) | 行为准则 |
| [docs/](docs/) | 其余设计与过程文档 |

公开介绍若和本 README 冲突，**以这里的阶段说明为准**。

If another doc conflicts with this page, **this status section wins**.

---

## 许可证 | License

**MIT** — 见 [LICENSE](LICENSE)。

以前 README 写的是 AGPLv3；现按维护者意向改为 MIT，不再使用双许可叙述。

Previously the README said AGPLv3. It is MIT now, as a single license.

---

*让网络不好的地方，学习也可以继续。*  
*So learning can continue where the network cannot.*

---

## English

# EduCore

**In development. Offline-first for weak networks. MIT.**

EduCore (光合啟途) is an open-source learning project for students in remote areas with poor or slow internet. The aim is to keep studying possible **offline**, and to use AI **when it actually runs well enough** — not to promise a finished tutor on every small device.

- **Not a shipped hardware product.** Pi / edge work is paused; the owner is focusing on other things first.
- **Not a polished commercial launch.** The repo is a prototype (API, web app, algorithm packages). Expect breakage and change.
- **Honest constraint:** large models may not run well on small machines. Next steps are testing, trying, and optimizing — slowly.
- **WeChat mini program:** planned, not in this repo.
- **License:** MIT.

### Quick Start

See [Quick Start](#快速开始--quick-startwip可能会变) above. It is WIP. Hardware instructions are paused.

### Contribute

[CONTRIBUTING.md](CONTRIBUTING.md). Questions and small fixes are welcome.

Thank you for caring about whether learning still works when the network does not.
