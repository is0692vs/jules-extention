# Jules Extension for VSCode

![Jules Extension Icon](../jules-extension/icon.png)

[![VSCode Extension](https://img.shields.io/badge/VSCode-Extension-blue.svg)](https://marketplace.visualstudio.com/items?itemName=HirokiMukai.jules-extension)
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

_(これは UI のイメージです。実際の表示とは異なる場合があります。)_

## 📦 インストール

[Visual Studio Code Marketplace](https://marketplace.visualstudio.com/items?itemName=HirokiMukai.jules-extension) からインストールしてください。

または、VS Code の拡張機能ビューで「Jules Extension」を検索してください。

### Marketplace から (推奨)

1.  VSCode Marketplace で "Jules Extension" を検索
2.  `Install` ボタンをクリック

### VSIX ファイルから (手動インストール)

Marketplace にまだ公開されていない最新機能を試したい場合は、リリースページから `.vsix` ファイルを直接ダウンロードしてインストールできます。

1.  **リリースページへ移動:**
    [GitHub Releases](https://github.com/is0692vs/jules-extension/releases) を訪問して、最新のリリースバージョンを探します。

2.  **VSIX ファイルをダウンロード:**
    `Assets` から `.vsix` ファイル (例: `jules-extension-0.1.0.vsix`) をダウンロードします。

3.  **VSCode にインストール:**
    - VSCode を開きます。
    - `拡張機能` ビュー (`Ctrl+Shift+X`) に移動します。
    - ビューの上部にある `...` (その他の操作) メニューをクリックし、`VSIX からインストール...` を選択します。
    - ダウンロードした `.vsix` ファイルを選択してインストールします。

## 🔑 API キーの取得

Jules Extension を使用するには、Jules API キーが必要です。以下の手順で取得してください：

1.  **アカウントの作成:**

    - [Jules 公式サイト](https://jules.google/docs)にアクセスします。
    - 新しいアカウントを登録するか、既存のアカウントでログインします。

2.  **API キーの生成:**

    - アカウントのダッシュボードで「API キー」または「開発者設定」セクションに移動します。
    - 「新しいシークレットキーを作成」をクリックします。
    - キーに分かりやすい名前（例：「VSCode 拡張機能」）を付けて生成します。

3.  **キーのコピー:**
    - 新しい API キーが表示されます。クリップボードにコピーしてください。
    - 後でキーを再度確認する必要がある場合は、Jules の設定ページでいつでも確認できます。

> **重要:** API キーはパスワードのように扱ってください。公開したり、バージョン管理にコミットしたりしないでください。

## クイックスタート

1.  `Ctrl + Shift + P` (または `Cmd + Shift + P`) でコマンドパレットを開きます。
2.  `> Jules: Set Jules API Key` を実行し、あなたの API キーを設定します。
3.  サイドバーの `$(robot)` アイコンをクリックして、Jules Sessions View を開きます。
4.  `> Jules: Create Jules Session` を実行して、最初のコーディングセッションを開始しましょう！

## 📚 参考

- [Jules 公式サイト](https://jules.google/docs)
- [Jules API ドキュメント](https://developers.google.com/jules/api)

## 🤝 貢献 (Contribution)

このプロジェクトはまだ始まったばかりです。バグ報告、機能提案、プルリクエストなど、あらゆる形の貢献を歓迎します！
Issue Tracker や Pull Requests をご確認ください。

## � リンク

- [Marketplace](https://marketplace.visualstudio.com/items?itemName=HirokiMukai.jules-extension)
- [GitHub Repository](https://github.com/is0692vs/jules-extension.git)
- [Report Issues](https://github.com/is0692vs/jules-extension/issues)

## �📝 ライセンス

[MIT](../../LICENSE)
