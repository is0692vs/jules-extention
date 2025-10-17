# Jules Extension for VSCode

[![VSCode Extension](https://img.shields.io/badge/VSCode-Extension-blue.svg)](https://marketplace.visualstudio.com/items?itemName=YOUR_PUBLISHER.jules-extension)
[![Status](https://img.shields.io/badge/status-development-yellow.svg)](#)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

> "Experience the future of coding with Google Jules in VSCode"

Jules Extension is an extension that allows you to operate Google's AI coding agent **Jules** directly from within VSCode.
Welcome an intelligent partner to your coding workflow.

## ✨ Concept

This extension was created to take your development experience to the next level.

- **Seamless Integration:** Access the powerful features of Jules without leaving your usual VSCode environment.
- **Real-time Collaboration:** From creating a coding session to checking its progress, everything is in real-time.
- **Productivity Leap:** Leave the tedious tasks to Jules and focus on your creative work.

## 🚀 Key Features

| Feature                | Description                                                                          | Command / Icon                    |
| :--------------------- | :----------------------------------------------------------------------------------- | :-------------------------------- |
| **Set API Key**        | Securely set and validate the API key for using the Jules API.                       | `jules-extension.setApiKey`       |
| **Session Management** | Start new coding sessions and manage them in a list.                                 | `jules-extension.createSession`   |
| **Real-time Monitoring**| Track the status of active sessions in real-time in a dedicated view with the `$(robot)` icon. | `julesSessionsView`               |
| **Progress Update**    | Get the latest information on sessions and activities with a single `$(refresh)` button. | `jules-extension.refreshSessions` |
| **Activity Display**   | Check the detailed task logs executed by Jules.                                      | `jules-extension.showActivities`  |

### Preview: Jules Sessions View

```
┌──────────────────────────────┐
│ ▼ JULES SESSIONS        ↻    │
├──────────────────────────────┤
│  ▶ session-xyz-123 (Running) │
│  ▶ session-abc-456 (Active)  │
│  ⏹ session-def-789 (Done)    │
└──────────────────────────────┘
```

_(This is a UI concept. The actual display may differ.)_

## 📦 Installation

### From Marketplace (Recommended)

1.  Search for "Jules Extension" in the VSCode Marketplace (coming soon)
2.  Click the `Install` button

### From VSIX File (Manual Install)

If you want to try the latest features that are not yet published on the Marketplace, you can download and install the `.vsix` file directly from the releases page.

1.  **Go to the Releases Page:**
    Visit [GitHub Releases](https://github.com/your-repo/jules-extension/releases) and find the latest release version.

2.  **Download the VSIX File:**
    Download the `.vsix` file (e.g., `jules-extension-0.1.0.vsix`) from the `Assets`.

3.  **Install in VSCode:**
    - Open VSCode.
    - Go to the `Extensions` view (`Ctrl+Shift+X`).
    - Click the `...` (More Actions) menu at the top of the view and select `Install from VSIX...`.
    - Select the downloaded `.vsix` file to install.

## 🔑 Getting Your API Key

To use the Jules Extension, you need a Jules API key. Follow these steps to get one:

1.  **Create an Account:**
    - Go to the [Jules Official Website](https://jules.google/docs).
    - Sign up for a new account or log in if you already have one.

2.  **Generate API Key:**
    - Navigate to the "API Keys" or "Developer Settings" section in your account dashboard.
    - Click on "Create a new secret key".
    - Give your key a descriptive name (e.g., "VSCode Extension") and generate it.

3.  **Copy Your Key:**
    - Your new API key will be displayed. Copy it to your clipboard.
    - If you need to view your key again later, you can always find it on your Jules settings page.

> **Important:** Treat your API key like a password. Do not share it publicly or commit it to version control.

## Quick Start

1.  Press `Ctrl + Shift + P` (or `Cmd + Shift + P`) to open the Command Palette.
2.  Run `> Jules: Set Jules API Key` and enter your API key.
3.  Click the `$(robot)` icon in the sidebar to open the Jules Sessions View.
4.  Run `> Jules: Create Jules Session` to start your first coding session!

## ⚠️ Important Notes

- **Card Block Rendering:** When using features that are displayed as card blocks, please be mindful of the content's structure to ensure it renders correctly.

## 🤝 Contribution

This project is just getting started. We welcome all forms of contribution, including bug reports, feature suggestions, and pull requests!
Please check the Issue Tracker and Pull Requests.

## 📝 License

[MIT](LICENSE)