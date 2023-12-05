<script setup>
import { NFormItem, NInputGroup, NAvatar } from 'naive-ui';
import { NInput, NCard, NButton, useMessage, NIcon } from 'naive-ui';
import { computed, ref } from 'vue';
import { SmartToyOutlined, ManOutlined } from '@vicons/material';

import { api } from '../api';

const message = useMessage();

const systemPrompt = ref('');
const userPrompt = ref('');
const messageHistory = ref([]);

const reverseMessageHistory = computed(() => {
  return messageHistory.value.slice().reverse();
});

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
  } finally {
    userPrompt.value = '';
  }
};

</script>

<template>
  <main>
    <h3>AI 聊天</h3>
    <n-form-item label="系统提示词" label-placement="left">
      <n-input class="left" v-model:value="systemPrompt" />
    </n-form-item>
    <n-card>
      <div class="chat-box">
        <div v-for="msg in reverseMessageHistory" v-bind:key="msg" :class="msg.role == 'user' ? 'right' : 'left'">
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
      </div>
    </n-card>
    <n-input-group>
      <n-input class="left" clearable @keyup="e => e.keyCode === 13 && send()" v-model:value="userPrompt" />
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

.chat-box {
  display: flex;
  flex-direction: column-reverse;
  height: 60vh;
  overflow: auto;
}

.right {
  text-align: right;
}

.chat-item {
  display: inline-block;
  vertical-align: middle;
}
</style>
