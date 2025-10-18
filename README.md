# Welcome / ようこそ

This document is available in the following languages:

- [English](./docs/en/README.md)
- [العربية (Arabic)](./docs/ar/README.md)
- [Español (Spanish)](./docs/es/README.md)
- [Français (French)](./docs/fr/README.md)
- [日本語 (Japanese)](./docs/ja/README.md)
- [한국어 (Korean)](./docs/ko/README.md)
- [中文 (Chinese)](./docs/zh/README.md)

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

```markdown
┌──────────────────────────────┐
│ ▼ JULES SESSIONS ↻ │
├──────────────────────────────┤
│ ▶ session-xyz-123 (Running) │
│ ▶ session-abc-456 (Active) │
│ ⏹ session-def-789 (Done) │
└──────────────────────────────┘

## 📦 インストール

1.  VSCode Marketplace で "Jules Extension" を検索 (現在準備中)
2.  `Install` ボタンをクリック

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

## 📝 ライセンス

[MIT](LICENSE)
```
