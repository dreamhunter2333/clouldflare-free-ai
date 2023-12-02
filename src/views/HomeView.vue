<script setup>
import { NFormItem, NInputGroup } from 'naive-ui';
import { NInput, NCard, NButton, useMessage } from 'naive-ui';
import { ref } from 'vue';
import MarkdownIt from 'markdown-it';

import { api } from '../api';

const message = useMessage();
const md = new MarkdownIt();

const systemPrompt = ref('');
const userPrompt = ref('');
const result = ref('');

const generate = async () => {
  if (!userPrompt.value) {
    message.error('请输入提示词');
    return;
  }
  try {
    const res = await api.textGeneration([
      { role: 'system', content: systemPrompt.value },
      { role: 'user', content: userPrompt.value }
    ]);
    const { response } = res;
    result.value = md.render(response);
  } catch (e) {
    message.error(e.message);
  }
};

</script>

<template>
  <main>
    <h2>文本生成</h2>
    <n-form-item label="系统提示词" label-placement="left">
      <n-input class="left" v-model:value="systemPrompt" type="textarea" :autosize="{
        minRows: 2
      }" />
    </n-form-item>
    <n-form-item label="用户提示词" label-placement="left">
      <n-input class="left" v-model:value="userPrompt" type="textarea" :autosize="{
        minRows: 2
      }" />
    </n-form-item>
    <n-button @click="generate" type="primary">生成</n-button>
    <n-card v-if="result">
      <div class="left" v-html="result"></div>
    </n-card>
  </main>
</template>

<style scoped>
.n-form-item {
  margin-top: 10px;
}

.n-card {
  margin-top: 10px;
}

.left {
  text-align: left;
}
</style>
