# Jules Extension for VSCode

[![VSCode Extension](https://img.shields.io/badge/VSCode-Extension-blue.svg)](https://marketplace.visualstudio.com/items?itemName=YOUR_PUBLISHER.jules-extention)
[![Status](https://img.shields.io/badge/status-development-yellow.svg)](#)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

> "VSCode で Google Jules と共に、コーディングの未来を体験しよう"

Jules Extension は、Google の AI コーディングエージェント **Jules** を VSCode 内から直接操作できる拡張機能です。
あなたのコーディングワークフローに、インテリジェントな相棒を迎え入れましょう。

## ✨ コンセプト

この拡張機能は、あなたの開発体験を次のレベルへ引き上げるために生まれました。

*   **シームレスな統合:** いつものVSCode環境から離れることなく、Julesのパワフルな機能にアクセス。
*   **リアルタイム連携:** コーディングセッションの作成から進捗確認まで、すべてをリアルタイムで。
*   **生産性の飛躍:** 面倒なタスクはJulesに任せて、あなたは創造的な作業に集中できます。

## 🚀 主要機能

| 機能 | 説明 | コマンド / アイコン |
| :--- | :--- | :--- |
| **APIキー設定** | Jules APIを利用するためのAPIキーを安全に設定・検証します。 | `jules-extention.setApiKey` |
| **セッション管理** | 新しいコーディングセッションを開始し、一覧で管理します。 | `jules-extention.createSession` |
| **リアルタイム監視**| `$(robot)` アイコンの専用ビューで、アクティブなセッションの状況をリアルタイムに追跡できます。 | `julesSessionsView` |
| **進捗の更新** | `$(refresh)` ボタン一つで、セッションやアクティビティの最新情報を取得します。 | `jules-extention.refreshSessions` |
| **アクティビティ表示**| Julesが実行した詳細なタスクログを確認できます。 | `jules-extension.showActivities` |

### プレビュー: Jules Sessions View

```
┌──────────────────────────────┐
│ ▼ JULES SESSIONS        ↻    │
├──────────────────────────────┤
│  ▶ session-xyz-123 (Running) │
│  ▶ session-abc-456 (Active)  │
│  ⏹ session-def-789 (Done)    │
└──────────────────────────────┘
```
*(これはUIのイメージです。実際の表示とは異なる場合があります。)*

## 📦 インストール

1.  VSCode Marketplace で "Jules Extension" を検索 (現在準備中)
2.  `Install` ボタンをクリック

## クイックスタート

1.  `Ctrl + Shift + P` (または `Cmd + Shift + P`) でコマンドパレットを開きます。
2.  `> Jules: Set Jules API Key` を実行し、あなたのAPIキーを設定します。
3.  サイドバーの `$(robot)` アイコンをクリックして、Jules Sessions View を開きます。
4.  `> Jules: Create Jules Session` を実行して、最初のコーディングセッションを開始しましょう！

## 🤝 貢献 (Contribution)

このプロジェクトはまだ始まったばかりです。バグ報告、機能提案、プルリクエストなど、あらゆる形の貢献を歓迎します！
Issue Tracker や Pull Requests をご確認ください。

## 📝 ライセンス

[MIT](LICENSE)