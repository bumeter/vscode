# Changelog

## 0.2.1

- Clearer name and description on the Marketplace. Nothing else changes.

## 0.2.0

- Built from its own repository (bumeter/vscode); the UI comes from `@bumeter/ui`, `bum` from bumeter/statusline releases. Nothing changes in use.

## 0.1.0

First release.

- Status bar: 5-hour and weekly quota and this workspace's latest context, with reset times and the forecast on hover.
- Explorer marks for files agents read 3 times or more in 7 days (`bumeter.decorations.*`).
- Overview panel: the Bumeter app's Overview, Conversations, Skills and Settings.
- Works in remote windows (SSH, WSL, Dev Containers, Codespaces); `bum` is bundled (`bumeter.binaryPath` to use another).
