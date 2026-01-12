<template>
  <div class="toolbar">
    <div class="drag-handle"></div>
    <q-btn
      icon="brush"
      flat
      round
      :color="activeTool === 'brush1' ? 'primary' : 'grey'"
      @click="setTool('brush1')"
      class="tool-btn"
      title="畫筆"
    />
    <q-btn
      icon="auto_fix_normal"
      flat
      round
      :color="activeTool === 'Trail Pen' ? 'primary' : 'grey'"
      @click="setTool('Trail Pen')"
      class="tool-btn"
      title="軌跡筆"
    />
    <q-btn
      icon="rectangle"
      flat
      round
      :color="activeTool === 'Rectangle' ? 'primary' : 'grey'"
      @click="setTool('Rectangle')"
      class="tool-btn"
      title="長方形"
    />
    <q-btn
      icon="mouse"
      flat
      round
      :color="activeTool === 'Mouse Pointer' ? 'primary' : 'grey'"
      @click="setTool('Mouse Pointer')"
      class="tool-btn"
      title="滑鼠指標"
    />
    <q-btn
      icon="cleaning_services"
      flat
      round
      color="orange"
      @click="clearCanvas"
      class="tool-btn"
      title="清除畫布"
    />
    <q-btn
      icon="layers"
      flat
      round
      :color="isWhiteboardMode ? 'primary' : 'grey'"
      @click="toggleWhiteboardMode"
      class="tool-btn"
      title="白板模式"
    />
    <q-btn
      icon="close"
      flat
      round
      color="negative"
      @click="closeApp"
      class="close-btn"
      title="關閉程式"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

declare global {
  interface Window {
    electronAPI?: {
      quitApp: () => Promise<void>;
      hideWindow: () => Promise<void>;
      toggleWhiteboard: (isWhiteboardMode: boolean) => void;
      send: (channel: string, ...args: unknown[]) => void;
      on: (channel: string, callback: (...args: unknown[]) => void) => void;
      onClearDrawing: (callback: () => void) => void;
    };
  }
}

const activeTool = ref('brush1');
const isWhiteboardMode = ref(false);

function setTool(tool: string) {
  if (isWhiteboardMode.value && tool === 'Mouse Pointer') {
    // 在白板模式下，不允許切換到滑鼠指標工具
    return;
  }
  activeTool.value = tool;
  window.electronAPI?.send('set-tool', tool);
  if (tool === 'Mouse Pointer') {
    window.electronAPI?.send('set-ignore-mouse-events', true);
  } else {
    window.electronAPI?.send('set-ignore-mouse-events', false);
  }
}

function clearCanvas() {
  console.log('clear-canva');
  window.electronAPI?.send('clear-canvas');
}

function toggleWhiteboardMode() {
  isWhiteboardMode.value = !isWhiteboardMode.value;
  window.electronAPI?.toggleWhiteboard(isWhiteboardMode.value);
  if (isWhiteboardMode.value && activeTool.value === 'Mouse Pointer') {
    setTool('brush1');
  }
}

function closeApp() {
  console.log('hide-windows');
  void window.electronAPI?.hideWindow();
}

onMounted(() => {
  window.electronAPI?.on('update-tool', (tool) => {
    activeTool.value = tool as string;
  });
  window.electronAPI?.on('toggle-whiteboard-hotkey', () => {
    toggleWhiteboardMode();
  });
});
</script>

<style scoped>
.toolbar {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #f5f5f5;
  padding: 7px;
  gap: 5px;
  -webkit-app-region: drag; /* 允許拖拽整個區域 */
  overflow: hidden; /* 隱藏任何溢出內容 */
}

.drag-handle {
  height: 30px;
  background-color: #e68e30;
  -webkit-app-region: drag;
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
