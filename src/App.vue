<template>
  <div class="toolbar">
    <q-btn
      icon="brush"
      flat
      round
      :color="activeTool === 'brush1' ? 'primary' : 'grey'"
      @click="setTool('brush1')"
      class="tool-btn"
    />
    <q-btn
      icon="brush"
      flat
      round
      :color="activeTool === 'brush2' ? 'primary' : 'grey'"
      @click="setTool('brush2')"
      class="tool-btn"
    />
    <q-btn
      icon="category"
      flat
      round
      :color="activeTool === 'shape' ? 'primary' : 'grey'"
      @click="setTool('shape')"
      class="tool-btn"
    />
    <q-btn icon="close" flat round color="negative" @click="closeApp" class="close-btn" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const activeTool = ref('brush1');

function setTool(tool: string) {
  activeTool.value = tool;
  // TODO: 實現工具切換邏輯
}

function closeApp() {
  void (
    window as Window & { electronAPI?: { hideWindow: () => Promise<void> } }
  ).electronAPI?.hideWindow();
}
</script>

<style scoped>
.toolbar {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #f5f5f5;
  padding: 10px;
  gap: 5px;
  -webkit-app-region: drag; /* 允許拖拽整個區域 */
  overflow: hidden; /* 隱藏任何溢出內容 */
}

.tool-btn {
  width: 32px;
  height: 32px;
  -webkit-app-region: no-drag; /* 按鈕本身不參與拖拽 */
}

.close-btn {
  margin-top: auto;
  width: 32px;
  height: 32px;
  -webkit-app-region: no-drag; /* 按鈕本身不參與拖拽 */
}
</style>
