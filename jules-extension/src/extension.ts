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

interface CreateSessionRequest {
  prompt: string;
  sourceContext: {
    source: string;
    githubRepoContext?: {
      startingBranch: string;
    };
  };
  automationMode: "AUTO_CREATE_PR" | "MANUAL";
  title: string;
}

interface SessionResponse {
  name: string;
  // Add other fields if needed
}

interface SessionOutput {
  pullRequest?: {
    url: string;
    title: string;
    description: string;
  };
}

interface Session {
  name: string;
  title: string;
  state: "RUNNING" | "COMPLETED" | "FAILED" | "CANCELLED";
  outputs?: SessionOutput[];
  sourceContext?: {
    source: string;
  };
  // Add other fields if needed
}

function mapApiStateToSessionState(
  apiState: string
): "RUNNING" | "COMPLETED" | "FAILED" | "CANCELLED" {
  switch (apiState) {
    case "PLANNING":
    case "AWAITING_PLAN_APPROVAL":
    case "AWAITING_USER_FEEDBACK":
    case "IN_PROGRESS":
    case "QUEUED":
    case "STATE_UNSPECIFIED":
      return "RUNNING";
    case "COMPLETED":
      return "COMPLETED";
    case "FAILED":
      return "FAILED";
    case "PAUSED":
    case "CANCELLED":
      return "CANCELLED";
    default:
      return "RUNNING"; // default to RUNNING
  }
}

interface SessionState {
  name: string;
  state: string;
  outputs?: SessionOutput[];
}

let previousSessionStates: Map<string, SessionState> = new Map();
let autoRefreshInterval: NodeJS.Timeout | undefined;

// Helper functions

async function getStoredApiKey(
  context: vscode.ExtensionContext
): Promise<string | undefined> {
  const apiKey = await context.secrets.get("jules-api-key");
  if (!apiKey) {
    vscode.window.showErrorMessage(
      'API Key not found. Please set it first using "Set Jules API Key" command.'
    );
    return undefined;
  }
  return apiKey;
}

function resolveSessionId(
  context: vscode.ExtensionContext,
  target?: SessionTreeItem | string
): string | undefined {
  return (
    (typeof target === "string" ? target : undefined) ??
    (target instanceof SessionTreeItem ? target.session.name : undefined) ??
    context.globalState.get<string>("active-session-id") ??
    context.globalState.get<string>("currentSessionId")
  );
}

function extractPRUrl(session: Session): string | null {
  return session.outputs?.find((o) => o.pullRequest)?.pullRequest?.url || null;
}

function extractPRUrlFromState(state: SessionState): string | null {
  return state.outputs?.find((o) => o.pullRequest)?.pullRequest?.url || null;
}

function checkForCompletedSessions(currentSessions: Session[]): Session[] {
  const completedSessions: Session[] = [];
  for (const session of currentSessions) {
    if (session.state === "COMPLETED") {
      const prevState = previousSessionStates.get(session.name);
      const currentPr = extractPRUrl(session);
      const prevPr = prevState ? extractPRUrlFromState(prevState) : null;
      if (currentPr && (!prevPr || prevState?.state === "RUNNING")) {
        completedSessions.push(session);
      }
    }
  }
  return completedSessions;
}

async function notifyPRCreated(session: Session, prUrl: string): Promise<void> {
  const result = await vscode.window.showInformationMessage(
    `Session "${session.title}" has completed and created a PR!`,
    "Open PR"
  );
  if (result === "Open PR") {
    vscode.env.openExternal(vscode.Uri.parse(prUrl));
  }
}

function updatePreviousStates(currentSessions: Session[]): void {
  for (const session of currentSessions) {
    previousSessionStates.set(session.name, {
      name: session.name,
      state: session.state,
      outputs: session.outputs,
    });
  }
}

