<template>
  测试
  {{ age }}
  {{ newNumber }}
  <a-button @click="changeProps">点我改变事件通知</a-button>
</template>

<script lang="ts" setup>
  import { ref, reactive, computed } from 'vue';

  const emit = defineEmits(['click', 'change']);
  const props = defineProps<{
    size?: number;
  }>();
  const newNumber = computed(() => props.size);
  const age = reactive(ref(10));
  console.log('---age', age.value);
  const changeProps = () => {
    emit('change');
  };
</script>
