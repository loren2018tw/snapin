<template>
  <div class="toolbar">
    <div class="tool-wrapper">
      <q-btn icon="open_with" flat round class="drag-btn" title="移動視窗" />
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
      <q-fab
        v-model="isFabOpen"
        :icon="shapeToolIcon"
        direction="left"
        padding="xs"
        flat
        :color="isShapeToolActive ? 'primary' : 'grey'"
        class="tool-btn"
      >
        <q-fab-action
          icon="rectangle"
          @click="setTool('Rectangle')"
          color="primary"
          title="長方形"
        />
        <q-fab-action
          icon="radio_button_unchecked"
          @click="setTool('Ellipse')"
          color="primary"
          title="橢圓形"
        />
      </q-fab>
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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';

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
const isFabOpen = ref(false);

const shapeToolIcon = computed(() => {
  if (activeTool.value === 'Rectangle') return 'rectangle';
  if (activeTool.value === 'Ellipse') return 'radio_button_unchecked';
  return 'category';
});

const isShapeToolActive = computed(() => {
  return ['Rectangle', 'Ellipse'].includes(activeTool.value);
});

function setTool(tool: string) {
  if (isWhiteboardMode.value && tool === 'Mouse Pointer') {
    // 在白板模式下，不允許切換到滑鼠指標工具
    return;
  }
  activeTool.value = tool;
  isFabOpen.value = false;
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

function handleKeydown(e: KeyboardEvent) {
  window.electronAPI?.send('hotkey-pressed', e.key.toLowerCase());
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
  window.electronAPI?.on('update-tool', (tool) => {
    activeTool.value = tool as string;
    isFabOpen.value = false;
  });
  window.electronAPI?.on('toggle-whiteboard-hotkey', () => {
    toggleWhiteboardMode();
  });
  window.electronAPI?.on('close-fab', () => {
    isFabOpen.value = false;
  });
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
});
</script>

<style scoped>
.toolbar {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  height: 100%;
  background-color: transparent;
  padding: 0; /* Remove padding here, move it to the inner container */
  gap: 5px;
  position: relative;
}

.toolbar::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 46px;
  height: 100%;
  background-color: #f5f5f5;
  z-index: -1;
  border-radius: 4px 0 0 4px;
}

/* Inner container for buttons to ensure central alignment within the 46px stripe */
.tool-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 46px;
  height: 100%;
  padding: 7px 0;
  gap: 5px;
  -webkit-app-region: no-drag;
}

.drag-btn {
  width: 32px;
  height: 32px;
  -webkit-app-region: drag; /* 允許此按鈕拖拽視窗 */
  cursor: move;
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
