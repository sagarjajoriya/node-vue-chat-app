<script setup lang="ts">
import { ref, watch, nextTick } from "vue";
import { storeToRefs } from "pinia";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useChatStore } from "@/stores/chat";
import type { ChatMessage } from "@/types/chat";

const chat = useChatStore();
const { messages, userId, typingText } = storeToRefs(chat);

const draft = ref("");
const messagesEl = ref<HTMLElement | null>(null);

function formatTime(timestamp: number) {
  return new Date(timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function isOwnMessage(msg: ChatMessage) {
  return msg.type === "chat" && msg.userId === userId.value;
}

function send() {
  if (!draft.value.trim()) return;
  chat.sendMessage(draft.value);
  draft.value = "";
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    send();
  }
}

watch(
  messages,
  async () => {
    await nextTick();
    if (messagesEl.value) {
      messagesEl.value.scrollTop = messagesEl.value.scrollHeight;
    }
  },
  { deep: true },
);
</script>

<template>
  <main class="flex-1 flex flex-col">
    <div class="border-b p-3 font-medium">General Chat</div>

    <div ref="messagesEl" class="flex-1 p-4 space-y-3 overflow-y-auto">
      <div
        v-for="msg in messages"
        :key="msg.id"
        :class="msg.type === 'system' ? 'text-center' : ''"
      >
        <p
          v-if="msg.type === 'system'"
          class="text-xs text-muted-foreground italic"
        >
          {{ msg.text }}
        </p>

        <div v-else :class="isOwnMessage(msg) ? 'flex justify-end' : ''">
          <div
            class="max-w-[70%] rounded-lg px-3 py-2"
            :class="
              isOwnMessage(msg)
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted'
            "
          >
            <p
              v-if="!isOwnMessage(msg)"
              class="text-xs font-medium mb-1 opacity-70"
            >
              {{ msg.sender }}
            </p>
            <p class="text-sm whitespace-pre-wrap break-words">{{ msg.text }}</p>
            <p
              class="text-[10px] mt-1 opacity-60"
              :class="isOwnMessage(msg) ? 'text-right' : ''"
            >
              {{ formatTime(msg.timestamp) }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <p
      v-if="typingText"
      class="px-4 pb-1 text-xs text-muted-foreground italic h-5"
    >
      {{ typingText }}
    </p>

    <div class="border-t p-3 flex gap-2">
      <Input
        v-model="draft"
        class="flex-1"
        placeholder="Type a message..."
        @input="chat.startTyping"
        @keydown="onKeydown"
      />
      <Button @click="send">Send</Button>
    </div>
  </main>
</template>