function startAutoRefresh(
  context: vscode.ExtensionContext,
  sessionsProvider: JulesSessionsProvider
): void {
  const config = vscode.workspace.getConfiguration(
    "jules-extension.autoRefresh"
  );
  const isEnabled = config.get<boolean>("enabled");
  const intervalSeconds = config.get<number>("interval", 30);
  const interval = intervalSeconds * 1000; // Convert seconds to milliseconds

  console.log(
    `Jules: Auto-refresh enabled=${isEnabled}, interval=${intervalSeconds}s (${interval}ms)`
  );

  if (!isEnabled) {
    return;
  }

  if (autoRefreshInterval) {
    clearInterval(autoRefreshInterval);
  }

  autoRefreshInterval = setInterval(() => {
    console.log("Jules: Auto-refresh triggered");
    sessionsProvider.refresh();
  }, interval);
}

function stopAutoRefresh(): void {
  if (autoRefreshInterval) {
    clearInterval(autoRefreshInterval);
    autoRefreshInterval = undefined;
  }
}

function resetAutoRefresh(
  context: vscode.ExtensionContext,
  sessionsProvider: JulesSessionsProvider
): void {
  stopAutoRefresh();
  startAutoRefresh(context, sessionsProvider);
}

interface ComposerOptions {
  title: string;
  placeholder?: string;
  value?: string;
  showCreatePrCheckbox?: boolean;
}

interface ComposerResult {
  prompt: string;
  createPR: boolean;
}

async function showMessageComposer(
  options: ComposerOptions
): Promise<ComposerResult | undefined> {
  const panel = vscode.window.createWebviewPanel(
    "julesMessageComposer",
    options.title,
    vscode.ViewColumn.Active,
    {
      enableScripts: true,
      retainContextWhenHidden: false,
    }
  );

  const nonce = getNonce();
  panel.webview.html = getComposerHtml(panel.webview, options, nonce);

  return new Promise((resolve) => {
    let resolved = false;

    const finalize = (value: ComposerResult | undefined) => {
      if (resolved) {
        return;
      }
      resolved = true;
      resolve(value);
    };

    panel.onDidDispose(() => finalize(undefined));

    panel.webview.onDidReceiveMessage((message) => {
      if (message?.type === "submit") {
        finalize({
          prompt:
            typeof message.value === "string" ? message.value : "",
          createPR: !!message.createPR,
        });
        panel.dispose();
      } else if (message?.type === "cancel") {
        finalize(undefined);
        panel.dispose();
      }
    });
  });
}

function getComposerHtml(
  webview: vscode.Webview,
  options: ComposerOptions,
  nonce: string
): string {
  const placeholder = escapeAttribute(options.placeholder ?? "");
  const value = escapeHtml(options.value ?? "");
  const title = escapeHtml(options.title);
  const createPrCheckbox = options.showCreatePrCheckbox
    ? `
    <div class="create-pr-container">
      <input type="checkbox" id="create-pr" checked />
      <label for="create-pr">Create PR automatically?</label>
    </div>
  `
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${webview.cspSource}; script-src 'nonce-${nonce}'; style-src ${webview.cspSource} 'nonce-${nonce}';" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${title}</title>
<style nonce="${nonce}">
  body {
    margin: 0;
    padding: 16px;
    background-color: var(--vscode-editor-background);
    color: var(--vscode-editor-foreground);
    font-family: var(--vscode-font-family);
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    box-sizing: border-box;
  }

  textarea {
    flex: 1;
    width: 100%;
    resize: vertical;
    font-family: var(--vscode-editor-font-family);
    font-size: var(--vscode-editor-font-size);
    color: var(--vscode-input-foreground);
    background: var(--vscode-input-background);
    border: 1px solid var(--vscode-input-border);
    border-radius: 4px;
    padding: 12px;
    box-sizing: border-box;
    line-height: 1.5;
  }

  textarea:focus {
    outline: 1px solid var(--vscode-focusBorder);
  }

  .actions {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 16px;
    margin-top: 16px;
  }

  .create-pr-container {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-right: auto;
  }

  button {
    padding: 6px 14px;
    border-radius: 4px;
    border: 1px solid var(--vscode-button-border, transparent);
    background: var(--vscode-button-secondaryBackground);
    color: var(--vscode-button-secondaryForeground);
    cursor: pointer;
  }

  button.primary {
    background: var(--vscode-button-background);
    color: var(--vscode-button-foreground);
  }

  button.primary:hover {
    background: var(--vscode-button-hoverBackground);
  }
</style>
</head>
<body>
  <textarea id="message" placeholder="${placeholder}" autofocus>${value}</textarea>
  <div class="actions">
    ${createPrCheckbox}
    <button type="button" id="cancel">Cancel</button>
    <button type="button" id="submit" class="primary">Send</button>
  </div>
  <script nonce="${nonce}">
    const vscode = acquireVsCodeApi();
    const textarea = document.getElementById('message');
    const createPrCheckbox = document.getElementById('create-pr');
    const submit = () => {
      vscode.postMessage({
        type: 'submit',
        value: textarea.value,
        createPR: createPrCheckbox ? createPrCheckbox.checked : false,
      });
    };

    document.getElementById('submit').addEventListener('click', submit);
    document.getElementById('cancel').addEventListener('click', () => {
      vscode.postMessage({ type: 'cancel' });
    });

    textarea.addEventListener('keydown', (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
        event.preventDefault();
        submit();
      } else if (event.key === 'Escape') {
        event.preventDefault();
        vscode.postMessage({ type: 'cancel' });
      }
    });
  </script>
