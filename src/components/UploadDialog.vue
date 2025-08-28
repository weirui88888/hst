<template>
  <div v-if="modelValue" class="fixed inset-0 z-[1100] grid place-items-center bg-black/60">
    <div
      class="w-[92vw] max-w-xl rounded-lg bg-neutral-100 dark:bg-neutral-900 p-4 shadow-lg border border-neutral-300 dark:border-neutral-700"
    >
      <div class="flex items-center justify-between mb-3">
        <h3 class="text-lg font-semibold text-neutral-800 dark:text-neutral-200">录入</h3>
        <button
          @click="$emit('update:modelValue', false)"
          class="text-neutral-400 hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300 transition-all duration-200 bg-none border-none"
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
            >标签（逗号或空格分隔）</label
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
            :is24hr="true"
            :popover="{ visibility: 'focus' }"
            class="w-full"
            color="orange"
          >
            <template #default="{ inputValue, inputEvents }">
              <input
                :value="inputValue"
                v-on="inputEvents"
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
          <!-- 文件预览区域 -->
          <div v-if="media.length > 0" class="mt-3">
            <div class="flex gap-3 overflow-x-auto pb-2">
              <div v-for="(item, index) in media" :key="index" class="relative flex-shrink-0">
                <!-- 预览图容器 -->
                <div
                  class="w-16 h-16 rounded-md overflow-hidden bg-neutral-200 dark:bg-neutral-700 cursor-pointer"
                  @click="showPreview(item)"
                >
                  <img
                    v-if="item.type === 'image'"
                    :src="item.url"
                    :alt="`预览图 ${index + 1}`"
                    class="w-full h-full object-cover"
                  />
                  <div
                    v-else
                    class="w-full h-full flex items-center justify-center text-neutral-400"
                  >
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                </div>
                <!-- 删除按钮 -->
                <button
                  type="button"
                  @click="removeMedia(index)"
                  class="absolute top-0px right-0px text-neutral-400 hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300 transition-all duration-200 bg-none border-none"
                  style="background: none; border: none"
                  title="删除文件"
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
            </div>
          </div>

          <!-- 大预览图遮罩 -->
          <div
            v-if="previewItem"
            class="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]"
            @click="hidePreview"
          >
            <div class="relative w-[264px] h-[346px]">
              <img
                v-if="previewItem.type === 'image'"
                :src="previewItem.url"
                :alt="'大预览图'"
                class="w-full h-full object-cover rounded-lg shadow-2xl"
              />
              <div
                v-else
                class="w-full h-full bg-neutral-800 rounded-lg flex items-center justify-center text-neutral-400"
              >
                <div class="text-center">
                  <svg
                    class="w-16 h-16 mx-auto mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p class="text-lg">视频文件</p>
                </div>
              </div>
              <!-- 关闭按钮 -->
              <button
                @click="hidePreview"
                class="absolute -top-4 -right-4 w-8 h-8 bg-neutral-800 text-white rounded-full flex items-center justify-center hover:bg-neutral-700 transition-colors border-none"
                style="border: none"
                title="关闭预览"
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
          </div>
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
  import { defineComponent, ref, watch, onUnmounted, PropType, computed } from 'vue';
  import { useTimelineStore } from '../stores/timeline';
  import type { MediaItem } from '../stores/timeline';
  import { useThemeStore } from '../stores/theme';

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
      const previewItem = ref<MediaItem | null>(null);
      const theme = useThemeStore();
      const isDark = computed(() => theme.mode === 'dark');

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
            fileName: file.name, // 保存文件名
          };

          // 检测图片比例
          if (file.type.startsWith('image')) {
            const img = new Image();
            img.onload = () => {
              const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
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

      // 获取文件名
      function getFileName(url: string): string {
        // 如果是blob URL，尝试从media数组中获取文件名
        const mediaItem = media.value.find((item) => item.url === url);
        if (mediaItem && (mediaItem as any).fileName) {
          return (mediaItem as any).fileName;
        }
        // 否则从URL中提取文件名
        const urlParts = url.split('/');
        return urlParts[urlParts.length - 1] || '未知文件';
      }

      // 删除媒体文件
      function removeMedia(index: number) {
        // 释放blob URL以避免内存泄漏
        if (media.value[index] && media.value[index].url.startsWith('blob:')) {
          URL.revokeObjectURL(media.value[index].url);
        }
        media.value.splice(index, 1);
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

      // 显示大预览图
      function showPreview(item: MediaItem) {
        previewItem.value = item;
      }

      // 隐藏大预览图
      function hidePreview() {
        previewItem.value = null;
      }

      return {
        title,
        content,
        tags,
        date,
        media,
        onFiles,
        onSubmit,
        isDark,
        getFileName,
        removeMedia,
        showPreview,
        hidePreview,
        previewItem,
      };
    },
  });
</script>
