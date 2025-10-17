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
    "julius-extension.autoRefresh"
  );
  const isEnabled = config.get<boolean>("enabled");
  const interval = config.get<number>("interval", 30000);

  if (!isEnabled) {
    return;
  }

  if (autoRefreshInterval) {
    clearInterval(autoRefreshInterval);
  }

  autoRefreshInterval = setInterval(() => {
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
  implements vscode.TreeDataProvider<SessionTreeItem>
{
  private _onDidChangeTreeData: vscode.EventEmitter<
    SessionTreeItem | undefined | null | void
  > = new vscode.EventEmitter<SessionTreeItem | undefined | null | void>();
  readonly onDidChangeTreeData: vscode.Event<
    SessionTreeItem | undefined | null | void
  > = this._onDidChangeTreeData.event;

  constructor(private context: vscode.ExtensionContext) {}

  async refresh(): Promise<void> {
    const sessions = (await this.fetchSessions()).map((item) => item.session);
    const completedSessions = checkForCompletedSessions(sessions);
    for (const session of completedSessions) {
      const prUrl = extractPRUrl(session);
      if (prUrl) {
        await notifyPRCreated(session, prUrl);
      }
    }
    updatePreviousStates(sessions);
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: SessionTreeItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: SessionTreeItem): Thenable<SessionTreeItem[]> {
    if (element) {
      return Promise.resolve([]);
    } else {
      return this.fetchSessions();
    }
  }

  private async fetchSessions(): Promise<SessionTreeItem[]> {
    const apiKey = await this.context.secrets.get("jules-api-key");
    if (!apiKey) {
      return [];
    }
    try {
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
        return [];
      }
      const data = (await response.json()) as SessionsResponse;
      if (!data.sessions || !Array.isArray(data.sessions)) {
        return [];
      }

      // 各セッションのアクティビティをチェックして完了状態を検知
      const sessionsWithCheckedState = await Promise.all(
        data.sessions.map(async (session) => {
          try {
            const activitiesResponse = await fetch(
              `https://jules.googleapis.com/v1alpha/${session.name}/activities`,
              {
                method: "GET",
                headers: {
                  "X-Goog-Api-Key": apiKey,
                  "Content-Type": "application/json",
                },
              }
            );
            if (activitiesResponse.ok) {
              const activitiesData =
                (await activitiesResponse.json()) as ActivitiesResponse;
              const hasSessionCompleted = activitiesData.activities?.some(
                (activity) => activity.sessionCompleted
              );
              if (hasSessionCompleted && session.state !== "COMPLETED") {
                // APIのstateがCOMPLETEDでないが、アクティビティにsessionCompletedがある場合
                return { ...session, state: "COMPLETED" as const };
              }
            }
          } catch (error) {
            // アクティビティ取得失敗時は元のstateを使用
            console.warn(
              `Failed to check activities for session ${session.name}:`,
              error
            );
          }
          return session;
        })
      );

      return sessionsWithCheckedState.map((session) => {
        const mappedSession = {
          ...session,
          state: mapApiStateToSessionState(session.state),
        };
        return new SessionTreeItem(mappedSession);
      });
    } catch (error) {
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
  const apiKey = await context.secrets.get("jules-api-key");
  if (!apiKey) {
    vscode.window.showErrorMessage(
      'API Key not set. Please configure it using "Set Jules API Key" first.'
    );
    return;
  }

  let sessionId =
    (typeof target === "string" ? target : undefined) ??
    (target instanceof SessionTreeItem ? target.session.name : undefined) ??
    context.globalState.get<string>("active-session-id") ??
    context.globalState.get<string>("currentSessionId");

  if (!sessionId) {
    vscode.window.showErrorMessage(
      "No active session available. Please create or select a session first."
    );
    return;
  }

  const prompt = await vscode.window.showInputBox({
    prompt: "Enter your message to Jules",
    placeHolder: "e.g., Can you add unit tests?",
  });

  if (prompt === undefined) {
    return;
  }

  const trimmedPrompt = prompt.trim();
  if (!trimmedPrompt) {
    vscode.window.showWarningMessage("Message was empty and not sent.");
    return;
  }

  try {
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
    // currentSessionId is a legacy key maintained for backward compatibility
    await context.globalState.update("currentSessionId", sessionId);
    await vscode.commands.executeCommand("jules-extension.refreshActivities");
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error occurred.";
    vscode.window.showErrorMessage(`Failed to send message: ${message}`);
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

  // Create OutputChannel for Activities
  const activitiesChannel =
    vscode.window.createOutputChannel("Jules Activities");
  context.subscriptions.push(activitiesChannel);

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  const disposable = vscode.commands.registerCommand(
    "jules-extension.helloWorld",
    () => {
      // The code you place here will be executed every time your command is executed
      // Display a message box to the user
      vscode.window.showInformationMessage("Hello World from jules-extension!");
    }
  );

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
    "jules-extension.listSources",
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

  const createSessionDisposable = vscode.commands.registerCommand(
    "jules-extension.createSession",
    async () => {
      const selectedSource = context.globalState.get(
        "selectedSource"
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
      const prompt = await vscode.window.showInputBox({
        prompt: "Enter your task description for Jules",
        placeHolder: "e.g., Fix the login bug in authentication.ts",
      });
      if (!prompt) {
        return;
      }
      const title = await vscode.window.showInputBox({
        prompt: "Enter a title for the session",
        placeHolder: "e.g., Fix Login Bug",
        value: prompt.split(".")[0],
      });
      if (!title) {
        return;
      }
      const createPR = await vscode.window.showQuickPick(["Yes", "No"], {
        placeHolder: "Create PR automatically?",
      });
      if (createPR === undefined) {
        return;
      }
      const automationMode = createPR === "Yes" ? "AUTO_CREATE_PR" : "MANUAL";
      const requestBody: CreateSessionRequest = {
        prompt,
        sourceContext: {
          source: selectedSource.name || selectedSource.id || "",
          githubRepoContext: {
            startingBranch: "main",
          },
        },
        automationMode,
        title,
      };
      try {
        await vscode.window.withProgress(
          {
            location: vscode.ProgressLocation.Notification,
            title: "Creating Jules Session...",
            cancellable: false,
          },
          async (progress) => {
            progress.report({ increment: 0, message: "Sending request..." });
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
            progress.report({ increment: 100, message: "Session created!" });
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

  const sessionsProvider = new JulesSessionsProvider(context);
  const sessionsTreeView = vscode.window.createTreeView("julesSessionsView", {
    treeDataProvider: sessionsProvider,
  });

  startAutoRefresh(context, sessionsProvider);

  const onDidChangeConfiguration = vscode.workspace.onDidChangeConfiguration(
    (event) => {
      if (
        event.affectsConfiguration("julius-extension.autoRefresh.enabled") ||
        event.affectsConfiguration("julius-extension.autoRefresh.interval")
      ) {
        stopAutoRefresh();
        const autoRefreshEnabled = vscode.workspace
          .getConfiguration("julius-extension.autoRefresh")
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
      resetAutoRefresh(context, sessionsProvider);
      sessionsProvider.refresh();
    }
  );

  const showActivitiesDisposable = vscode.commands.registerCommand(
    "jules-extension.showActivities",
    async (sessionId: string) => {
      const apiKey = await context.secrets.get("jules-api-key");
      if (!apiKey) {
        vscode.window.showErrorMessage(
          'API Key not found. Please set it first using "Set Jules API Key" command.'
        );
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
    disposable,
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
