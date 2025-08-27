<template>
  <div v-if="modelValue" class="fixed inset-0 z-[1100] grid place-items-center bg-black/60">
    <div
      class="w-[92vw] max-w-xl rounded-lg bg-neutral-100 dark:bg-neutral-900 p-4 shadow-lg border border-neutral-300 dark:border-neutral-700"
    >
      <div class="flex items-center justify-between mb-3">
        <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-200">录入</h3>
        <button
          @click="$emit('update:modelValue', false)"
          class="text-neutral-400 hover:text-neutral-200 dark:text-neutral-500 dark:hover:text-neutral-800 transition-all duration-200 bg-none border-none"
          style="background: none; border: none"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18 18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      <form class="space-y-3" @submit.prevent="onSubmit">
        <div>
          <label class="block text-sm mb-1 text-neutral-800 dark:text-neutral-200">标题</label>
          <input
            v-model="title"
            class="w-full px-0 py-2 border-0 border-b border-neutral-300 dark:border-neutral-600 bg-transparent text-sm text-neutral-800 dark:text-neutral-200 outline-none focus:border-neutral-400"
            required
          />
        </div>
        <div>
          <label class="block text-sm mb-1 text-neutral-800 dark:text-neutral-200">内容</label>
          <textarea
            v-model="content"
            rows="3"
            class="w-full px-0 py-2 border-0 border-b border-neutral-300 dark:border-neutral-600 bg-transparent text-sm text-neutral-800 dark:text-neutral-200 outline-none focus:border-neutral-400"
            required
          />
        </div>
        <div>
          <label class="block text-sm mb-1 text-neutral-800 dark:text-neutral-200"
            >标签（逗号分隔）</label
          >
          <input
            v-model="tags"
            class="w-full px-0 py-2 border-0 border-b border-neutral-300 dark:border-neutral-600 bg-transparent text-sm text-neutral-800 dark:text-neutral-200 outline-none focus:border-neutral-400"
            placeholder="旅行, 宠物"
          />
        </div>
        <div>
          <label class="block text-sm mb-1 text-neutral-800 dark:text-neutral-200">日期</label>
          <DatePicker
            v-model="date"
            :model-config="{ type: 'string', mask: 'YYYY-MM-DD' }"
            :popover="{ visibility: 'focus' }"
            :is24hr="true"
            color="accent"
            :teleport="true"
            :transparent="true"
            :borderless="true"
            class="w-full"
          >
            <template #default="{ inputValue, inputEvents }">
              <input
                :value="inputValue"
                v-on="inputEvents"
                readonly
                placeholder="YYYY-MM-DD"
                class="w-full px-0 py-2 border-0 border-b border-neutral-300 dark:border-neutral-600 bg-transparent text-sm text-neutral-800 dark:text-neutral-200 outline-none focus:border-neutral-400"
              />
            </template>
          </DatePicker>
        </div>
        <div>
          <label class="block text-sm mb-1 text-neutral-800 dark:text-neutral-200">媒体</label>
          <input
            type="file"
            multiple
            accept="image/*,video/*"
            @change="onFiles"
            class="w-full px-0 py-2 border-0 border-b border-neutral-300 dark:border-neutral-600 bg-transparent text-sm text-neutral-800 dark:text-neutral-200 outline-none focus:border-neutral-400"
          />
        </div>
        <div class="pt-2 flex justify-end gap-2">
          <button
            type="button"
            class="px-3 py-1 rounded-md border border-neutral-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:border-neutral-400 dark:hover:border-neutral-600"
            @click="$emit('update:modelValue', false)"
          >
            取消
          </button>
          <button
            type="submit"
            class="px-3 py-1 rounded-md bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-300 dark:hover:bg-neutral-700 border border-neutral-300 dark:border-neutral-700"
          >
            保存
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref, watch, onUnmounted, PropType } from 'vue';
  import { useTimelineStore } from '../stores/timeline';
  import type { MediaItem } from '../stores/timeline';

  export default defineComponent({
    name: 'UploadDialog',
    props: {
      modelValue: { type: Boolean as PropType<boolean>, required: true },
    },
    emits: ['update:modelValue'],
    setup(props, { emit }) {
      const title = ref('');
      const content = ref('');
      const tags = ref('');
      const date = ref<string>('');
      const media = ref<MediaItem[]>([]);

      watch(
        () => props.modelValue,
        (v) => {
          if (v) {
            title.value = '';
            content.value = '';
            tags.value = '';
            date.value = new Date().toISOString().slice(0, 10);
            media.value = [];
            // 禁止页面滚动
            if (typeof document !== 'undefined') {
              document.body.style.overflow = 'hidden';
            }
          } else {
            // 恢复页面滚动
            if (typeof document !== 'undefined') {
              document.body.style.overflow = '';
            }
          }
        },
        { immediate: true },
      );

      onUnmounted(() => {
        if (typeof document !== 'undefined') {
          document.body.style.overflow = '';
        }
      });

      function onFiles(e: Event) {
        const input = e.target as HTMLInputElement;
        const files = input.files ? Array.from(input.files) : [];
        media.value = [];

        for (const file of files) {
          const mediaItem: any = {
            type: file.type.startsWith('video') ? 'video' : 'image',
            url: URL.createObjectURL(file),
          };

          // 检测图片比例
          if (file.type.startsWith('image')) {
            const img = new Image();
            img.onload = () => {
              const gcd = (a: number, b: number) => (b === 0 ? a : gcd(b, a % b));
              const divisor = gcd(img.width, img.height);
              const aspectRatio = `${img.width / divisor}/${img.height / divisor}`;
              const index = media.value.findIndex((m) => m.url === mediaItem.url);
              if (index !== -1) {
                media.value[index].aspectRatio = aspectRatio;
              }
            };
            img.src = mediaItem.url;
          }

          media.value.push(mediaItem);
        }
      }

      const store = useTimelineStore();
      function onSubmit() {
        if (!title.value || !content.value || !date.value || media.value.length === 0) return;
        store.addItem({
          title: title.value,
          content: content.value,
          tags: tags.value
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean),
          date: date.value,
          media: media.value,
        });
        emit('update:modelValue', false);
      }

      return { title, content, tags, date, media, onFiles, onSubmit };
    },
  });
</script>

<style scoped></style>
