# Jules Extension for VSCode

[![VSCode Extension](https://img.shields.io/badge/VSCode-Extension-blue.svg)](https://marketplace.visualstudio.com/items?itemName=YOUR_PUBLISHER.jules-extension)
[![Status](https://img.shields.io/badge/status-development-yellow.svg)](#)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

> "VSCode で Google Jules と共に、コーディングの未来を体験しよう"

Jules Extension は、Google の AI コーディングエージェント **Jules** を VSCode 内から直接操作できる拡張機能です。
あなたのコーディングワークフローに、インテリジェントな相棒を迎え入れましょう。

## ✨ コンセプト

この拡張機能は、あなたの開発体験を次のレベルへ引き上げるために生まれました。

- **シームレスな統合:** いつもの VSCode 環境から離れることなく、Jules のパワフルな機能にアクセス。
- **リアルタイム連携:** コーディングセッションの作成から進捗確認まで、すべてをリアルタイムで。
- **生産性の飛躍:** 面倒なタスクは Jules に任せて、あなたは創造的な作業に集中できます。

## 🚀 主要機能

| 機能                   | 説明                                                                                                                                                             | コマンド / アイコン               |
| :--------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------------------------------- |
| **API キー設定**       | 初回利用時に、あなたのJulesアカウントに接続するためのAPIキーを設定します。キーはVSCodeのSecretStorageに安全に保管され、以降のすべてのリクエストで自動的に利用されます。  | `jules-extension.setApiKey`       |
| **セッション管理**     | `> Jules: Create Session` コマンドで、新しいコーディングタスクをJulesに依頼します。過去のセッションも一覧表示され、いつでも作業を再開したり、完了したタスクの履歴を確認したりできます。 | `jules-extension.createSession`   |
| **リアルタイム監視**   | サイドバーに追加される専用ビューで、Julesの現在の作業状況（`Running`, `Active`, `Done`など）を一目で把握できます。もうブラウザとエディタを何度も行き来する必要はありません。  | `julesSessionsView`               |
| **進捗の更新**         | Julesの作業がどこまで進んだか気になったら、`↻`（更新）ボタンをクリック。セッションのステータスやJulesが実行した最新のアクティビティリストを瞬時に取得し、表示を更新します。 | `jules-extension.refreshSessions` |
| **アクティビティ表示** | セッションを選択すると、Julesが実行したコマンド、編集したファイル、思考プロセスなどの詳細なログを確認できます。まるでJulesの思考を覗き込んでいるかのような、透明性の高い開発体験を提供します。 | `jules-extension.showActivities`  |

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

_(これは UI のイメージです。実際の表示とは異なる場合があります。)_

## 📦 インストール

### Marketplace から (推奨)

1.  VSCode Marketplace で "Jules Extension" を検索 (現在準備中)
2.  `Install` ボタンをクリック

### VSIX ファイルから (手動インストール)

まだ Marketplace に公開されていない最新の機能を試したい場合は、リリースページから `.vsix` ファイルを直接ダウンロードしてインストールできます。

1.  **リリースページにアクセス:**
    [GitHub Releases](https://github.com/your-repo/jules-extension/releases) を開き、最新のリリースバージョンを見つけます。

2.  **VSIX ファイルをダウンロード:**
    `Assets` の中にある `.vsix` ファイル (例: `jules-extension-0.1.0.vsix`) をダウンロードします。

3.  **VSCode にインストール:**
    - VSCode を開きます。
    - `拡張機能` (Extensions) ビュー (`Ctrl+Shift+X`) を表示します。
    - ビューの上部にある `...` (その他のアクション) メニューをクリックし、`VSIX からのインストール...` (Install from VSIX...) を選択します。
    - ダウンロードした `.vsix` ファイルを選択してインストールします。

## 🔑 APIキーの取得

Jules Extension を使用するには、Jules API キーが必要です。以下の手順で取得してください：

1.  **アカウントの作成:**
    - [Jules公式サイト](https://jules.google/docs)にアクセスします。
    - 新しいアカウントを登録するか、既存のアカウントでログインします。

2.  **APIキーの生成:**
    - アカウントのダッシュボードで「APIキー」または「開発者設定」セクションに移動します。
    - 「新しいシークレットキーを作成」をクリックします。
    - キーに分かりやすい名前（例：「VSCode拡張機能」）を付けて生成します。

3.  **キーのコピー:**
    - 新しいAPIキーが表示されます。クリップボードにコピーしてください。
    - 後でキーを再度確認する必要がある場合は、Julesの設定ページでいつでも確認できます。

> **重要:** APIキーはパスワードのように扱ってください。公開したり、バージョン管理にコミットしたりしないでください。

## クイックスタート

1.  `Ctrl + Shift + P` (または `Cmd + Shift + P`) でコマンドパレットを開きます。
2.  `> Jules: Set Jules API Key` を実行し、あなたの API キーを設定します。
3.  サイドバーの `$(robot)` アイコンをクリックして、Jules Sessions View を開きます。
4.  `> Jules: Create Jules Session` を実行して、最初のコーディングセッションを開始しましょう！

## ⚠️ 注意事項

- **カードブロックの表示:** カードブロックとして表示される機能を使用する際は、コンテンツの構造が正しく描画されるように注意してください。

## 🤝 貢献 (Contribution)

このプロジェクトはまだ始まったばかりです。バグ報告、機能提案、プルリクエストなど、あらゆる形の貢献を歓迎します！
Issue Tracker や Pull Requests をご確認ください。

## 📝 ライセンス

[MIT](LICENSE)