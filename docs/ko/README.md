# VSCode용 Jules 확장 프로그램

![Jules Extension Icon](../jules-extension/icon.png)

[![VSCode Extension](https://img.shields.io/badge/VSCode-Extension-blue.svg)](https://marketplace.visualstudio.com/items?itemName=YOUR_PUBLISHER.jules-extension)
[![Status](https://img.shields.io/badge/status-development-yellow.svg)](#)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

> "VSCode에서 Google Jules와 함께 코딩의 미래를 경험하세요"

Jules 확장 프로그램은 Google의 AI 코딩 에이전트 **Jules**를 VSCode 내에서 직접 조작할 수 있게 해주는 확장 프로그램입니다.
코딩 워크플로우에 지능적인 파트너를 맞이하세요.

## ✨ 컨셉

이 확장 프로그램은 개발 경험을 한 단계 끌어올리기 위해 만들어졌습니다.

- **원활한 통합:** 익숙한 VSCode 환경을 벗어나지 않고 Jules의 강력한 기능에 액세스합니다.
- **실시간 협업:** 코딩 세션 생성부터 진행 상황 확인까지 모든 것이 실시간으로 이루어집니다.
- **생산성 향상:** Jules가 지루한 작업을 처리하는 동안 창의적인 작업에 집중할 수 있습니다.

## 🚀 주요 기능

| 기능                   | 설명                                                                                                                                                                               | 명령어 / 아이콘                   |
| :--------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------------------------------- |
| **API 키 설정**        | 처음 사용 시 Jules 계정에 연결하기 위한 API 키를 설정합니다. 키는 VSCode의 SecretStorage에 안전하게 저장되며 이후의 모든 요청에 자동으로 사용됩니다.                               | `jules-extension.setApiKey`       |
| **세션 관리**          | `> Jules: Create Session` 명령으로 Jules에게 새로운 코딩 작업을 요청합니다. 과거 세션도 나열되어 언제든지 작업을 재개하거나 완료된 작업의 기록을 검토할 수 있습니다.               | `jules-extension.createSession`   |
| **실시간 모니터링**    | 사이드바에 추가된 전용 보기에서 Jules의 현재 작업 상태(`Running`, `Active`, `Done` 등)를 한눈에 파악할 수 있습니다. 더 이상 브라우저와 편집기를 반복적으로 전환할 필요가 없습니다. | `julesSessionsView`               |
| **진행 상황 업데이트** | Jules가 얼마나 진행되었는지 궁금할 때 `↻`(새로 고침) 버튼을 클릭하세요. Jules가 수행한 세션 상태와 최신 활동 목록을 즉시 가져와 업데이트합니다.                                    | `jules-extension.refreshSessions` |
| **활동 표시**          | 세션을 선택하면 Jules가 실행한 명령어, 편집한 파일, 사고 과정 등의 자세한 로그를 확인할 수 있습니다. 마치 Jules의 사고를 들여다보는 것처럼 투명한 개발 경험을 제공합니다.          | `jules-extension.showActivities`  |

### 미리보기: Jules 세션 보기

```
┌──────────────────────────────┐
│ ▼ JULES SESSIONS        ↻    │
├──────────────────────────────┤
│  ▶ session-xyz-123 (Running) │
│  ▶ session-abc-456 (Active)  │
│  ⏹ session-def-789 (Done)    │
└──────────────────────────────┘
```

_(이것은 UI 이미지입니다. 실제 디스플레이는 다를 수 있습니다.)_

## 📦 설치

[Visual Studio Code Marketplace](https://marketplace.visualstudio.com/items?itemName=HirokiMukai.jules-extension)에서 설치하세요.

또는 VS Code의 확장 프로그램 보기에서 "Jules Extension"을 검색하세요.

### 마켓플레이스에서 (권장)

1.  VSCode 마켓플레이스에서 "Jules Extension"을 검색합니다.
2.  `Install` 버튼을 클릭합니다.

## 🔑 API 키 취득

Jules 확장 프로그램을 사용하려면 Jules API 키가 필요합니다. 다음 단계에 따라 취득하세요:

1.  **계정 생성:**

    - [Jules 공식 사이트](https://jules.google/docs)를 방문합니다.
    - 새 계정을 등록하거나 기존 계정으로 로그인합니다.

2.  **API 키 생성:**

    - 계정 대시보드에서 "API 키" 또는 "개발자 설정" 섹션으로 이동합니다.
    - "새 비밀 키 생성"을 클릭합니다.
    - 키에 이해하기 쉬운 이름(예: "VSCode 확장 프로그램")을 지정하고 생성합니다.

3.  **키 복사:**
    - 새 API 키가 표시됩니다. 클립보드에 복사하세요.
    - 나중에 키를 다시 확인해야 하는 경우 Jules의 설정 페이지에서 언제든지 볼 수 있습니다.

> **중요:** API 키를 비밀번호처럼 취급하세요. 공개적으로 공유하거나 버전 제어에 커밋하지 마세요.

## 빠른 시작

1.  `Ctrl + Shift + P` (또는 `Cmd + Shift + P`)로 명령 팔레트를 엽니다.
2.  `> Jules: Set Jules API Key`를 실행하여 API 키를 설정합니다.
3.  사이드바에서 `$(robot)` 아이콘을 클릭하여 Jules 세션 보기를 엽니다.
4.  `> Jules: Create Jules Session`을 실행하여 첫 번째 코딩 세션을 시작하세요!

## 📚 참고

- [Jules 공식 사이트](https://jules.google/docs)
- [Jules API 문서](https://developers.google.com/jules/api)

## 🤝 기여

이 프로젝트는 이제 막 시작되었습니다. 버그 보고, 기능 제안, 풀 리퀘스트 등 모든 형태의 기여를 환영합니다!
이슈 트래커와 풀 리퀘스트를 확인해주세요.

## � 링크

- [Marketplace](https://marketplace.visualstudio.com/items?itemName=HirokiMukai.jules-extension)
- [GitHub 리포지토리](https://github.com/is0692vs/jules-extension.git)
- [문제 보고](https://github.com/is0692vs/jules-extension/issues)

## 📝 라이선스

[MIT](../../LICENSE)
