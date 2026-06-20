<script setup lang="ts">
defineProps<{
  username: string;
  connected: boolean;
}>();
</script>

<template>
  <header class="h-14 border-b flex items-center justify-between px-4">
    <div class="flex items-center gap-3">
      <h1 class="font-semibold">Vue Chat</h1>
      <span
        class="text-xs px-2 py-0.5 rounded-full"
        :class="
          connected
            ? 'bg-green-100 text-green-700'
            : 'bg-red-100 text-red-700'
        "
      >
        {{ connected ? "Connected" : "Disconnected" }}
      </span>
    </div>

    <div class="text-sm text-muted-foreground">
      Logged in as:
      <span class="font-medium">{{ username }}</span>
    </div>
  </header>
</template>
