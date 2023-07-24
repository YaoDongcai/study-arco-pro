<template>
  <input :value="modelValue" @input="inputEvent" />
</template>

<script lang="ts" setup>
  import { useAttrs } from 'vue';

  const props = defineProps({
    modelValue: String,
    modelModifiers: {
      default: () => ({}),
    },
  });
  const attrs = useAttrs();
  console.log('--attrs', attrs.class);
  const emit = defineEmits(['update:modelValue']);
  const inputEvent = (event: Event) => {
    let { value } = event.target as HTMLInputElement;
    console.log('----', props.modelModifiers);
    if (props.modelModifiers) {
      value = value.charAt(0).toUpperCase() + value.slice(1);
    }
    emit('update:modelValue', value);
  };
</script>
