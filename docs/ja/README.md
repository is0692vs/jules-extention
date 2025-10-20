# Jules Extension for VSCode

![Jules Extension Icon](../jules-extension/icon.png)

[![VSCode Extension](https://img.shields.io/badge/VSCode-Extension-blue.svg)](https://marketplace.visualstudio.com/items?itemName=HirokiMukai.jules-extension)
[![Status](https://img.shields.io/badge/status-active-brightgreen.svg)](#)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](../../../LICENSE)

> "VSCode で Google Jules と共に、コーディングの未来を体験しよう"

Jules Extension は、Google の AI コーディングエージェント **Jules** を VSCode 内から直接操作できる拡張機能です。
あなたのコーディングワークフローに、インテリジェントな相棒を迎え入れましょう。

## ✨ コンセプト

この拡張機能は、あなたの開発体験を次のレベルへ引き上げるために生まれました。

- **シームレスな統合:** いつもの VSCode 環境から離れることなく、Jules のパワフルな機能にアクセス。
- **リアルタイム連携:** コーディングセッションの作成から進捗確認まで、すべてをリアルタイムで。
- **生産性の飛躍:** 面倒なタスクは Jules に任せて、あなたは創造的な作業に集中できます。

## 🚀 主要機能

| 機能                   | 説明                                                                                                                                                                                              | コマンド / アイコン               |
| :--------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :-------------------------------- |
| **API キー設定**       | 初回利用時に、あなたの Jules アカウントに接続するための API キーを設定します。キーは VSCode の SecretStorage に安全に保管され、以降のすべてのリクエストで自動的に利用されます。                   | `jules-extension.setApiKey`       |
| **セッション管理**     | `> Jules: Create Session` コマンドで、新しいコーディングタスクを Jules に依頼します。過去のセッションも一覧表示され、いつでも作業を再開したり、完了したタスクの履歴を確認したりできます。         | `jules-extension.createSession`   |
| **リアルタイム監視**   | サイドバーに追加される専用ビューで、Jules の現在の作業状況（`Running`, `Active`, `Done`など）を一目で把握できます。もうブラウザとエディタを何度も行き来する必要はありません。                     | `julesSessionsView`               |
| **進捗の更新**         | Jules の作業がどこまで進んだか気になったら、`↻`（更新）ボタンをクリック。セッションのステータスや Jules が実行した最新のアクティビティリストを瞬時に取得し、表示を更新します。                    | `jules-extension.refreshSessions` |
| **アクティビティ表示** | セッションを選択すると、Jules が実行したコマンド、編集したファイル、思考プロセスなどの詳細なログを確認できます。まるで Jules の思考を覗き込んでいるかのような、透明性の高い開発体験を提供します。 | `jules-extension.showActivities`  |

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

_(これはUIの概念を示すためのイメージです)_

## 📦 インストール

[Visual Studio Code Marketplace](https://marketplace.visualstudio.com/items?itemName=HirokiMukai.jules-extension) からインストールしてください。

または、VS Code の拡張機能ビューで「Jules Extension」を検索してください。

### Marketplace から (推奨)

1.  VSCode Marketplace で "Jules Extension" を検索します。
2.  `Install` ボタンをクリックします。

## 🔑 API キーの取得と設定

Jules Extension を使用するには、Jules API キーが必要です。

現在、Jules API は限定プレビュー版のため、公式ドキュメントやキーの取得方法は変更される可能性があります。利用可能な最新の情報源をご確認の上、APIキーを取得してください。

取得したキーは、コマンドパレット (`Ctrl+Shift+P` または `Cmd+Shift+P`) から `> Jules: Set Jules API Key` を実行して設定します。

> **重要:** API キーはパスワードのように扱ってください。公開したり、バージョン管理にコミットしたりしないでください。

## 🚀 クイックスタート

1.  `Ctrl + Shift + P` (または `Cmd + Shift + P`) でコマンドパレットを開きます。
2.  `> Jules: Set Jules API Key` を実行し、取得した API キーを設定します。
3.  サイドバーの `$(robot)` アイコンをクリックして、Jules Sessions View を開きます。
4.  `> Jules: Create Jules Session` を実行して、最初のコーディングセッションを開始しましょう！

## 🤝 貢献 (Contribution)

このプロジェクトはまだ始まったばかりです。バグ報告、機能提案、プルリクエストなど、あらゆる形の貢献を歓迎します！
Issue Tracker や Pull Requests をご確認ください。

## 🔗 関連リンク

- [Marketplace](https://marketplace.visualstudio.com/items?itemName=HirokiMukai.jules-extension)
- [GitHub Repository](https://github.com/is0692vs/jules-extension)
- [Report Issues](https://github.com/is0692vs/jules-extension/issues)

## 📝 ライセンス

[MIT](../../../LICENSE)
