# EduCore · 光合啟途

> **让每个孩子拥有平等的学习机会 · Equal Learning Opportunities for Every Child**

[![GitHub license](https://img.shields.io/badge/license-AGPLv3-blue.svg)](https://github.com/yourname/educore/blob/main/LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/yourname/educore.svg)](https://github.com/yourname/educore/stargazers)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/yourname/educore/pulls)

---

## 🌍 中文 | English

**中文** | [English](#english)

---

## 🎯 项目是什么？ | What is this project?

### 中文

EduCore（光合啟途）是一个专为乡村教育设计的 **AI 驱动自适应学习平台**。

我们相信：**教育公平，不是给每个孩子一样的东西，而是给每个孩子最适合他们的东西。**

### English

EduCore is an **AI-powered adaptive learning platform** designed specifically for rural education in China.

We believe: **Educational equity means giving every child what they need, not the same thing for everyone.**

---

## 💡 核心理念 | Core Principles

| 🔬 科学自适应 | Science-based Adaptive Learning |
|--------------|--------------------------------|
| 基于 BKT / IRT / SM-2 算法，动态调整题目难度和出现频率 | Dynamically adjusts question difficulty based on BKT/IRT/SM-2 algorithms |

| ❤️ 温暖不评判 | Warm & Non-judgmental |
|--------------|-----------------------|
| 永远不说"你错了"，只说"让我们一起再想想看" — 零压力学习环境 | Never says "you're wrong," only "let's think together" — zero-pressure learning |

| 📶 离线优先 | Offline-first |
|-----------|--------------|
| PWA + 本地大模型，即使没有互联网也能完整使用 | Works fully offline with PWA + on-device LLMs |

| 🏫 全员协同 | Everyone together |
|-----------|------------------|
| 学生 ↔ 家长 ↔ 老师 ↔ 志愿者，一个都不能少 | Students ↔ Parents ↔ Teachers ↔ Volunteers, all connected |

---

## 🚀 我们解决什么问题 | The Problem We're Solving

### 乡村教育的三大痛点 | Three Pain Points in Rural Education

| 痛点 | Pain Point | 我们的解法 | Our Solution |
|------|-----------|-----------|-------------|
| 师资匮乏 | One teacher covers 3-5 grades | AI 老师 24 小时在线，个性化辅导每个孩子 | AI teacher 24/7, personalized for every student |
| 资源贫瘠 | No internet, no textbooks | 树莓派 + 本地大模型，完全离线运行 | Raspberry Pi + local LLM, fully offline |
| 信息断层 | Migrant parents disconnected | 微信小程序推送每周学习报告 | Weekly reports via WeChat Mini Program |

---

## 🛠️ 技术架构 | Architecture

### 三级 AI 降级链 | Three-level AI Fallback Chain

```
本地 Ollama (树莓派) → 云端 Ark API → 规则引擎
Local Ollama (Pi)    → Cloud Ark API  → Rule Engine
```

- **有网时**：云端大模型提供高质量讲解
- **弱网时**：自动切换到本地小模型（Qwen 2.5 1.8B）
- **断网时**：规则引擎兜底，保证学习不中断

### 技术栈 | Tech Stack

| 层级 | Layer | 技术 | Technology |
|------|-------|------|-----------|
| 后端 | Backend | Fastify + TypeScript + MongoDB + Redis |
| 前端 | Frontend | React 19 + Vite + TailwindCSS 4 + Zustand |
| 算法 | Algorithms | TypeScript (BKT, IRT, SM-2) |
| AI 模型 | AI Models | Qwen 2.5, Ollama, Ark API |
| 单体仓库 | Monorepo | Turborepo + pnpm workspaces |

---

## 📊 项目进度 | Project Status

| 阶段 | Phase | 状态 | Status | 完成度 | Progress |
|------|-------|------|--------|--------|----------|
| **Phase 0** · 核心引擎 | Core Engine | ✅ 完成 | Done | 100% |
| **Phase 1** · PWA + 多语言 | PWA + i18n | ✅ 完成 | Done | 100% |
| **Phase 2** · 多科目 + 捐赠 | Multi-subject + Donation | ✅ 完成 | Done | 100% |
| **Phase 3** · 离线终端 | Offline Terminal | 🚧 进行中 | In Progress | ~60% |
| **Phase 4** · 家校协同 | Family-School Sync | ⏳ 待启动 | Planned | 0% |

**当前里程碑：模型抽象层 + 本地大模型集成完成 ✅**
**Current Milestone: Model abstraction layer + local LLM integration complete ✅**

---

## 🌱 为什么叫"光合啟途"？ | Why "光合啟途"?

- **光合 (Light Synthesis)** → 像阳光一样，公平地洒在每个孩子身上
- **啟途 (Path Opening)** → 开启一条通向未来的道路

我们不做"慈善"，我们做"赋能"。
我们不施舍，我们建设基础设施。

We don't do "charity" — we build infrastructure.

---

## 🤝 如何参与 | How to Contribute

| 方式 | Way | 你可以做的 | What you can do |
|------|-----|-----------|----------------|
| **💻 代码贡献** | Code | 前端 / 后端 / AI 算法 / 科目内容 | Frontend / Backend / AI Algorithms / Content |
| **📚 内容创作** | Content | 编写练习题、知识点讲解 | Create exercises and explanations |
| **💰 设备捐赠** | Donation | 赞助一套树莓派基站 | Sponsor a Raspberry Pi station |
| **🗣️ 传播推广** | Outreach | 告诉更多有需要的乡村学校 | Tell rural schools that need it |
| **🧪 测试反馈** | Testing | 帮我们找到 Bug，优化体验 | Find bugs, help improve UX |

详见 [CONTRIBUTING.md](CONTRIBUTING.md)

See [CONTRIBUTING.md](CONTRIBUTING.md) for details.

---

## 📖 文档索引 | Documentation Index

| 文档 | Document | 说明 | Description |
|------|----------|------|------------|
| [ARCHITECTURE.md](docs/ARCHITECTURE.md) | 架构文档 | 系统设计、技术选型、模块划分 | Architecture, tech stack, modules |
| [ROADMAP.md](docs/ROADMAP.md) | 开发路线图 | Phase 0-5 完整计划 | Phase 0-5 full plan |
| [CONTRIBUTING.md](CONTRIBUTING.md) | 贡献指南 | 如何参与项目 | How to contribute |
| [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) | 行为准则 | 社区参与规则 | Community rules |
| [docs/](docs/) | 全部文档 | All documentation |

---

## 📞 联系我们 | Contact Us

> **这不是一个商业项目，这是一个关于可能性的实验。**
>
> **我们想证明：技术和善意结合，真的可以改变一些事情。**

> **This is not a commercial project. This is an experiment in possibility.**
>
> **We want to prove: Technology + Goodwill really can change things.**

---

*🌱 让每个孩子，都能站在同一条起跑线上。*

*🌱 May every child stand on the same starting line.*

---

## English Section

---

# EduCore

Equal Learning Opportunities for Every Child

## What is EduCore?

EduCore is an open-source, AI-powered adaptive learning platform designed specifically for rural education in China. It combines cutting-edge edge AI (Raspberry Pi + local LLMs) with proven learning science (BKT/IRT/SM-2 algorithms) to deliver personalized education to students who need it most.

## Key Features

- **Offline-first**: Works completely without internet using local LLMs on Raspberry Pi
- **Adaptive learning**: Dynamically adjusts difficulty based on student performance
- **Warm, non-judgmental**: Designed to encourage, not criticize
- **Multi-stakeholder**: Connects students, parents, teachers, and volunteers
- **Open source**: 100% open source, community-driven

## Technology

- **Backend**: Fastify + TypeScript + MongoDB + Redis
- **Frontend**: React 19 + Vite + TailwindCSS 4 + Zustand
- **AI**: Qwen 2.5 family + Ollama + Model Provider abstraction layer
- **Hardware**: Raspberry Pi 5 / RK3566 with local LLM inference

## License

This project is licensed under the **GNU Affero General Public License v3.0** — see the [LICENSE](LICENSE) file for details.

**Why AGPLv3?** To ensure any improvements to this project remain open and accessible to everyone, even when run as a cloud service.

---

*Thank you for your interest in making education more equitable for every child.*
