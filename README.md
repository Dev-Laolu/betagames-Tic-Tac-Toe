# 🎮 Beta Games

Welcome to **Beta Games** --- an offline X and O (Tic-Tac-Toe) game
built with **TypeScript**.

Beta Games is designed to run completely offline, with all logic handled
locally in the application. It features structured game components,
clean architecture, and scalable AI logic for multiple difficulty
levels.

------------------------------------------------------------------------

## 🚀 About The App

**Beta Games** is a modern, offline X and O game built using:

-   ⚡ TypeScript
-   ⚛️ Component-based architecture
-   🧠 Local game logic (no server required)
-   📴 Fully offline functionality

All game decisions --- including player moves, AI calculations, win
detection, and draw detection --- are handled locally within the
application.

------------------------------------------------------------------------

## 🧠 Offline Logic System

This game works completely offline.

✔ No API calls\
✔ No backend server\
✔ No database\
✔ No internet connection required

All logic is stored and executed inside:

    services/gameLogic.ts

The AI logic includes:

-   Win detection algorithm\
-   Block opponent strategy\
-   Priority move selection\
-   Smart move evaluation\
-   Difficulty level scaling

------------------------------------------------------------------------

## 📁 Project Structure

Below is the folder structure of the project:

    beta-games-_x-and-o/
    │
    ├── asset/
    │   └── betagames.png
    │
    ├── components/
    │   ├── AuthScreen.tsx
    │   ├── GameMenu.tsx
    │   ├── GameView.tsx
    │   ├── LoadingScreen.tsx
    │   ├── ModeSelection.tsx
    │   ├── PlayerSelection.tsx
    │   └── SymbolSelection.tsx
    │
    ├── dist/
    ├── node_modules/
    │
    ├── services/
    │   └── gameLogic.ts
    │
    ├── .env.local
    ├── .gitignore
    ├── App.tsx
    ├── index.html
    ├── index.tsx
    ├── metadata.json
    ├── package-lock.json
    ├── package.json
    ├── README.md
    ├── tsconfig.json
    ├── types.ts
    └── vite.config.ts

------------------------------------------------------------------------

## 🧩 Core Components

### 🎮 GameView.tsx

Main game board UI and interaction logic.

### 📋 GameMenu.tsx

Handles game navigation and menu system.

### 🔐 AuthScreen.tsx

Authentication or entry screen logic.

### 🎯 ModeSelection.tsx

Choose game mode (Player vs Player / Player vs AI).

### 👤 PlayerSelection.tsx

Handles player configuration.

### ❌⭕ SymbolSelection.tsx

Allows users to choose X or O.

### ⚙ services/gameLogic.ts

Contains: - Board representation - AI algorithm - Win/draw detection -
Move validation - Game reset logic

------------------------------------------------------------------------

## 🛠️ Installation & Setup

1.  Clone the repository:

``` bash
git clone https://github.com/Dev-Laolu
```

2.  Navigate into the project folder:

``` bash
cd beta-games-_x-and-o
```

3.  Install dependencies:

``` bash
npm install
```

4.  Run the development server:

``` bash
npm run dev
```

------------------------------------------------------------------------

## 🎯 Features

✨ Offline Gameplay\
✨ Smart AI System\
✨ Multiple Game Levels\
✨ Clean TypeScript Architecture\
✨ Scalable Component Structure\
✨ Responsive UI

------------------------------------------------------------------------

## 🏆 Difficulty Levels

Game difficulty levels can scale from:

-   Novice
-   Strategist
-   Master
-   Grandmaster
-   Titan
-   Demigod ⚡

The AI strength increases based on algorithm depth and move evaluation
logic.

------------------------------------------------------------------------

## 📌 Technologies Used

-   TypeScript
-   Vite
-   Component-based UI architecture
-   Local game logic system

------------------------------------------------------------------------

## 👨‍💻 Developer

**Olayinka Hopewell (Laolu The Creator)**

🌐 Website:\
https://sites.google.com/view/laoluthecreator/

🐙 GitHub:\
https://github.com/Dev-Laolu

💼 LinkedIn:\
https://www.linkedin.com/in/olayinkahopewell/

📸 Instagram:\
https://www.instagram.com/laoluthedesigner/

------------------------------------------------------------------------

## 📄 License

This project is open for learning, development, and personal improvement
purposes.

------------------------------------------------------------------------

## 🔥 Beta Games

Built with logic.\
Designed with strategy.\
Powered offline.