</body>
</html>`;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function escapeAttribute(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function getNonce(): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 16; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

interface SessionsResponse {
  sessions: Session[];
}

interface Activity {
  name: string;
  createTime: string;
  originator: "user" | "agent";
  id: string;
  type?: string;
  planGenerated?: { plan: any };
  planApproved?: { planId: string };
  progressUpdated?: { title: string; description?: string };
  sessionCompleted?: {};
  // Other fields as needed
}

interface ActivitiesResponse {
  activities: Activity[];
}

function getActivityIcon(activity: Activity): string {
  if (activity.planGenerated) {
    return "📝";
  }
  if (activity.planApproved) {
    return "👍";
  }
  if (activity.progressUpdated) {
    return "🔄";
  }
  if (activity.sessionCompleted) {
    return "✅";
  }
  return "ℹ️";
}

class JulesSessionsProvider
  implements vscode.TreeDataProvider<vscode.TreeItem>
{
  private _onDidChangeTreeData: vscode.EventEmitter<
    vscode.TreeItem | undefined | null | void
  > = new vscode.EventEmitter<vscode.TreeItem | undefined | null | void>();
  readonly onDidChangeTreeData: vscode.Event<
    vscode.TreeItem | undefined | null | void
  > = this._onDidChangeTreeData.event;

  constructor(
    private context: vscode.ExtensionContext,
    private statusBarItem: vscode.StatusBarItem
  ) {}

  refresh(): void {
    console.log("Jules: refresh() called, firing event.");
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: vscode.TreeItem): vscode.TreeItem {
    return element;
  }

  async getChildren(element?: vscode.TreeItem): Promise<vscode.TreeItem[]> {
    if (element) {
      return [];
    }

    const selectedSource =
      this.context.globalState.get<Source>("selected-source");

    if (!selectedSource) {
      const item = new vscode.TreeItem(
        "ℹ️ No source selected. Click to select a source."
      );
      item.command = {
        command: "jules-extension.listSources",
        title: "Select Source",
      };
      item.contextValue = "no-source";
      return [item];
    }

    const apiKey = await getStoredApiKey(this.context);
    if (!apiKey) {
      return [];
    }

    try {
      console.log("Jules: Fetching sessions in getChildren...");
      const response = await fetch(
        "https://jules.googleapis.com/v1alpha/sessions",
        {
          method: "GET",
          headers: {
            "X-Goog-Api-Key": apiKey,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorMsg = `API Error: ${response.status} ${response.statusText}`;
        console.error(`Jules: ${errorMsg}`);
        this.statusBarItem.text = "$(error) Jules: Refresh failed";
        this.statusBarItem.tooltip = `Failed to fetch sessions. ${errorMsg}. Click to retry.`;
        this.statusBarItem.backgroundColor = new vscode.ThemeColor(
          "statusBarItem.errorBackground"
        );
        return [];
      }

      // 正常に戻った場合はステータスバーを元に戻す
      updateStatusBar(this.context, this.statusBarItem);

      const data = (await response.json()) as SessionsResponse;
      if (!data.sessions || !Array.isArray(data.sessions)) {
        console.log("Jules: No sessions found or invalid response format");
        return [new vscode.TreeItem("No sessions found for this source.")];
      }

      console.log(`Jules: Found ${data.sessions.length} total sessions`);

      const allSessionsMapped = data.sessions.map((session) => ({
        ...session,
        state: mapApiStateToSessionState(session.state),
      }));

      const completedSessions = checkForCompletedSessions(allSessionsMapped);
      if (completedSessions.length > 0) {
        console.log(
          `Jules: Found ${completedSessions.length} completed sessions`
        );
        updatePreviousStates(allSessionsMapped);
        for (const session of completedSessions) {
          const prUrl = extractPRUrl(session);
          if (prUrl) {
            notifyPRCreated(session, prUrl).catch((error) => {
              console.error("Jules: Failed to show PR notification", error);
            });
          }
        }
      }

      const filteredSessions = allSessionsMapped.filter(
        (session) =>
          (session as any).sourceContext?.source === selectedSource.name
      );
      console.log(
        `Jules: Found ${filteredSessions.length} sessions for the selected source`
      );

      if (filteredSessions.length === 0) {
        return [new vscode.TreeItem("No sessions found for this source.")];
      }

      return filteredSessions.map((session) => new SessionTreeItem(session));
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      console.error(
        "Jules: Error fetching sessions in getChildren:",
        errorMsg
      );
      this.statusBarItem.text = "$(error) Jules: Refresh failed";
      this.statusBarItem.tooltip = `Failed to fetch sessions: ${errorMsg}. Click to retry.`;
      this.statusBarItem.backgroundColor = new vscode.ThemeColor(
        "statusBarItem.errorBackground"
      );
      return [];
    }
  }
}

export class SessionTreeItem extends vscode.TreeItem {
  constructor(public readonly session: Session) {
    super(session.title || session.name, vscode.TreeItemCollapsibleState.None);
    this.tooltip = `${session.name} - ${session.state}`;
    this.description = session.state;
    this.iconPath = this.getIcon(session.state);
    this.contextValue = "jules-session";
    this.command = {
      command: "jules-extension.showActivities",
      title: "Show Activities",
      arguments: [session.name],
    };
  }

  private getIcon(state: string): vscode.ThemeIcon {
    switch (state) {
      case "RUNNING":
        return new vscode.ThemeIcon("sync~spin");
      case "COMPLETED":
        return new vscode.ThemeIcon("check");
      case "FAILED":
        return new vscode.ThemeIcon("error");
      case "CANCELLED":
        return new vscode.ThemeIcon("close");
      default:
        return new vscode.ThemeIcon("question");
    }
  }
}

async function approvePlan(
  sessionId: string,
  context: vscode.ExtensionContext
): Promise<void> {
  const apiKey = await context.secrets.get("jules-api-key");
  if (!apiKey) {
    vscode.window.showErrorMessage("API Key is not set. Please set it first.");
    return;
  }

  try {
    await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: "Approving plan...",
      },
      async () => {
        const response = await fetch(
          `https://jules.googleapis.com/v1alpha/${sessionId}:approvePlan`,
          {
            method: "POST",
            headers: {
              "X-Goog-Api-Key": apiKey,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({}),
          }
        );

        if (!response.ok) {
          throw new Error(
            `Failed to approve plan: ${response.status} ${response.statusText}`
          );
        }

        vscode.window.showInformationMessage("Plan approved successfully!");

        // リフレッシュして最新状態を取得
        await vscode.commands.executeCommand("jules-extension.refreshSessions");
      }
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error occurred.";
    vscode.window.showErrorMessage(`Error approving plan: ${message}`);
  }
}

