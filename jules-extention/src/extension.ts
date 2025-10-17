// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

interface Source {
  name?: string;
  id?: string;
  url?: string;
  description?: string;
}

interface SourcesResponse {
  sources: Source[];
}

interface SourceQuickPickItem extends vscode.QuickPickItem {
  source: Source;
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log(
    'Congratulations, your extension "jules-extention" is now active!'
  );

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  const disposable = vscode.commands.registerCommand(
    "jules-extention.helloWorld",
    () => {
      // The code you place here will be executed every time your command is executed
      // Display a message box to the user
      vscode.window.showInformationMessage("Hello World from jules-extention!");
    }
  );

  const setApiKeyDisposable = vscode.commands.registerCommand(
    "jules-extention.setApiKey",
    async () => {
      const apiKey = await vscode.window.showInputBox({
        prompt: "Enter your Jules API Key",
        password: true,
      });
      if (apiKey) {
        await context.secrets.store("jules-api-key", apiKey);
        vscode.window.showInformationMessage("API Key saved securely.");
      }
    }
  );

  const verifyApiKeyDisposable = vscode.commands.registerCommand(
    "jules-extention.verifyApiKey",
    async () => {
      const apiKey = await context.secrets.get("jules-api-key");
      if (!apiKey) {
        vscode.window.showErrorMessage(
          'API Key not found. Please set it first using "Set Jules API Key" command.'
        );
        return;
      }
      try {
        const response = await fetch(
          "https://jules.googleapis.com/v1alpha/sources",
          {
            method: "GET",
            headers: {
              "X-Goog-Api-Key": apiKey,
              "Content-Type": "application/json",
            },
          }
        );
        if (response.ok) {
          vscode.window.showInformationMessage("API Key is valid.");
        } else {
          vscode.window.showErrorMessage(
            "API Key is invalid. Please check and set a correct key."
          );
        }
      } catch (error) {
        vscode.window.showErrorMessage(
          "Failed to verify API Key. Please check your internet connection."
        );
      }
    }
  );

  const listSourcesDisposable = vscode.commands.registerCommand(
    "jules-extention.listSources",
    async () => {
      const apiKey = await context.secrets.get("jules-api-key");
      if (!apiKey) {
        vscode.window.showErrorMessage(
          'API Key not found. Please set it first using "Set Jules API Key" command.'
        );
        return;
      }
      try {
        const response = await fetch(
          "https://jules.googleapis.com/v1alpha/sources",
          {
            method: "GET",
            headers: {
              "X-Goog-Api-Key": apiKey,
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          vscode.window.showErrorMessage(
            `Failed to fetch sources: ${response.status} ${response.statusText}`
          );
          return;
        }
        const data = await response.json() as SourcesResponse;
        if (!data.sources || !Array.isArray(data.sources)) {
          vscode.window.showErrorMessage("Invalid response format from API.");
          return;
        }
        const items: SourceQuickPickItem[] = data.sources.map((source) => ({
          label: source.name || source.id || "Unknown",
          description: source.url || "",
          detail: source.description || "",
          source: source,
        }));
        const selected: SourceQuickPickItem | undefined = await vscode.window.showQuickPick(items, {
          placeHolder: "Select a Jules Source",
        });
        if (selected) {
          await context.globalState.update("selectedSource", selected.source);
          vscode.window.showInformationMessage(
            `Selected source: ${selected.label}`
          );
        }
      } catch (error) {
        vscode.window.showErrorMessage(
          "Failed to fetch sources. Please check your internet connection."
        );
      }
    }
  );

  context.subscriptions.push(
    disposable,
    setApiKeyDisposable,
    verifyApiKeyDisposable,
    listSourcesDisposable
  );
}

// This method is called when your extension is deactivated
export function deactivate() {}