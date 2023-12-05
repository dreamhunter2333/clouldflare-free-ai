<script setup>
import { NFormItem, NInputGroup, NScrollbar, NAvatar } from 'naive-ui';
import { NInput, NCard, NButton, useMessage, NIcon } from 'naive-ui';
import { ref } from 'vue';
import { SmartToyOutlined, ManOutlined } from '@vicons/material';

import { api } from '../api';

const message = useMessage();

const systemPrompt = ref('');
const userPrompt = ref('');
const messageHistory = ref([]);

const send = async () => {
  if (!userPrompt.value) {
    message.error('请输入提示词');
    return;
  }
  messageHistory.value.push({
    role: 'user',
    content: userPrompt.value
  });
  try {
    const inputs = []
    if (systemPrompt.value) {
      inputs.push({ role: 'system', content: systemPrompt.value })
    }
    inputs.push(...messageHistory.value.slice(-4))
    const res = await api.textGeneration([
      { role: 'system', content: systemPrompt.value },
      { role: 'user', content: userPrompt.value }
    ]);
    const { response } = res;
    messageHistory.value.push({
      role: 'assistant',
      content: response
    });
  } catch (e) {
    message.error(e.message);
  }
};

</script>

<template>
  <main>
    <h2>AI 聊天</h2>
    <n-form-item label="系统提示词" label-placement="left">
      <n-input class="left" v-model:value="systemPrompt" />
    </n-form-item>
    <n-card>
      <n-scrollbar style="height: 50vh;" trigger="none">
        <div v-for="msg in messageHistory" v-bind:key="msg" :class="msg.role == 'user' ? 'right' : 'left'">
          <div v-if="msg.role != 'user'" class="chat-item">
            <n-avatar>
              <n-icon :component="SmartToyOutlined" />
            </n-avatar>
          </div>
          <div class="chat-item">
            <n-card size="small">{{ msg.content }}</n-card>
          </div>
          <div v-if="msg.role == 'user'" class="chat-item">
            <n-avatar>
              <n-icon :component="ManOutlined" />
            </n-avatar>
          </div>
        </div>
      </n-scrollbar>
    </n-card>
    <n-input-group>
      <n-input class="left" v-model:value="userPrompt" />
      <n-button @click="send" type="primary">发送</n-button>
    </n-input-group>
  </main>
</template>

<style scoped>
.n-form-item {
  margin-top: 10px;
}

.left {
  text-align: left;
}

.n-scrollbar {
  display: flex;
  flex-direction: column-reverse;
}

.right {
  text-align: right;
}

.chat-item {
  display: inline-block;
  vertical-align: middle;
}
</style>