async function sendMessageToSession(
  context: vscode.ExtensionContext,
  target?: SessionTreeItem | string
): Promise<void> {
  const apiKey = await getStoredApiKey(context);
  if (!apiKey) {
    return;
  }

  const sessionId = resolveSessionId(context, target);
  if (!sessionId) {
    vscode.window.showErrorMessage(
      "No active session available. Please create or select a session first."
    );
    return;
  }

  try {
    const result = await showMessageComposer({
      title: "Send Message to Jules",
      placeholder: "What would you like Jules to do?",
    });

    if (result === undefined) {
      vscode.window.showWarningMessage("Message was cancelled and not sent.");
      return;
    }

    const trimmedPrompt = result.prompt.trim();
    if (!trimmedPrompt) {
      vscode.window.showWarningMessage("Message was empty and not sent.");
      return;
    }

    await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: "Sending message to Jules...",
      },
      async () => {
        const response = await fetch(
          `https://jules.googleapis.com/v1alpha/${sessionId}:sendMessage`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-Goog-Api-Key": apiKey,
            },
            body: JSON.stringify({ prompt: trimmedPrompt }),
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          const message =
            errorText || `${response.status} ${response.statusText}`;
          throw new Error(message);
        }

        vscode.window.showInformationMessage("Message sent successfully!");
      }
    );

    await context.globalState.update("active-session-id", sessionId);
    await context.globalState.update("currentSessionId", sessionId);
    await vscode.commands.executeCommand("jules-extension.refreshActivities");
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error occurred.";
    vscode.window.showErrorMessage(`Failed to send message: ${message}`);
  }
}

