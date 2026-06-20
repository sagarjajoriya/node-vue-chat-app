<script setup lang="ts">
import { ref } from "vue";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const emit = defineEmits<{
  (e: "join", name: string): void;
}>();

const name = ref("");

function join() {
  if (!name.value.trim()) return;
  emit("join", name.value);
}
</script>

<template>
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center">
    <div class="bg-background p-6 rounded-xl w-80 space-y-4 shadow-lg">
      <h2 class="text-lg font-semibold">Join Chat</h2>

      <Input v-model="name" placeholder="Enter your name" />

      <Button class="w-full" @click="join"> Join </Button>
    </div>
  </div>
</template>
