# Jules Extension

Jules Extension is a VS Code extension that integrates with the Jules AI platform to provide AI-powered development assistance directly within your editor.

## Features

- **Set Jules API Key**: Securely configure your Jules API credentials
- **Verify API Key**: Test your API connection
- **List Jules Sources**: Browse available data sources
- **Create Session**: Start new Jules analysis sessions
- **View Sessions**: Monitor active and completed sessions in the sidebar
- **Show Activities**: Track session activities and progress
- **GitHub PR Links**: Automatically display GitHub PR links created by Jules

## Requirements

- VS Code 1.105.0 or later
- Jules API key (obtain from [julesai.com](https://julesai.com))

## Extension Settings

This extension contributes the following settings:

- `jules-extension.apiKey`: Your Jules API key for authentication

## Commands

- `Jules Extension: Set Jules API Key` - Configure your API credentials
- `Jules Extension: Verify Jules API Key` - Test your API connection
- `Jules Extension: List Jules Sources` - Browse available sources
- `Jules Extension: Create Jules Session` - Start a new analysis session
- `Jules Extension: Refresh Jules Sessions` - Reload the sessions list
- `Jules Extension: Show Jules Activities` - View session activities
- `Jules Extension: Refresh Jules Activities` - Update activities view

## Known Issues

- Initial API key setup requires VS Code restart to take effect
- Session refresh may take a few seconds depending on API response time

## Release Notes

### 0.1.0-mvp

Initial MVP release of Jules Extension featuring:

- API key management
- Session creation and monitoring
- Activity tracking
- GitHub PR integration

## For more information

- [Jules AI Documentation](https://julesai.com/docs)
- [VS Code Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines)

**Enjoy using Jules Extension!**
