# Welcome / ようこそ

This document is available in the following languages:

- [English](./en/README.md)
- [العربية (Arabic)](./ar/README.md)
- [Español (Spanish)](./es/README.md)
- [Français (French)](./fr/README.md)
- [日本語 (Japanese)](./ja/README.md)
- [한국어 (Korean)](./ko/README.md)
- [中文 (Chinese)](./zh/README.md)

> "VSCode で Google Jules と共に、コーディングの未来を体験しよう"

Jules Extension は、Google の AI コーディングエージェント **Jules** を VSCode 内から直接操作できる拡張機能です。
あなたのコーディングワークフローに、インテリジェントな相棒を迎え入れましょう。

## ✨ コンセプト

この拡張機能は、あなたの開発体験を次のレベルへ引き上げるために生まれました。

- **シームレスな統合:** いつもの VSCode 環境から離れることなく、Jules のパワフルな機能にアクセス。
- **リアルタイム連携:** コーディングセッションの作成から進捗確認まで、すべてをリアルタイムで。
- **生産性の飛躍:** 面倒なタスクは Jules に任せて、あなたは創造的な作業に集中できます。

## 🚀 主要機能

| 機能                   | 説明                                                                                          | コマンド / アイコン               |
| :--------------------- | :-------------------------------------------------------------------------------------------- | :-------------------------------- |
| **API キー設定**       | Jules API を利用するための API キーを安全に設定・検証します。                                 | `jules-extension.setApiKey`       |
| **セッション管理**     | 新しいコーディングセッションを開始し、一覧で管理します。                                      | `jules-extension.createSession`   |
| **リアルタイム監視**   | `$(robot)` アイコンの専用ビューで、アクティブなセッションの状況をリアルタイムに追跡できます。 | `julesSessionsView`               |
| **進捗の更新**         | `$(refresh)` ボタン一つで、セッションやアクティビティの最新情報を取得します。                 | `jules-extension.refreshSessions` |
| **アクティビティ表示** | Jules が実行した詳細なタスクログを確認できます。                                              | `jules-extension.showActivities`  |

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
