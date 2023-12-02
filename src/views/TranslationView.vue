<script setup>
import { NFormItem, NSelect, NInputGroup, NIcon } from 'naive-ui';
import { NInput, NCard, NButton, useMessage } from 'naive-ui';
import { ref } from 'vue';
import { SwapHorizRound } from '@vicons/material'

import { api } from '../api';
import { langs } from '../constant/langs';

const message = useMessage();

const sourceLang = ref('en');
const targetLang = ref('zh');
const sourceText = ref('');
const result = ref('');


const swap = () => {
  const temp = sourceLang.value;
  sourceLang.value = targetLang.value;
  targetLang.value = temp;
};

const translation = async () => {
  if (!sourceText.value) {
    message.error('请输入需要翻译的文字');
    return;
  }
  try {
    const res = await api.translation({
      text: sourceText.value,
      source_lang: sourceLang.value,
      target_lang: targetLang.value,
    });
    const { translated_text } = res;
    result.value = translated_text;
  } catch (e) {
    message.error(e.message);
  }
};

</script>

<template>
  <main>
    <h2>翻译</h2>
    <div>
      <n-form-item label="源语言" label-placement="top">
        <n-select v-model:value="sourceLang" filterable placeholder="源语言" :options="langs" />
      </n-form-item>
      <n-button quaternary @click="swap">
        <template #icon>
          <n-icon :component="SwapHorizRound" />
        </template>
      </n-button>
      <n-form-item label="目标语言" label-placement="top">
        <n-select v-model:value="targetLang" filterable placeholder="目标语言" :options="langs" />
      </n-form-item>
    </div>
    <n-input class="left" v-model:value="sourceText" type="textarea" placeholder="请输入需要翻译的文字" :autosize="{
      minRows: 2
    }" />
    <n-button @click="translation" type="primary">翻译</n-button>
    <n-card v-if="result" class="left">
      {{ result }}
    </n-card>
  </main>
</template>

<style scoped>
.n-form-item {
  display: inline-block;
}

.n-card {
  margin-top: 10px;
}

.left {
  text-align: left;
}
</style>
