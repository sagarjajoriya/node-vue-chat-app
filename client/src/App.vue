<script setup lang="ts">
import { onUnmounted } from "vue";
import { storeToRefs } from "pinia";

import ChatSidebar from "@/components/app/ChatSidebar.vue";
import ChatHeader from "@/components/app/ChatHeader.vue";
import ChatWindow from "@/components/app/ChatWindow.vue";
import JoinDialog from "@/components/app/JoinDialog.vue";
import { useChatStore } from "@/stores/chat";

const chat = useChatStore();
const { joined, username, users, userId } = storeToRefs(chat);

function handleJoin(name: string) {
  chat.connect(name);
}

onUnmounted(() => {
  chat.disconnect();
});
</script>

<template>
  <JoinDialog v-if="!joined" @join="handleJoin" />

  <div v-else class="h-screen flex flex-col">
    <ChatHeader :username="username" :connected="chat.connected" />

    <div class="flex flex-1 overflow-hidden">
      <ChatSidebar :users="users" :current-user-id="userId" />

      <ChatWindow />
    </div>
  </div>
</template>
