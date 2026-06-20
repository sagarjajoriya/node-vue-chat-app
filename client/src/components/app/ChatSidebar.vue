<script setup lang="ts">
import type { User } from "@/types/chat";

defineProps<{
  users: User[];
  currentUserId: string;
}>();
</script>

<template>
  <aside class="w-64 border-r p-3 space-y-2">
    <h2 class="text-sm font-semibold mb-2">
      Online Users
      <span class="text-muted-foreground font-normal">({{ users.length }})</span>
    </h2>

    <div
      v-for="user in users"
      :key="user.id"
      class="p-2 rounded transition"
      :class="user.id === currentUserId ? 'bg-accent' : ''"
    >
      <div class="flex justify-between items-center">
        <span>
          {{ user.name }}
          <span v-if="user.id === currentUserId" class="text-xs text-muted-foreground"
            >(you)</span
          >
        </span>
        <span class="text-green-500 text-xs">●</span>
      </div>
    </div>

    <p v-if="users.length === 0" class="text-sm text-muted-foreground">
      No users online
    </p>
  </aside>
</template>
