# VSCode 的 Jules 扩展

![Jules Extension Icon](../jules-extension/icon.png)

[![VSCode Extension](https://img.shields.io/badge/VSCode-Extension-blue.svg)](https://marketplace.visualstudio.com/items?itemName=YOUR_PUBLISHER.jules-extension)
[![Status](https://img.shields.io/badge/status-development-yellow.svg)](#)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

> "在 VSCode 中与 Google Jules 一起体验编码的未来"

Jules 扩展程序是一个扩展，可让您直接在 VSCode 中操作 Google 的 AI 编码代理 **Jules**。
为您的编码工作流程迎来一位智能伙伴。

## ✨ 概念

此扩展旨在将您的开发体验提升到一个新的水平。

- **无缝集成：** 无需离开熟悉的 VSCode 环境即可访问 Jules 的强大功能。
- **实时协作：** 从创建编码会话到检查进度，一切都是实时的。
- **提升生产力：** 让 Jules 处理繁琐的任务，您只需专注于创意工作。

## 🚀 主要功能

| 功能             | 描述                                                                                                                                    | 命令/图标                         |
| :--------------- | :-------------------------------------------------------------------------------------------------------------------------------------- | :-------------------------------- |
| **API 密钥设置** | 首次使用时设置 API 密钥以连接到您的 Jules 账户。密钥安全地存储在 VSCode 的 SecretStorage 中，并自动用于所有后续请求。                   | `jules-extension.setApiKey`       |
| **会话管理**     | 使用 `> Jules: Create Session` 命令向 Jules 请求新的编码任务。过去的会话也会列出，允许您随时恢复工作或查看已完成任务的历史记录。        | `jules-extension.createSession`   |
| **实时监控**     | 在添加到侧边栏的专用视图中一目了然地查看 Jules 的当前工作状态（`Running`、`Active`、`Done` 等）。不再需要在浏览器和编辑器之间重复切换。 | `julesSessionsView`               |
| **进度更新**     | 当您好奇 Jules 进展到哪里时，点击 `↻`（刷新）按钮。立即检索并更新 Jules 执行的会话状态和最新活动列表。                                  | `jules-extension.refreshSessions` |
| **活动显示**     | 当您选择一个会话时，可以查看 Jules 执行的命令、编辑的文件、思维过程等的详细日志。提供透明的开发体验，就像您正在窥视 Jules 的思考一样。  | `jules-extension.showActivities`  |

## 📦 安装

从 [Visual Studio Code Marketplace](https://marketplace.visualstudio.com/items?itemName=HirokiMukai.jules-extension) 安装。

或在 VS Code 的扩展视图中搜索"Jules Extension"。

### 从 Marketplace (推荐)

1.  在 VSCode Marketplace 中搜索"Jules Extension"
2.  点击 \`Install\` 按钮

## �� 获取 API 密钥

要使用 Jules 扩展，您需要一个 Jules API 密钥。请按照以下步骤获取：

1.  **创建账户：**

    - 访问 [Jules 官方网站](https://jules.google/docs)。
    - 注册新账户或使用现有账户登录。

2.  **生成 API 密钥：**

    - 在您的账户仪表板中，导航至"API 密钥"或"开发人员设置"部分。
    - 点击"创建新密钥"。
    - 给密钥一个易于理解的名称（例如"VSCode 扩展"）并生成它。

3.  **复制密钥：**
    - 您的新 API 密钥将会显示。将其复制到剪贴板。
    - 如果以后需要再次检查密钥，您随时可以在 Jules 的设置页面中查看。

> **重要提示：** 请像密码一样对待您的 API 密钥。不要公开共享或提交到版本控制中。

## 快速入门

1.  使用 \`Ctrl + Shift + P\`（或 \`Cmd + Shift + P\`）打开命令面板。
2.  运行 \`> Jules: Set Jules API Key\` 来设置您的 API 密钥。
3.  点击侧边栏中的 \`$(robot)\` 图标打开 Jules 会话视图。
4.  运行 \`> Jules: Create Jules Session\` 开始您的第一个编码会话！

## 📚 参考

- [Jules 官方网站](https://jules.google/docs)
- [Jules API 文档](https://developers.google.com/jules/api)

## 🤝 贡献

这个项目才刚刚开始。我们欢迎各种形式的贡献，包括错误报告、功能建议和拉取请求！
请查看问题跟踪器和拉取请求。

## 🔗 链接

- [Marketplace](https://marketplace.visualstudio.com/items?itemName=HirokiMukai.jules-extension)
- [GitHub 仓库](https://github.com/is0692vs/jules-extension.git)
- [报告问题](https://github.com/is0692vs/jules-extension/issues)

## 📝 许可证

[MIT](../../LICENSE)