function updateStatusBar(
  context: vscode.ExtensionContext,
  statusBarItem: vscode.StatusBarItem
) {
  const selectedSource = context.globalState.get<Source>("selected-source");

  if (selectedSource) {
    // GitHubリポジトリ名を抽出（例: "sources/github/owner/repo" -> "owner/repo"）
    const repoMatch = selectedSource.name?.match(/sources\/github\/(.+)/);
    const repoName = repoMatch ? repoMatch[1] : selectedSource.name;

    statusBarItem.text = `$(repo) Jules: ${repoName}`;
    statusBarItem.tooltip = `Current Source: ${repoName}\nClick to change source`;
    statusBarItem.show();
  } else {
    statusBarItem.text = `$(repo) Jules: No source selected`;
    statusBarItem.tooltip = "Click to select a source";
    statusBarItem.show();
  }
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log(
    'Congratulations, your extension "jules-extension" is now active!'
  );

  // ステータスバーアイテム作成
  const statusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left,
    100
  );
  statusBarItem.command = "jules-extension.listSources";
  context.subscriptions.push(statusBarItem);

  // 初期表示を更新
  updateStatusBar(context, statusBarItem);

  const sessionsProvider = new JulesSessionsProvider(context, statusBarItem);
  const sessionsTreeView = vscode.window.createTreeView("julesSessionsView", {
    treeDataProvider: sessionsProvider,
    showCollapseAll: false,
  });
  console.log("Jules: TreeView created");

  // Create OutputChannel for Activities
  const activitiesChannel =
    vscode.window.createOutputChannel("Jules Activities");
  context.subscriptions.push(activitiesChannel);

  const setApiKeyDisposable = vscode.commands.registerCommand(
    "jules-extension.setApiKey",
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
    "jules-extension.verifyApiKey",
    async () => {
      const apiKey = await getStoredApiKey(context);
      if (!apiKey) {
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
    "jules-extension.listSources",
    async () => {
      const apiKey = await getStoredApiKey(context);
      if (!apiKey) {
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
        const data = (await response.json()) as SourcesResponse;
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
        const selected: SourceQuickPickItem | undefined =
          await vscode.window.showQuickPick(items, {
            placeHolder: "Select a Jules Source",
          });
        if (selected) {
          await context.globalState.update("selected-source", selected.source);
          vscode.window.showInformationMessage(
            `Selected source: ${selected.label}`
          );
          updateStatusBar(context, statusBarItem);
          sessionsProvider.refresh();
        }
      } catch (error) {
        vscode.window.showErrorMessage(
          "Failed to fetch sources. Please check your internet connection."
        );
      }
    }
  );

  const createSessionDisposable = vscode.commands.registerCommand(
    "jules-extension.createSession",
    async () => {
      const selectedSource = context.globalState.get(
        "selected-source"
      ) as Source;
      if (!selectedSource) {
        vscode.window.showErrorMessage(
          "No source selected. Please list and select a source first."
        );
        return;
      }
      const apiKey = await context.secrets.get("jules-api-key");
      if (!apiKey) {
        vscode.window.showErrorMessage(
          'API Key not found. Please set it first using "Set Jules API Key" command.'
        );
        return;
      }

      try {
        const result = await showMessageComposer({
          title: "Create Jules Session",
          placeholder: "Describe the task you want Jules to tackle...",
          showCreatePrCheckbox: true,
        });

        if (result === undefined) {
          vscode.window.showWarningMessage("Session creation was cancelled.");
          return;
        }

        const trimmedPrompt = result.prompt.trim();
        if (!trimmedPrompt) {
          vscode.window.showWarningMessage(
            "Task description was empty. Session not created."
          );
          return;
        }

        const title = trimmedPrompt.split("\n")[0];
        const automationMode = result.createPR ? "AUTO_CREATE_PR" : "MANUAL";
        const requestBody: CreateSessionRequest = {
          prompt: trimmedPrompt,
          sourceContext: {
            source: selectedSource.name || selectedSource.id || "",
            githubRepoContext: {
              startingBranch: "main",
            },
          },
          automationMode,
          title,
        };

        await vscode.window.withProgress(
          {
            location: vscode.ProgressLocation.Notification,
            title: "Creating Jules Session...",
            cancellable: false,
          },
          async (progress) => {
            progress.report({
              increment: 0,
              message: "Sending request...",
            });
            const response = await fetch(
              "https://jules.googleapis.com/v1alpha/sessions",
              {
                method: "POST",
                headers: {
                  "X-Goog-Api-Key": apiKey,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(requestBody),
              }
            );
            progress.report({
              increment: 50,
              message: "Processing response...",
            });
            if (!response.ok) {
              throw new Error(
                `Failed to create session: ${response.status} ${response.statusText}`
              );
            }
            const session = (await response.json()) as SessionResponse;
            await context.globalState.update("active-session-id", session.name);
            progress.report({
              increment: 100,
              message: "Session created!",
            });
            vscode.window.showInformationMessage(
              `Session created: ${session.name}`
            );
          }
        );
      } catch (error) {
        vscode.window.showErrorMessage(
          `Failed to create session: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    }
  );

  // Perform initial refresh to populate the tree view (async, don't wait)
  console.log("Jules: Starting initial refresh...");
  sessionsProvider.refresh();

  startAutoRefresh(context, sessionsProvider);

  const onDidChangeConfiguration = vscode.workspace.onDidChangeConfiguration(
    (event) => {
      if (
        event.affectsConfiguration("jules-extension.autoRefresh.enabled") ||
        event.affectsConfiguration("jules-extension.autoRefresh.interval")
      ) {
        stopAutoRefresh();
        const autoRefreshEnabled = vscode.workspace
          .getConfiguration("jules-extension.autoRefresh")
          .get<boolean>("enabled");
        if (autoRefreshEnabled) {
          startAutoRefresh(context, sessionsProvider);
        }
      }
    }
  );
  context.subscriptions.push(onDidChangeConfiguration);

  const refreshSessionsDisposable = vscode.commands.registerCommand(
    "jules-extension.refreshSessions",
    () => {
      sessionsProvider.refresh();
    }
  );

  const showActivitiesDisposable = vscode.commands.registerCommand(
    "jules-extension.showActivities",
    async (sessionId: string) => {
      const apiKey = await getStoredApiKey(context);
      if (!apiKey) {
        return;
      }
      try {
        const sessionResponse = await fetch(
          `https://jules.googleapis.com/v1alpha/${sessionId}`,
          {
            method: "GET",
            headers: {
              "X-Goog-Api-Key": apiKey,
              "Content-Type": "application/json",
            },
          }
        );
        if (!sessionResponse.ok) {
          const errorText = await sessionResponse.text();
          vscode.window.showErrorMessage(
            `Session not found: ${sessionResponse.status} ${sessionResponse.statusText} - ${errorText}`
          );
          return;
        }
        const session = (await sessionResponse.json()) as Session;
        const response = await fetch(
          `https://jules.googleapis.com/v1alpha/${sessionId}/activities`,
          {
            method: "GET",
            headers: {
              "X-Goog-Api-Key": apiKey,
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          const errorText = await response.text();
          vscode.window.showErrorMessage(
            `Failed to fetch activities: ${response.status} ${response.statusText} - ${errorText}`
          );
          return;
        }
        const data = (await response.json()) as ActivitiesResponse;
        if (!data.activities || !Array.isArray(data.activities)) {
          vscode.window.showErrorMessage("Invalid response format from API.");
          return;
        }
        activitiesChannel.clear();
        activitiesChannel.show();
        activitiesChannel.appendLine(`Activities for session: ${sessionId}`);
        activitiesChannel.appendLine("---");
        if (data.activities.length === 0) {
          activitiesChannel.appendLine("No activities found for this session.");
        } else {
          let planDetected = false;
          data.activities.forEach((activity) => {
            const icon = getActivityIcon(activity);
            const timestamp = new Date(activity.createTime).toLocaleString();
            let message = "";
            if (activity.planGenerated) {
              message = `Plan generated: ${
                activity.planGenerated.plan?.title || "Plan"
              }`;
              planDetected = true;
            } else if (activity.planApproved) {
              message = `Plan approved: ${activity.planApproved.planId}`;
            } else if (activity.progressUpdated) {
              message = `Progress: ${activity.progressUpdated.title}${
                activity.progressUpdated.description
                  ? " - " + activity.progressUpdated.description
                  : ""
              }`;
            } else if (activity.sessionCompleted) {
              message = "Session completed";
            } else {
              message = "Unknown activity";
            }
            activitiesChannel.appendLine(
              `${icon} ${timestamp} (${activity.originator}): ${message}`
            );
          });

          // planGeneratedを検出した場合、承認を促す通知を表示
          if (planDetected) {
            // 最初のユーザーメッセージを取得
            const firstUserActivity = data.activities
              .filter((activity) => activity.originator === "user")
              .sort(
                (a, b) =>
                  new Date(a.createTime).getTime() -
                  new Date(b.createTime).getTime()
              )[0];
            const firstMessage = firstUserActivity
              ? firstUserActivity.progressUpdated?.title ||
                firstUserActivity.progressUpdated?.description ||
                "Initial request"
              : "Initial request";

            vscode.window
              .showInformationMessage(
                `Plan generated for session "${session.title}". Initial request: "${firstMessage}". Would you like to approve it?`,
                "Approve Plan",
                "View Details",
                "Dismiss"
              )
              .then((selection) => {
                if (selection === "Approve Plan") {
                  approvePlan(sessionId, context);
                } else if (selection === "View Details") {
                  activitiesChannel.show();
                }
              });
          }
        }
        await context.globalState.update("currentSessionId", sessionId);
        await context.globalState.update("active-session-id", sessionId);
      } catch (error) {
        vscode.window.showErrorMessage(
          "Failed to fetch activities. Please check your internet connection."
        );
      }
    }
  );

  const refreshActivitiesDisposable = vscode.commands.registerCommand(
    "jules-extension.refreshActivities",
    async () => {
      const currentSessionId = context.globalState.get(
        "currentSessionId"
      ) as string;
      if (!currentSessionId) {
        vscode.window.showErrorMessage(
          "No current session selected. Please show activities first."
        );
        return;
      }
      await vscode.commands.executeCommand(
        "jules-extension.showActivities",
        currentSessionId
      );
    }
  );

  const sendMessageDisposable = vscode.commands.registerCommand(
    "jules-extension.sendMessage",
    async (item?: SessionTreeItem | string) => {
      await sendMessageToSession(context, item);
    }
  );

  const approvePlanDisposable = vscode.commands.registerCommand(
    "jules-extension.approvePlan",
    async () => {
      const sessionId = context.globalState.get<string>("active-session-id");
      if (!sessionId) {
        vscode.window.showErrorMessage(
          "No active session. Please select a session first."
        );
        return;
      }
      await approvePlan(sessionId, context);
    }
  );

  context.subscriptions.push(
    setApiKeyDisposable,
    verifyApiKeyDisposable,
    listSourcesDisposable,
    createSessionDisposable,
    sessionsTreeView,
    refreshSessionsDisposable,
    showActivitiesDisposable,
    refreshActivitiesDisposable,
    sendMessageDisposable,
    approvePlanDisposable
  );
}

// This method is called when your extension is deactivated
export function deactivate() {
  stopAutoRefresh();
}
