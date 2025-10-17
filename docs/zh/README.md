# VSCode 的 Jules 扩展

[![VSCode Extension](https://img.shields.io/badge/VSCode-Extension-blue.svg)](https://marketplace.visualstudio.com/items?itemName=YOUR_PUBLISHER.jules-extension)
[![Status](https://img.shields.io/badge/status-development-yellow.svg)](#)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

> "在 VSCode 中与 Google Jules 一起体验编码的未来"

Jules 扩展程序是一个扩展，可让您直接在 VSCode 中操作 Google 的 AI 编码代理 **Jules**。
为您的编码工作流程迎来一位智能伙伴。

## ✨ 概念

此扩展旨在将您的开发体验提升到一个新的水平。

- **无缝集成：** 无需离开您常用的 VSCode 环境即可访问 Jules 的强大功能。
- **实时协作：** 从创建编码会话到检查其进度，一切都是实时的。
- **生产力飞跃：** 将繁琐的任务交给 Jules，专注于您的创造性工作。

## 🚀 主要功能

| 功能                 | 描述                                                                         | 命令/图标                         |
| :------------------- | :--------------------------------------------------------------------------- | :-------------------------------- |
| **设置 API 密钥**    | 安全地设置和验证用于使用 Jules API 的 API 密钥。                             | `jules-extension.setApiKey`       |
| **会话管理**         | 启动新的编码会话并在列表中进行管理。                                         | `jules-extension.createSession`   |
| **实时监控**         | 在带有 `$(robot)` 图标的专用视图中实时跟踪活动会话的状态。                   | `julesSessionsView`               |
| **进度更新**         | 使用单个 `$(refresh)` 按钮获取有关会话和活动的最新信息。                     | `jules-extension.refreshSessions` |
| **活动显示**         | 查看 Jules 执行的详细任务日志。                                              | `jules-extension.showActivities`  |

### 预览：Jules 会话视图

```
┌──────────────────────────────┐
│ ▼ JULES SESSIONS        ↻    │
├──────────────────────────────┤
│  ▶ session-xyz-123 (Running) │
│  ▶ session-abc-456 (Active)  │
│  ⏹ session-def-789 (Done)    │
└──────────────────────────────┘
```

_（这是一个 UI 概念。实际显示可能会有所不同。）_

## 📦 安装

### 从 Marketplace (推荐)

1.  在 VSCode Marketplace 中搜索“Jules Extension”（即将推出）
2.  点击 `Install` 按钮

### 从 VSIX 文件 (手动安装)

如果您想尝试尚未在 Marketplace 上发布的最新功能，您可以直接从发布页面下载并安装 `.vsix` 文件。

1.  **前往发布页面：**
    访问 [GitHub Releases](https://github.com/your-repo/jules-extension/releases) 并找到最新的发布版本。

2.  **下载 VSIX 文件：**
    从 `Assets` 中下载 `.vsix` 文件（例如 `jules-extension-0.1.0.vsix`）。

3.  **在 VSCode 中安装：**
    - 打开 VSCode。
    - 前往 `扩展` 视图 (`Ctrl+Shift+X`)。
    - 单击视图顶部的 `...` (更多操作) 菜单，然后选择 `从 VSIX 安装...`。
    - 选择下载的 `.vsix` 文件进行安装。

## 🔑 获取您的 API 密钥

要使用 Jules 扩展，您需要一个 Jules API 密钥。请按照以下步骤获取：

1.  **创建账户：**
    - 前往 [Jules 官方网站](https://jules.google/docs)。
    - 注册一个新帐户或登录（如果您已有帐户）。

2.  **生成 API 密钥：**
    - 在您的帐户仪表板中导航至“API 密钥”或“开发人员设置”部分。
    - 点击“创建新的密钥”。
    - 为您的密钥指定一个描述性名称（例如“VSCode 扩展”）并生成它。

3.  **复制您的密钥：**
    - 您的新 API 密钥将会显示。将其复制到剪贴板。
    - 如果您以后需要再次查看您的密钥，您随时可以在您的 Jules 设置页面上找到它。

> **重要提示：** 像对待密码一样对待您的 API 密钥。不要公开分享或将其提交到版本控制中。

## 快速入门

1.  按 `Ctrl + Shift + P` (或 `Cmd + Shift + P`) 打开命令面板。
2.  运行 `> Jules: Set Jules API Key` 并输入您的 API 密钥。
3.  单击侧边栏中的 `$(robot)` 图标以打开 Jules 会话视图。
4.  运行 `> Jules: Create Jules Session` 开始您的第一个编码会话！

## ⚠️ 重要提示

- **卡片块渲染：** 在使用显示为卡片块的功能时，请注意内容的结构，以确保其正确渲染。

## 🤝 贡献

这个项目才刚刚开始。我们欢迎各种形式的贡献，包括错误报告、功能建议和拉取请求！
请查看问题跟踪器和拉取请求。

## 📝 许可证

[MIT](LICENSE)