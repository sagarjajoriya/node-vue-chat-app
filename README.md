# node-vue-chat-app

A minimal real-time chat app built with **Node.js** (WebSocket server) and **Vue 3** (frontend). It demonstrates core WebSocket and chat concepts without over-engineering.

## Features

- Join chat with a display name
- Global chat room with real-time messaging
- Live online users list
- Join/leave system notifications
- Typing indicators
- Message timestamps
- Connection status indicator
- Last 50 messages replayed on join

## Tech Stack

| Layer    | Stack                                      |
| -------- | ------------------------------------------ |
| Server   | Node.js, `ws`                              |
| Client   | Vue 3, Pinia, Vite, Tailwind CSS, TypeScript |

## Project Structure

```
├── client/          # Vue frontend
│   └── src/
│       ├── components/app/   # Chat UI components
│       ├── stores/chat.ts    # WebSocket + state management
│       └── types/chat.ts     # Shared message types
└── server/          # WebSocket server
    └── index.js     # Connection handling & message routing
```

## Getting Started

### Prerequisites

- Node.js `^22.18.0` or `>=24.12.0`

### 1. Install dependencies

```bash
cd server && npm install
cd ../client && npm install
```

### 2. Start the WebSocket server

```bash
cd server
npm start
```

Server runs at `ws://localhost:8080`.

### 3. Start the Vue client

In a separate terminal:

```bash
cd client
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`). Open multiple browser tabs with different usernames to test real-time chat.

## WebSocket Protocol

Messages are JSON with a `type` field:

| Type     | Direction       | Description                          |
| -------- | --------------- | ------------------------------------ |
| `join`   | client → server | Register with a username             |
| `init`   | server → client | User ID, online users, message history |
| `message`| both            | Chat or system messages              |
| `users`  | server → all    | Updated online users list            |
| `typing` | both            | Typing indicator broadcast           |

## Scripts

**Server**

```bash
npm start    # Start WebSocket server
```

**Client**

```bash
npm run dev        # Development server
npm run build      # Production build
npm run type-check # TypeScript check
```

## Author

Sagar Jajoriya
