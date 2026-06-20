const WebSocket = require("ws");
const { randomUUID } = require("crypto");

const PORT = 8080;
const MAX_HISTORY = 50;

const wss = new WebSocket.Server({ port: PORT });
const clients = new Map();
const messageHistory = [];

function send(ws, data) {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(data));
  }
}

function broadcast(data, excludeWs = null) {
  const payload = JSON.stringify(data);
  for (const client of wss.clients) {
    if (client !== excludeWs && client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  }
}

function getOnlineUsers() {
  return Array.from(clients.values()).map(({ id, name }) => ({ id, name }));
}

function addSystemMessage(text) {
  const msg = {
    id: randomUUID(),
    type: "system",
    text,
    timestamp: Date.now(),
  };
  messageHistory.push(msg);
  if (messageHistory.length > MAX_HISTORY) messageHistory.shift();
  return msg;
}

wss.on("connection", (ws) => {
  ws.on("message", (raw) => {
    let data;
    try {
      data = JSON.parse(raw.toString());
    } catch {
      return;
    }

    switch (data.type) {
      case "join": {
        const name = data.name?.trim();
        if (!name || clients.has(ws)) return;

        const id = randomUUID();
        clients.set(ws, { id, name });

        send(ws, {
          type: "init",
          id,
          users: getOnlineUsers(),
          messages: messageHistory,
        });

        const joinMsg = addSystemMessage(`${name} joined the chat`);
        broadcast({ type: "message", message: joinMsg }, ws);
        broadcast({ type: "users", users: getOnlineUsers() });
        break;
      }

      case "message": {
        const client = clients.get(ws);
        if (!client) return;

        const text = data.text?.trim();
        if (!text) return;

        const msg = {
          id: randomUUID(),
          type: "chat",
          userId: client.id,
          sender: client.name,
          text,
          timestamp: Date.now(),
        };
        messageHistory.push(msg);
        if (messageHistory.length > MAX_HISTORY) messageHistory.shift();

        broadcast({ type: "message", message: msg });
        break;
      }

      case "typing": {
        const client = clients.get(ws);
        if (!client) return;

        broadcast(
          {
            type: "typing",
            userId: client.id,
            sender: client.name,
            isTyping: !!data.isTyping,
          },
          ws,
        );
        break;
      }
    }
  });

  ws.on("close", () => {
    const client = clients.get(ws);
    if (!client) return;

    clients.delete(ws);

    const leaveMsg = addSystemMessage(`${client.name} left the chat`);
    broadcast({ type: "message", message: leaveMsg });
    broadcast({ type: "users", users: getOnlineUsers() });
  });
});

console.log(`WebSocket server running on ws://localhost:${PORT}`);
