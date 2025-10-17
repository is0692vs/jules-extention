# VS Code 拡張機能へようこそ

## フォルダの内容

- このフォルダには、拡張機能に必要なすべてのファイルが含まれています。
- `package.json` - 拡張機能とコマンドを宣言するマニフェストファイルです。
  - サンプルプラグインはコマンドを登録し、そのタイトルとコマンド名を定義します。この情報により、VS Code はコマンドパレットにコマンドを表示できます。この時点ではプラグインを読み込む必要はありません。
- `src/extension.ts` - コマンドの実装を提供するメインファイルです。
  - このファイルは `activate` という関数をエクスポートします。この関数は、拡張機能が初めてアクティブ化されたときに呼び出されます（この場合、コマンドを実行することで）。`activate` 関数内で `registerCommand` を呼び出します。
  - コマンドの実装を含む関数を `registerCommand` の第 2 パラメータとして渡します。

## セットアップ

- 推奨拡張機能をインストールしてください（amodio.tsl-problem-matcher、ms-vscode.extension-test-runner、dbaeumer.vscode-eslint）。

## クイックスタート

- `F5` を押すと、拡張機能が読み込まれた新しいウィンドウが開きます。
- コマンドパレットからコマンドを実行するには（`Ctrl+Shift+P` または Mac では `Cmd+Shift+P` を押して）「Hello World」と入力します。
- `src/extension.ts` のコードにブレークポイントを設定して拡張機能をデバッグします。
- 拡張機能の出力はデバッグコンソールで確認できます。

## 変更を加える

- `src/extension.ts` のコードを変更した後、デバッグツールバーから拡張機能を再起動できます。
- また、拡張機能の変更を読み込むために、VS Code ウィンドウをリロード（`Ctrl+R` または Mac では `Cmd+R`）することもできます。

## API を探す

- `node_modules/@types/vscode/index.d.ts` ファイルを開くと、API の完全なセットを確認できます。

## テストを実行する

- [Extension Test Runner](https://marketplace.visualstudio.com/items?itemName=ms-vscode.extension-test-runner) をインストールしてください。
- **Tasks: Run Task** コマンドから "watch" タスクを実行します。これが実行されていないと、テストが検出されない可能性があります。
- アクティビティバーから Testing ビューを開き、Run Test ボタンをクリックするか、ホットキー `Ctrl/Cmd + ; A` を使用します。
- テスト結果の出力は Test Results ビューで確認できます。
- `src/test/extension.test.ts` を変更するか、`test` フォルダ内に新しいテストファイルを作成します。
  - 提供されたテストランナーは、`**.test.ts` という名前のパターンマッチするファイルのみを考慮します。
  - `test` フォルダ内にフォルダを作成して、テストを任意の方法で構造化できます。

## さらに進む

- [拡張機能をバンドルする](https://code.visualstudio.com/api/working-with-extensions/bundling-extension)ことで、拡張機能のサイズを小さくし、起動時間を改善できます。
- [拡張機能を公開する](https://code.visualstudio.com/api/working-with-extensions/publishing-extension)ことで、VS Code 拡張機能マーケットプレイスに公開できます。
- [継続的インテグレーションを設定する](https://code.visualstudio.com/api/working-with-extensions/continuous-integration)ことで、ビルドを自動化できます。
