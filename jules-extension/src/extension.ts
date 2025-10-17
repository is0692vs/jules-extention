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

interface Session {
  name: string;
  title: string;
  state: "RUNNING" | "COMPLETED" | "FAILED" | "CANCELLED";
  // Add other fields if needed
}

interface SessionsResponse {
  sessions: Session[];
}

interface Activity {
  name: string;
  createTime: string;
  originator: "user" | "agent";
  id: string;
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

  refresh(): void {
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
      return data.sessions.map((session) => new SessionTreeItem(session));
    } catch (error) {
      return [];
    }
  }
}

class SessionTreeItem extends vscode.TreeItem {
  constructor(public readonly session: Session) {
    super(session.title || session.name, vscode.TreeItemCollapsibleState.None);
    this.tooltip = `${session.name} - ${session.state}`;
    this.description = session.state;
    this.iconPath = this.getIcon(session.state);
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

  const refreshSessionsDisposable = vscode.commands.registerCommand(
    "jules-extension.refreshSessions",
    () => {
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
          data.activities.forEach((activity) => {
            const icon = getActivityIcon(activity);
            const timestamp = new Date(activity.createTime).toLocaleString();
            let message = "";
            if (activity.planGenerated) {
              message = `Plan generated: ${
                activity.planGenerated.plan?.title || "Plan"
              }`;
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
        }
        await context.globalState.update("currentSessionId", sessionId);
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

  context.subscriptions.push(
    disposable,
    setApiKeyDisposable,
    verifyApiKeyDisposable,
    listSourcesDisposable,
    createSessionDisposable,
    sessionsTreeView,
    refreshSessionsDisposable,
    showActivitiesDisposable,
    refreshActivitiesDisposable
  );
}

// This method is called when your extension is deactivated
export function deactivate() {}
