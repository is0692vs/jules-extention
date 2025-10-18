# Extension Jules pour VSCode

[![VSCode Extension](https://img.shields.io/badge/VSCode-Extension-blue.svg)](https://marketplace.visualstudio.com/items?itemName=YOUR_PUBLISHER.jules-extension)
[![Status](https://img.shields.io/badge/status-development-yellow.svg)](#)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

> "Découvrez l'avenir du codage avec Google Jules dans VSCode"

L'extension Jules est une extension qui vous permet de piloter l'agent de codage IA de Google, **Jules**, directement depuis VSCode.
Accueillez un partenaire intelligent dans votre flux de travail de codage.

## ✨ Concept

Cette extension a été créée pour faire passer votre expérience de développement au niveau supérieur.

- **Intégration Transparente :** Accédez aux puissantes fonctionnalités de Jules sans quitter votre environnement VSCode habituel.
- **Collaboration en Temps Réel :** De la création d'une session de codage à la vérification de sa progression, tout se fait en temps réel.
- **Saut de Productivité :** Laissez les tâches fastidieuses à Jules et concentrez-vous sur votre travail créatif.

## 🚀 Fonctionnalités Clés

| Fonctionnalité         | Description                                                                                                                                                                                                                            | Commande / Icône                  |
| :--------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------------------------------- |
| **Définir la Clé API** | Lors de la première utilisation, définissez votre clé API pour vous connecter à votre compte Jules. La clé est stockée en toute sécurité dans le SecretStorage de VSCode et utilisée automatiquement pour toutes les requêtes ultérieures. | `jules-extension.setApiKey`       |
| **Gestion des Sessions**| Utilisez la commande `> Jules: Create Session` pour assigner une nouvelle tâche de codage à Jules. Les sessions passées sont également listées, vous permettant de reprendre le travail ou de consulter l'historique des tâches terminées à tout moment. | `jules-extension.createSession`   |
| **Surveillance en Temps Réel**| Obtenez un aperçu de l'état de travail actuel de Jules (`Running`, `Active`, `Done`, etc.) dans une vue de la barre latérale dédiée. Plus besoin de basculer entre votre navigateur et votre éditeur.                               | `julesSessionsView`               |
| **Mise à Jour de la Progression**| Curieux de savoir où en est Jules ? Cliquez sur le bouton `↻` (actualiser) pour récupérer et afficher instantanément le dernier état de la session et la liste des activités.                                                    | `jules-extension.refreshSessions` |
| **Affichage de l'Activité**| Sélectionnez une session pour afficher les journaux détaillés des commandes que Jules a exécutées, les fichiers qu'il a modifiés et son processus de pensée. Cela offre une expérience de développement transparente, comme si vous regardiez dans l'esprit de Jules. | `jules-extension.showActivities`  |

### Aperçu : Vue des Sessions Jules

```
┌──────────────────────────────┐
│ ▼ JULES SESSIONS        ↻    │
├──────────────────────────────┤
│  ▶ session-xyz-123 (Running) │
│  ▶ session-abc-456 (Active)  │
│  ⏹ session-def-789 (Done)    │
└──────────────────────────────┘
```

_(Ceci est un concept d'interface utilisateur. L'affichage réel peut différer.)_

## 📦 Installation

### Depuis le Marketplace (Recommandé)

1.  Recherchez "Jules Extension" sur le Marketplace de VSCode (bientôt disponible)
2.  Cliquez sur le bouton `Install`

### Depuis un Fichier VSIX (Installation Manuelle)

Si vous souhaitez essayer les dernières fonctionnalités qui ne sont pas encore publiées sur le Marketplace, vous pouvez télécharger et installer le fichier `.vsix` directement depuis la page des versions.

1.  **Allez à la Page des Versions :**
    Visitez les [Versions GitHub](https://github.com/your-repo/jules-extension/releases) et trouvez la dernière version.

2.  **Téléchargez le Fichier VSIX :**
    Téléchargez le fichier `.vsix` (par ex., `jules-extension-0.1.0.vsix`) depuis les `Assets`.

3.  **Installez dans VSCode :**
    - Ouvrez VSCode.
    - Allez dans la vue `Extensions` (`Ctrl+Shift+X`).
    - Cliquez sur le menu `...` (Plus d'Actions) en haut de la vue et sélectionnez `Installer depuis VSIX...`.
    - Sélectionnez le fichier `.vsix` téléchargé pour l'installer.

## 🔑 Obtenir Votre Clé API

Pour utiliser l'extension Jules, vous avez besoin d'une clé API Jules. Suivez ces étapes pour en obtenir une :

1.  **Créez un Compte :**
    - Allez sur le [Site Officiel de Jules](https://jules.google/docs).
    - Inscrivez-vous pour un nouveau compte ou connectez-vous si vous en avez déjà un.

2.  **Générez la Clé API :**
    - Accédez à la section "Clés API" ou "Paramètres du Développeur" dans votre tableau de bord.
    - Cliquez sur "Créer une nouvelle clé secrète".
    - Donnez un nom descriptif à votre clé (par ex., "Extension VSCode") et générez-la.

3.  **Copiez Votre Clé :**
    - Votre nouvelle clé API sera affichée. Copiez-la dans votre presse-papiers.
    - Si vous avez besoin de revoir votre clé plus tard, vous pouvez toujours la trouver sur votre page de paramètres Jules.

> **Important :** Traitez votre clé API comme un mot de passe. Ne la partagez pas publiquement et ne la commitez pas dans le contrôle de version.

## Démarrage Rapide

1.  Appuyez sur `Ctrl + Shift + P` (ou `Cmd + Shift + P`) pour ouvrir la Palette de Commandes.
2.  Exécutez `> Jules: Set Jules API Key` et entrez votre clé API.
3.  Cliquez sur l'icône `$(robot)` dans la barre latérale pour ouvrir la Vue des Sessions Jules.
4.  Exécutez `> Jules: Create Jules Session` pour démarrer votre première session de codage !

## ⚠️ Remarques Importantes

- **Rendu des Blocs de Cartes :** Lorsque vous utilisez des fonctionnalités affichées sous forme de blocs de cartes, veuillez faire attention à la structure du contenu pour garantir un rendu correct.

## 🤝 Contribution

Ce projet ne fait que commencer. Nous accueillons toutes les formes de contribution, y compris les rapports de bogues, les suggestions de fonctionnalités et les pull requests !
Veuillez consulter le Suivi des Problèmes et les Pull Requests.

## 📝 Licence

[MIT](LICENSE)