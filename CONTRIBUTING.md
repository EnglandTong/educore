# 贡献指南 | Contributing Guide

🌍 **中文** | [English](#english)

---

## 中文

欢迎参与 EduCore（光合啟途）项目！无论你是学生、工程师、老师，还是只想为乡村教育出一份力的朋友，我们都非常欢迎你的贡献。

### 🤝 你可以怎么贡献？

#### 1. 🐛 报告 Bug
- 发现了问题？请开一个 [Issue](https://github.com/yourname/educore/issues)
- 请包含：复现步骤、预期行为、实际行为、环境信息

#### 2. ✨ 提交功能建议
- 有好的想法？欢迎提 Issue 讨论
- 越具体越好，最好说明为什么这个功能重要

#### 3. 💻 提交代码
- 修复 Bug、新增功能、优化性能都欢迎
- 请先看下面的开发指南

#### 4. 📚 内容贡献
- 编写练习题
- 写知识点讲解
- 翻译文档
- 改善用户体验文案

#### 5. 🎨 设计贡献
- UI/UX 建议
- Logo、宣传素材
- 网站设计

#### 6. 💰 其他方式
- 捐赠硬件（树莓派/开发板）
- 把项目介绍给需要的学校
- 在你的社区分享这个项目

---

### 🛠️ 开发指南

#### 环境要求
- Node.js 20+
- pnpm 9+
- Docker（用于本地 MongoDB + Redis）

#### 本地开发

```bash
# 克隆代码
git clone https://github.com/yourname/educore.git
cd educore

# 安装依赖
pnpm install

# 启动数据库（需要 Docker）
docker-compose up -d

# 类型检查
pnpm typecheck

# 运行测试
pnpm test
```

#### 提交 PR 的流程

1. **Fork 本仓库**
2. **创建你的功能分支** (`git checkout -b feature/AmazingFeature`)
3. **提交你的改动** (`git commit -m 'Add some AmazingFeature'`)
4. **推送到分支** (`git push origin feature/AmazingFeature`)
5. **开一个 Pull Request**

#### 代码规范

- 我们使用 TypeScript，尽量写类型安全的代码
- 写清晰的注释，特别是复杂算法部分
- 新功能请附带测试
- 提交前请确保 `pnpm typecheck` 和 `pnpm test` 都通过

---

### 💡 新手友好的任务

刚接触项目？可以从这些开始：

- 🔖 **Good First Issue** — 标签为"good first issue"的 Issue
- 📝 文档翻译、错别字修正
- 🎨 UI 小优化、动画效果
- 🐛 简单的 Bug 修复

不知道从哪里开始？开个 Issue 说"我想帮忙，请问可以从哪里开始？"，我们会帮你找合适的任务。

---

### 📜 行为准则

请阅读并遵守我们的 [Code of Conduct](CODE_OF_CONDUCT.md)。

简单来说：
- 互相尊重，友善讨论
- 欢迎不同背景的人
- 耐心解答问题
- 我们是做公益的，不要吵架

---

### ❓ 有问题？

开 Issue 或者发邮件给维护者，我们会尽快回复。

---

### 🙏 感谢

每一份贡献，无论大小，都在让乡村教育变得更好一点。感谢你！

---

## English

Welcome to the EduCore project! We welcome contributions from everyone — whether you're a student, engineer, teacher, or anyone who wants to help rural education.

### 🤝 How Can You Contribute?

#### 1. 🐛 Report Bugs
- Found a problem? Open an [Issue](https://github.com/yourname/educore/issues)
- Include: Steps to reproduce, expected behavior, actual behavior, environment info

#### 2. ✨ Suggest Features
- Have a great idea? Open an Issue to discuss
- Be specific, explain why this feature matters

#### 3. 💻 Submit Code
- Bug fixes, new features, performance improvements — all welcome
- See development guide below

#### 4. 📚 Content Contribution
- Write exercises
- Write knowledge explanations
- Translate documentation
- Improve UX copy

#### 5. 🎨 Design Contribution
- UI/UX suggestions
- Logo, promotional materials
- Website design

#### 6. 💰 Other Ways
- Donate hardware (Raspberry Pi / dev boards)
- Introduce the project to schools that need it
- Share the project in your community

---

### 🛠️ Development Guide

#### Requirements
- Node.js 20+
- pnpm 9+
- Docker (for local MongoDB + Redis)

#### Local Development

```bash
# Clone the repo
git clone https://github.com/yourname/educore.git
cd educore

# Install dependencies
pnpm install

# Start database (requires Docker)
docker-compose up -d

# Type check
pnpm typecheck

# Run tests
pnpm test
```

#### Pull Request Process

1. **Fork the repo**
2. **Create your feature branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit your changes** (`git commit -m 'Add some AmazingFeature'`)
4. **Push to the branch** (`git push origin feature/AmazingFeature`)
5. **Open a Pull Request**

#### Code Standards

- We use TypeScript — write type-safe code
- Write clear comments, especially for complex algorithms
- Include tests for new features
- Make sure `pnpm typecheck` and `pnpm test` pass before submitting

---

### 💡 Good for New Contributors

New to the project? Start here:

- 🔖 **Good First Issue** — Issues tagged "good first issue"
- 📝 Documentation translation, typo fixes
- 🎨 Small UI optimizations, animations
- 🐛 Simple bug fixes

Not sure where to start? Open an Issue saying "I want to help, where should I start?" and we'll help you find a task.

---

### 📜 Code of Conduct

Please read and follow our [Code of Conduct](CODE_OF_CONDUCT.md).

In short:
- Be respectful and friendly
- Welcome people from all backgrounds
- Answer questions patiently
- We're here to do good, not argue

---

### ❓ Questions?

Open an Issue or email the maintainers — we'll reply as soon as possible.

---

### 🙏 Thank You

Every contribution, no matter how small, makes rural education a little better. Thank you!
