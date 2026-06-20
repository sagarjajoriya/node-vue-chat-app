import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { ChatMessage, ServerEvent, User } from "@/types/chat";

const WS_URL = "ws://localhost:8080";

export const useChatStore = defineStore("chat", () => {
  const socket = ref<WebSocket | null>(null);
  const connected = ref(false);
  const joined = ref(false);
  const userId = ref("");
  const username = ref("");
  const users = ref<User[]>([]);
  const messages = ref<ChatMessage[]>([]);
  const typingUsers = ref<string[]>([]);

  const typingText = computed(() => {
    const names = typingUsers.value.filter((n) => n !== username.value);
    if (names.length === 0) return "";
    if (names.length === 1) return `${names[0]} is typing...`;
    return `${names.join(", ")} are typing...`;
  });

  let typingTimeout: ReturnType<typeof setTimeout> | null = null;

  function handleMessage(data: ServerEvent) {
    switch (data.type) {
      case "init":
        userId.value = data.id;
        users.value = data.users;
        messages.value = data.messages;
        joined.value = true;
        break;
      case "message":
        messages.value.push(data.message);
        break;
      case "users":
        users.value = data.users;
        break;
      case "typing":
        if (data.isTyping) {
          if (!typingUsers.value.includes(data.sender)) {
            typingUsers.value.push(data.sender);
          }
        } else {
          typingUsers.value = typingUsers.value.filter(
            (n) => n !== data.sender
          );
        }
        break;
    }
  }

  function connect(name: string) {
    username.value = name;
    const ws = new WebSocket(WS_URL);
    socket.value = ws;

    ws.onopen = () => {
      connected.value = true;
      ws.send(JSON.stringify({ type: "join", name }));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data) as ServerEvent;
      handleMessage(data);
    };

    ws.onclose = () => {
      connected.value = false;
      joined.value = false;
    };

    ws.onerror = () => {
      connected.value = false;
    };
  }

  function sendMessage(text: string) {
    if (!socket.value || !text.trim()) return;
    socket.value.send(JSON.stringify({ type: "message", text: text.trim() }));
    stopTyping();
  }

  function startTyping() {
    if (!socket.value) return;
    socket.value.send(JSON.stringify({ type: "typing", isTyping: true }));
    if (typingTimeout) clearTimeout(typingTimeout);
    typingTimeout = setTimeout(stopTyping, 2000);
  }

  function stopTyping() {
    if (!socket.value) return;
    socket.value.send(JSON.stringify({ type: "typing", isTyping: false }));
    if (typingTimeout) {
      clearTimeout(typingTimeout);
      typingTimeout = null;
    }
  }

  function disconnect() {
    socket.value?.close();
    socket.value = null;
  }

  return {
    connected,
    joined,
    userId,
    username,
    users,
    messages,
    typingText,
    connect,
    sendMessage,
    startTyping,
    stopTyping,
    disconnect,
  };
});
