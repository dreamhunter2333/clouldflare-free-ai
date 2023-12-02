<script setup>
import { NInput, NCard, NButton, useMessage, NImageGroup, NImage } from 'naive-ui';
import { computed, ref } from 'vue';

import { api } from '../api';

const message = useMessage();

const prompt = ref('');
const images = ref([]);

const generate = async () => {
  if (!prompt.value) {
    message.error('请输入提示词');
    return;
  }
  try {
    const blob = await api.textToImage({
      prompt: prompt.value
    });
    images.value.push({
      prompt: prompt.value,
      src: URL.createObjectURL(blob)
    });
    if (images.value.length > 20) {
      images.value.shift();
    }
  } catch (e) {
    message.error(e.message);
  }
};

const reversedImages = computed(() => images.value.slice().reverse());
</script>

<template>
  <main>
    <h2>图片生成</h2>
    <n-input v-model:value="prompt" type="textarea" placeholder="请输入提示词" :autosize="{
      minRows: 2
    }" />
    <n-button @click="generate" type="primary">生成</n-button>
    <n-card v-if="reversedImages.length > 0">
      <n-image-group>
        <n-space v-for="image in reversedImages" v-bind:key="image">
          <n-image width="300" :src="image.src" />
          <p>{{ image.prompt }}</p>
        </n-space>
      </n-image-group>
    </n-card>
  </main>
</template>

<style scoped>
.n-card {
  margin-top: 10px;
}

.n-button {
  margin-top: 10px;
}

.n-image {
  margin-left: 10px;
}
</style>
