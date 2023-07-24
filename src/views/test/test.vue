<template>
  测试
  <a-button @click="countSize">点我改变子组件的值</a-button>
  <set-size :size="size" @change="countSize"></set-size>
  <child-input v-model.capitalize="inputValue" class="input-wrap" />
</template>

<script lang="ts" setup>
  import { ref, reactive, computed, watch } from 'vue';
  import setSize from './setSize.vue';
  import childInput from './childInput.vue';

  const inputValue = ref();
  const size = ref(10);
  const countSize = () => {
    size.value += 1;
  };
  watch(
    () => inputValue.value,
    () => {
      console.log('---childInput', inputValue.value);
    }
  );
</script>
