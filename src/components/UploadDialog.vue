<template>
  <div
    v-if="modelValue"
    class="fixed inset-0 z-[1100] grid place-items-center bg-black/60 overscroll-none"
    @wheel.prevent
    @touchmove.prevent
  >
    <div
      class="upload-dialog w-[92vw] max-w-xl max-h-[90vh] overflow-y-auto overscroll-contain rounded-lg bg-neutral-100 dark:bg-neutral-900 p-4 shadow-lg border border-neutral-300 dark:border-neutral-700"
      @wheel.stop
      @touchmove.stop
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
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-start">
          <!-- 左侧：媒体上传与所见即所得展示 -->
          <div class="md:order-1 space-y-3">
            <div class="hidden md:block">
              <label class="block text-sm mb-1 text-neutral-800 dark:text-neutral-200">媒体</label>
            </div>

            <!-- 桌面端：所见即所得展示区（md及以上显示） -->
            <div
              class="hidden md:block relative rounded-lg overflow-hidden border border-neutral-300 dark:border-neutral-700 bg-neutral-200 dark:bg-neutral-800 group"
              @dragover.prevent
              @drop.prevent="handleDrop"
            >
              <!-- 覆盖式文件选择，仅桌面端 -->
              <input
                type="file"
                accept="image/*"
                @change="onFiles"
                class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />

              <!-- 预览/占位 -->
              <div class="w-full" :style="previewImageStyle">
                <div class="w-full h-full" :style="previewBackgroundStyle"></div>
              </div>

              <!-- 占位提示（无图时显示） -->
              <div
                v-if="media.length === 0"
                class="absolute inset-0 flex flex-col items-center justify-center text-neutral-500 dark:text-neutral-400 pointer-events-none select-none"
              >
                <svg class="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <span class="text-sm">点击或拖拽图片到此处上传</span>
              </div>

              <!-- 删除按钮（有图时显示） -->
              <button
                v-if="media.length > 0"
                type="button"
                @click="removeMedia(0)"
                class="absolute top-2 right-2 z-20 w-8 h-8 bg-neutral-900/80 text-white rounded-full flex items-center justify-center hover:bg-neutral-800 transition-colors border-none"
                style="border: none"
                title="删除已上传图片"
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

            <!-- 移动端缩略图已移至底部，避免顶端出现图片 -->
            <div class="md:hidden"></div>
          </div>

          <!-- 右侧：表单输入区域 -->
          <div class="space-y-3 md:order-2">
            <div>
              <input
                v-model="title"
                placeholder="请输入标题"
                class="w-full px-0 py-2 border-0 bg-transparent text-sm text-neutral-800 dark:text-neutral-200 outline-none"
              />
            </div>
            <div>
              <textarea
                ref="textarea"
                v-model="content"
                rows="1"
                placeholder="请输入内容"
                class="w-full px-0 py-2 border-0 bg-transparent text-sm text-neutral-800 dark:text-neutral-200 outline-none resize-none"
              />
            </div>
            <div>
              <input
                v-model="tags"
                class="w-full px-0 py-2 border-0 bg-transparent text-sm text-neutral-800 dark:text-neutral-200 outline-none"
                placeholder="请输入标签，支持空格或逗号分隔"
              />
            </div>
            <div>
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
                    placeholder="选择日期 YYYY-MM-DD"
                    class="w-full px-0 py-2 border-0 bg-transparent text-sm text-neutral-800 dark:text-neutral-200 outline-none"
                  />
                </template>
              </DatePicker>
            </div>

            <div class="pt-2 space-y-3">
              <!-- 移动端：缩略图列表（置于底部） -->
              <div class="md:hidden">
                <div v-if="media.length > 0" class="">
                  <div class="flex gap-3 overflow-x-auto pb-2">
                    <div v-for="(item, index) in media" :key="index" class="relative flex-shrink-0">
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
                      </div>
                      <button
                        type="button"
                        @click="removeMedia(index)"
                        class="absolute top-0.5 right-0.5 w-5 h-5 bg-neutral-800 text-white rounded-full flex items-center justify-center hover:bg-neutral-700 transition-colors border-none"
                        style="border: none"
                        title="删除文件"
                      >
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              </div>

              <!-- 移动端：底部媒体选择按钮（按钮区之上） -->
              <div class="md:hidden">
                <div class="flex items-center gap-3">
                  <span class="text-sm text-neutral-800 dark:text-neutral-200">媒体</span>
                  <div class="relative inline-block">
                    <input
                      ref="fileInput"
                      type="file"
                      accept="image/*"
                      @change="onFiles"
                      class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div
                      class="inline-flex items-center gap-2 px-3 py-1.5 border border-neutral-300 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-800 rounded-md text-sm text-neutral-600 dark:text-neutral-400 hover:border-neutral-400 dark:hover:border-neutral-500 transition-colors cursor-pointer"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                      <span>选择图片文件</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 按钮区：始终在最底部一行（移动端右对齐） -->
              <div class="flex items-center justify-end gap-2">
                <button
                  type="button"
                  class="md:hidden px-3 py-1.5 rounded-md font-medium transition-all duration-200 border-none shadow-sm"
                  :disabled="media.length === 0"
                  @click="media.length > 0 && showPreview(media[0])"
                  :class="
                    media.length > 0
                      ? 'text-white hover:shadow-md cursor-pointer'
                      : 'bg-neutral-300 dark:bg-neutral-600 text-neutral-500 dark:text-neutral-400 cursor-not-allowed'
                  "
                  :style="media.length > 0 ? { backgroundColor: SITE_MAIN_COLOR } : {}"
                >
                  预览
                </button>

                <button
                  type="submit"
                  :disabled="!isFormValid"
                  :class="[
                    'px-3 py-1.5 rounded-md font-medium transition-all duration-200 border-none shadow-sm',
                    isFormValid
                      ? 'text-white hover:shadow-md cursor-pointer'
                      : 'bg-neutral-300 dark:bg-neutral-600 text-neutral-500 dark:text-neutral-400 cursor-not-allowed',
                  ]"
                  :style="isFormValid ? { backgroundColor: SITE_MAIN_COLOR } : {}"
                >
                  录入
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
    <!-- 移动端：大图遮罩预览（点击触发） -->
    <div
      v-if="previewItem"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-[1200] md:hidden overscroll-contain"
      @click="hidePreview"
      @wheel.prevent
      @touchmove.prevent
    >
      <div class="relative w-[90vw] max-w-[560px] overflow-x-hidden overscroll-contain" @click.stop>
        <!-- 固定在预览窗口右上角的关闭按钮（不随内容滚动） -->
        <button
          @click="hidePreview"
          class="absolute top-3 right-3 w-8 h-8 bg-neutral-800 text-white rounded-full flex items-center justify-center hover:bg-neutral-700 transition-colors border-none"
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

        <!-- 可滚动内容容器 -->
        <div class="max-h-[90vh] overflow-y-auto overscroll-contain" @wheel.stop @touchmove.stop>
          <div
            class="rounded-lg bg-neutral-100 dark:bg-neutral-900 shadow-2xl border border-neutral-300 dark:border-neutral-700 overflow-hidden"
          >
            <!-- 上：图片（等比，自适应宽度） -->
            <div class="w-full" :style="previewImageStyle">
              <div class="w-full h-full" :style="previewBackgroundStyle"></div>
            </div>
            <!-- 下：文本内容 -->
            <div class="p-4 space-y-2">
              <div class="text-base font-semibold text-neutral-900 dark:text-neutral-100">
                {{ title || '未命名标题' }}
              </div>
              <div class="text-xs text-neutral-500 dark:text-neutral-400">
                {{ date || '未选择日期' }}
              </div>
              <div v-if="(tags || '').trim()" class="flex flex-wrap gap-2">
                <span
                  v-for="(t, i) in tags
                    .split(',')
                    .map((s) => s.trim())
                    .filter(Boolean)"
                  :key="i"
                  class="px-2 py-0.5 rounded-full text-xs bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
                  >{{ t }}</span
                >
              </div>
              <div
                class="text-sm leading-6 whitespace-pre-wrap text-neutral-800 dark:text-neutral-200"
              >
                {{ content || '（无内容）' }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref, watch, onUnmounted, PropType, computed } from 'vue';
  import { useTextareaAutosize } from '@vueuse/core';
  import { useTimelineStore } from '../stores/timeline';
  import type { MediaItem } from '../stores/timeline';
  import { useThemeStore } from '../stores/theme';
  import { SITE_MAIN_COLOR } from '../config/siteTheme';

  export default defineComponent({
    name: 'UploadDialog',
    props: {
      modelValue: { type: Boolean as PropType<boolean>, required: true },
    },
    emits: ['update:modelValue'],
    setup(
      props: { modelValue: boolean },
      { emit }: { emit: (e: 'update:modelValue', value: boolean) => void },
    ) {
      const title = ref('');
      const content = ref('');
      // 使用 VueUse 的自适应高度文本域
      const { textarea } = useTextareaAutosize({ input: content as unknown as any });
      const tags = ref('');
      const date = ref<string>('');
      const media = ref<MediaItem[]>([]);

      const fileInput = ref<HTMLInputElement | null>(null);
      const theme = useThemeStore();
      const isDark = computed(() => theme.mode === 'dark');
      const previewItem = ref<MediaItem | null>(null);

      watch(
        () => props.modelValue,
        (v: boolean) => {
          if (v) {
            title.value = '我的标题';
            content.value = `风吹过山谷，带来清晨的凉意，
一束光落在静谧的湖面，
像时间遗落的羽毛，轻轻颤动。
我们在世间奔走，
却常忘记抬头望一眼天边，
那缓慢移动的云，
早已替我们写下温柔的答复。`;
            tags.value = '旅游, 动物';
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
          // 只处理图片文件
          if (!file.type.startsWith('image/')) {
            continue;
          }

          const mediaItem: any = {
            type: 'image',
            url: URL.createObjectURL(file),
            fileName: file.name, // 保存文件名
          };

          // 检测图片比例
          const img = new Image();
          img.onload = () => {
            // 使用原始像素宽高，避免精度丢失
            const aspectRatio = `${img.width}/${img.height}`;
            const index = media.value.findIndex((m: MediaItem) => m.url === mediaItem.url);
            if (index !== -1) {
              media.value[index].aspectRatio = aspectRatio;
            }
            console.log('[UploadDialog] parsed aspectRatio:', aspectRatio, 'raw:', {
              width: img.width,
              height: img.height,
            });
          };
          img.src = mediaItem.url;

          media.value.push(mediaItem);
        }
      }

      // 桌面端拖拽上传
      function handleDrop(e: DragEvent) {
        const files = e.dataTransfer ? Array.from(e.dataTransfer.files) : [];
        const fakeInput = { files } as unknown as HTMLInputElement;
        onFiles({ target: fakeInput } as unknown as Event);
      }

      // 获取文件名
      function getFileName(url: string): string {
        // 如果是blob URL，尝试从media数组中获取文件名
        const mediaItem = media.value.find((item: MediaItem) => item.url === url);
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

      // 计算表单是否有效
      const isFormValid = computed(() => {
        return title.value.trim() && content.value.trim() && date.value && media.value.length > 0;
      });

      function onSubmit() {
        // 验证必填字段
        if (!title.value.trim()) {
          (window as any).$toast?.error('请填写标题');
          return;
        }

        if (!content.value.trim()) {
          (window as any).$toast?.error('请填写内容');
          return;
        }

        if (!date.value) {
          (window as any).$toast?.error('请选择日期');
          return;
        }

        if (media.value.length === 0) {
          (window as any).$toast?.info('请选择图片');
          return;
        }

        // 所有验证通过，保存数据
        store.addItem({
          title: title.value.trim(),
          content: content.value.trim(),
          tags: tags.value
            .split(',')
            .map((t: string) => t.trim())
            .filter(Boolean),
          date: date.value,
          media: media.value,
        });

        // 显示成功提示
        (window as any).$toast?.success('保存成功');
        emit('update:modelValue', false);
      }

      // 计算预览图片样式（aspect-ratio容器）
      const previewImageStyle = computed(() => {
        if (media.value.length === 0) return { aspectRatio: '16/9', width: '100%' } as any;
        const firstMedia = media.value[0];
        let ratio = '16/9';
        if (firstMedia.aspectRatio) {
          const parts = firstMedia.aspectRatio.split('/').map(Number);
          if (parts[0] > 0 && parts[1] > 0) {
            ratio = `${parts[0]}/${parts[1]}`;
          }
        }
        console.log('[UploadDialog] container aspect-ratio:', ratio);
        return { aspectRatio: ratio, width: '100%' } as any;
      });

      // 背景图样式，确保任何比例都cover填充
      const previewBackgroundStyle = computed(() => {
        const url =
          media.value.length > 0 && media.value[0].type === 'image' ? media.value[0].url : '';
        return {
          backgroundImage: url ? `url('${url}')` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
        } as any;
      });

      function showPreview(item: MediaItem) {
        previewItem.value = item;
      }

      function hidePreview() {
        previewItem.value = null;
      }

      const previewContainerStyle = computed(() => {
        if (!previewItem.value || previewItem.value.type !== 'image') {
          return {} as any;
        }
        const item = previewItem.value as any;
        if (item.aspectRatio) {
          const [width, height] = item.aspectRatio.split('/').map(Number);
          if (width && height) {
            const maxWidth = window.innerWidth * 0.9;
            const maxHeight = window.innerHeight * 0.9;
            const aspectRatio = width / height;
            let finalWidth: number, finalHeight: number;
            if (aspectRatio > 1) {
              finalWidth = Math.min(maxWidth, maxHeight * aspectRatio);
              finalHeight = finalWidth / aspectRatio;
            } else {
              finalHeight = Math.min(maxHeight, maxWidth / aspectRatio);
              finalWidth = finalHeight * aspectRatio;
            }
            return { width: `${finalWidth}px`, height: `${finalHeight}px` } as any;
          }
        }
        return { width: '264px', height: '346px' } as any;
      });

      return {
        title,
        content,
        tags,
        date,
        media,
        fileInput,
        onFiles,
        onSubmit,
        isDark,
        getFileName,
        removeMedia,
        handleDrop,
        showPreview,
        hidePreview,
        previewItem,
        previewContainerStyle,
        isFormValid,
        SITE_MAIN_COLOR,
        previewImageStyle,
        previewBackgroundStyle,
        textarea,
      };
    },
  });
</script>

<style scoped>
  /* 左侧展示区已使用内联计算宽高以保持比例 */
</style>
