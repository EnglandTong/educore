# 系统架构文档 | Architecture Document

🌍 **中文** | [English](#english)

---

## 中文

## 1. 整体架构概览 | Overall Architecture

EduCore 采用单体仓库（Monorepo）架构，分为后端、前端、共享包三层。

```
┌─────────────────────────────────────────────────────────────┐
│                        前端层 (Frontend)                       │
│  React 19 + Vite + TailwindCSS 4 + Zustand + TanStack Query  │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│                        后端层 (Backend)                        │
│  Fastify + TypeScript + MongoDB + Redis + Model Manager      │
└──────────────────────────────┬──────────────────────────────┘
                               │
        ┌──────────────────────┴──────────────────────┐
        │                                               │
┌───────▼───────┐                           ┌─────────▼────────┐
│   本地 Ollama  │                           │   云端 Ark API    │
│  Qwen 2.5 1.8B │◄────── 降级 Fallback ───►│   Rule Engine     │
│  (树莓派/RK3566)│                           │   (兜底保证可用)  │
└───────────────┘                           └──────────────────┘
```

---

## 2. 核心设计原则 | Core Design Principles

| 原则 | Principle | 说明 | Description |
|------|----------|------|------------|
| **学生优先** | Student First | 所有设计决策优先考虑学生体验 | All decisions prioritize student experience |
| **离线优先** | Offline First | 断网时所有核心功能必须可用 | Core features work without internet |
| **优雅降级** | Graceful Degradation | AI 功能逐级降级，功能不中断 | AI features degrade gracefully |
| **温暖措辞** | Warm Tone | 永远不批评学生，只鼓励 | Never criticize, only encourage |
| **类型安全** | Type Safe | 全栈 TypeScript，端到端类型安全 | Full-stack TypeScript safety |

---

## 3. 后端架构 | Backend Architecture

### 3.1 目录结构 | Directory Structure

```
apps/api/src/
├── modules/
│   ├── ai/                    # AI 模块（核心）
│   │   ├── providers/         # 模型提供者抽象层 ⭐
│   │   │   ├── types.ts       # ModelProvider 接口定义
│   │   │   ├── ollama.ts      # 本地 Ollama 提供者
│   │   │   ├── ark.ts         # 云端 Ark API 提供者
│   │   │   └── manager.ts     # Model Manager（自动降级）
│   │   ├── ai.service.ts      # AI 服务层
│   │   └── ai.routes.ts       # API 路由
│   ├── learning/              # 学习引擎（BKT/IRT/SM-2）
│   ├── heart/                 # 心跳 + 健康检查
│   ├── volunteer/             # 志愿者模块
│   ├── qa/                    # 问答 + 讨论区
│   ├── donation/              # 捐赠模块
│   └── school/                # 学校管理
├── middleware/                # Fastify 中间件
│   ├── auth.ts                # 身份认证
│   ├── requireDb.ts           # 数据库健康检查
│   └── warmErrors.ts          # 温暖错误处理
├── config/                    # 配置
│   ├── env.ts                 # 环境变量
│   └── redis.ts               # Redis 配置
└── utils/                     # 工具函数
```

### 3.2 Model Provider 模式详解 ⭐

这是整个 AI 架构的核心设计：

```typescript
export interface ModelProvider {
  // 生成文本
  generate(prompt: string, options?: GenerateOptions): Promise<string>;
  
  // 对话生成
  chat(messages: ChatMessage[], options?: GenerateOptions): Promise<string>;
  
  // 文本嵌入（用于相似度搜索）
  embeddings(text: string): Promise<number[]>;
  
  // 健康检查
  healthCheck(): Promise<ProviderHealth>;
}
```

**为什么这么设计？**

1. ✅ **可插拔**：新的模型提供者只需要实现这个接口
2. ✅ **可测试**：可以 Mock 整个 Provider 做单元测试
3. ✅ **自动降级**：Model Manager 按优先级 + 健康状态自动切换
4. ✅ **向后兼容**：现有代码完全不需要修改，自动获得新功能

**三级降级链**：
```
Ollama (本地) → Ark API (云端) → Rule Engine (规则兜底)
   速度最快        质量最高        100% 可用
   无网络需求        有网可用        任何情况都能用
```

---

## 4. 前端架构 | Frontend Architecture

### 4.1 目录结构 | Directory Structure

```
apps/web/src/
├── hooks/
│   ├── useAIModels.ts         # AI 模型状态管理 ⭐
│   ├── useLearning.ts         # 学习状态管理
│   └── useOfflineSync.ts      # 离线同步
├── pages/                     # 页面组件
│   ├── student/               # 学生端
│   ├── parent/                # 家长端
│   ├── teacher/               # 老师端
│   └── volunteer/             # 志愿者端
├── components/                # 可复用组件
├── store/                     # Zustand 全局状态
└── utils/                     # 工具函数
```

### 4.2 离线 PWA 架构

```
前端 PWA
├── Service Worker             # 静态资源缓存
├── IndexedDB                  # 学习数据本地存储
└── Sync Queue                 # 离线操作队列
```

**离线工作流**：
1. 学生断网时做题 → 数据存入 IndexedDB
2. 每次操作进入 Sync Queue
3. 恢复网络后自动同步到后端
4. 冲突解决采用"最后写入胜"策略

---

## 5. 学习算法 | Learning Algorithms

### 三大核心算法

| 算法 | 用途 | 说明 |
|------|------|------|
| **BKT** (Bayesian Knowledge Tracing) | 知识点掌握度评估 | 实时计算学生对每个知识点的掌握概率 |
| **IRT** (Item Response Theory) | 题目难度校准 | 根据答题情况动态调整题目难度 |
| **SM-2** | 间隔重复调度 | 优化复习时间点，提升记忆效率 |

---

## 6. 部署架构 | Deployment Architecture

### 6.1 云端部署 | Cloud Deployment

```
                   ┌──────────────┐
                   │   Cloud CDN  │
                   └──────┬───────┘
                          │
                   ┌──────▼───────┐
                   │  Frontend PWA│
                   └──────┬───────┘
                          │
┌─────────────────────────┼─────────────────────────┐
│      VPC 内网           │                         │
│                  ┌──────▼───────┐                 │
│                  │  API Server  │                 │
│                  └──────┬───────┘                 │
│                         │                         │
│              ┌──────────┴──────────┐              │
│              │                      │              │
│        ┌─────▼─────┐         ┌────▼─────┐        │
│        │  MongoDB  │         │   Redis   │        │
│        └───────────┘         └───────────┘        │
│                                                      │
└──────────────────────────────────────────────────────┘
```

### 6.2 离线终端部署 | Offline Terminal Deployment

| 硬件 | 软件 |
|------|------|
| 树莓派 5 8GB / RK3566 | Raspberry Pi OS / Armbian |
| 256GB MicroSD (A2) | Docker + Ollama |
| 5V 5A USB-C 电源 | EduCore API + PWA |
| 散热壳 | Qwen 2.5 1.8B 模型 |

**单基站容量**：支持 30-50 名学生同时使用

---

## 7. 安全设计 | Security Design

| 层级 | 措施 |
|------|------|
| **认证** | JWT + HttpOnly Cookie + Refresh Token 轮转 |
| **授权** | 基于角色的访问控制（RBAC）：学生/家长/老师/志愿者/管理员 |
| **数据** | MongoDB 字段级加密 + 传输全程 HTTPS |
| **审计** | 所有敏感操作记录日志，不可篡改 |
| **离线** | 本地数据 AES 加密，令牌过期自动登出 |

---

## 8. 为什么选择这个技术栈？ | Why This Tech Stack?

| 选择 | 原因 |
|------|------|
| **TypeScript 全栈** | 类型安全，减少 Bug，前端后端共享类型定义 |
| **Fastify** | 比 Express 快 2-3 倍，适合边缘设备运行 |
| **MongoDB** | Schema 灵活，适合快速迭代的教育产品 |
| **React 19** | 生态成熟，组件丰富，开发者好找 |
| **TailwindCSS 4** | 开发速度快，体积小，适合 PWA |
| **Zustand** | 极简状态管理，比 Redux 简单 10 倍 |
| **Ollama** | 本地 LLM 事实上的标准，社区活跃 |

---

## English

## 1. Overall Architecture

EduCore uses a monorepo architecture with three layers: Backend, Frontend, and Shared Packages.

## 2. Core Design Principles

| Principle | Description |
|-----------|-------------|
| **Student First** | All design decisions prioritize student experience |
| **Offline First** | All core features work without internet |
| **Graceful Degradation** | AI features degrade gracefully through fallback chain |
| **Warm Tone** | Never criticize, only encourage |
| **Type Safe** | Full-stack TypeScript for end-to-end safety |

## 3. Backend Architecture

### 3.1 Model Provider Pattern ⭐

This is the core design of the AI architecture:

```typescript
export interface ModelProvider {
  generate(prompt: string, options?: GenerateOptions): Promise<string>;
  chat(messages: ChatMessage[], options?: GenerateOptions): Promise<string>;
  embeddings(text: string): Promise<number[]>;
  healthCheck(): Promise<ProviderHealth>;
}
```

**Why this design?**

1. ✅ **Pluggable**: New model providers only need to implement the interface
2. ✅ **Testable**: Can mock the entire Provider for unit testing
3. ✅ **Automatic Fallback**: Model Manager auto-switches based on priority + health
4. ✅ **Backward Compatible**: Existing code needs no changes

**Three-level Fallback Chain**:
```
Ollama (local) → Ark API (cloud) → Rule Engine (fallback)
   Fastest         Best Quality      100% Available
   No Internet     Internet needed   Works everywhere
```

## 4. Frontend Architecture

### 4.1 Offline PWA Architecture

```
Frontend PWA
├── Service Worker             # Static asset caching
├── IndexedDB                  # Local learning data storage
└── Sync Queue                 # Offline operation queue
```

**Offline Workflow**:
1. Student works offline → data saved to IndexedDB
2. Each operation goes into Sync Queue
3. Auto-sync when network returns
4. Conflict resolution: "Last write wins"

## 5. Learning Algorithms

| Algorithm | Purpose | Description |
|-----------|---------|-------------|
| **BKT** (Bayesian Knowledge Tracing) | Mastery Assessment | Real-time calculation of knowledge mastery probability |
| **IRT** (Item Response Theory) | Difficulty Calibration | Dynamically adjusts question difficulty |
| **SM-2** | Spaced Repetition | Optimizes review timing for memory efficiency |

## 6. Deployment Architecture

### 6.1 Offline Terminal Deployment

| Hardware | Software |
|----------|----------|
| Raspberry Pi 5 8GB / RK3566 | Raspberry Pi OS / Armbian |
| 256GB MicroSD (A2) | Docker + Ollama |
| 5V 5A USB-C Power | EduCore API + PWA |
| Heatsink Case | Qwen 2.5 1.8B Model |

**Single Station Capacity**: 30-50 concurrent students

## 7. Security Design

| Layer | Measures |
|-------|----------|
| **Auth** | JWT + HttpOnly Cookie + Refresh Token Rotation |
| **Authorization** | RBAC: Student/Parent/Teacher/Volunteer/Admin |
| **Data** | MongoDB field-level encryption + HTTPS everywhere |
| **Audit** | All sensitive operations logged, tamper-proof |
| **Offline** | Local data AES encrypted, auto-logout on token expiry |

## 8. Why This Tech Stack?

| Choice | Reason |
|--------|--------|
| **Full-stack TypeScript** | Type safety, fewer bugs, shared types |
| **Fastify** | 2-3x faster than Express, perfect for edge devices |
| **MongoDB** | Flexible schema, great for fast iteration in education |
| **React 19** | Mature ecosystem, lots of developers |
| **TailwindCSS 4** | Fast development, small bundle, perfect for PWA |
| **Zustand** | Minimal state management, 10x simpler than Redux |
| **Ollama** | De facto standard for local LLMs, active community |

---

*本文档会随着项目演进持续更新。*
*This document will be updated as the project evolves.*
