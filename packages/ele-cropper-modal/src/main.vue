<!-- 图片裁剪弹窗组件 license by http://eleadmin.com -->
<template>
  <a-modal
    :visible="visible"
    :title="title"
    :width="width"
    :centered="centered"
    :closable="closable"
    :destroy-on-close="destroyOnClose"
    :force-render="forceRender"
    :keyboard="keyboard"
    :mask="mask"
    :mask-closable="maskClosable"
    :mask-style="maskStyle"
    :wrap-class-name="wrapClassName"
    :z-index="zIndex"
    :dialog-style="dialogStyle"
    :dialog-class="dialogClass"
    :footer="null"
    @update:visible="updateVisible"
    @cancel="onClosed">
    <template #title>
      <slot name="title"/>
    </template>
    <ele-cropper
      v-if="show"
      :src="src"
      :aspect-ratio="aspectRatio"
      :view-mode="viewMode"
      :accept="accept"
      :drag-mode="dragMode"
      :initial-aspect-ratio="initialAspectRatio"
      :min-container-width="minContainerWidth"
      :min-container-height="minContainerHeight"
      :min-canvas-width="minCanvasWidth"
      :min-canvas-height="minCanvasHeight"
      :min-crop-box-width="minCropBoxWidth"
      :min-crop-box-height="minCropBoxHeight"
      :cropped-width="croppedWidth"
      :cropped-height="croppedHeight"
      :cropped-min-width="croppedMinWidth"
      :cropped-min-height="croppedMinHeight"
      :cropped-max-width="croppedMaxWidth"
      :cropped-max-height="croppedMaxHeight"
      :cropped-fill-color="croppedFillColor"
      :to-blob="toBlob"
      :image-smoothing-enabled="imageSmoothingEnabled"
      :image-smoothing-quality="imageSmoothingQuality"
      :tools="tools"
      :show-preview="showPreview"
      @done="onDone"/>
  </a-modal>
</template>

<script>
import EleCropper from '../../ele-cropper';

export default {
  name: 'EleCropperModal',
  components: {EleCropper},
  props: {
    visible: Boolean,
    // cropper参数
    src: String,
    aspectRatio: {
      type: Number,
      default: 1
    },
    viewMode: Number,
    dragMode: String,
    initialAspectRatio: Number,
    minContainerWidth: Number,
    minContainerHeight: Number,
    minCanvasWidth: Number,
    minCanvasHeight: Number,
    minCropBoxWidth: Number,
    minCropBoxHeight: Number,
    croppedWidth: Number,
    croppedHeight: Number,
    croppedMinWidth: Number,
    croppedMinHeight: Number,
    croppedMaxWidth: Number,
    croppedMaxHeight: Number,
    croppedFillColor: Number,
    imageSmoothingEnabled: Boolean,
    imageSmoothingQuality: String,
    toBlob: Boolean,
    accept: {
      type: String,
      default: 'image/*'
    },
    tools: {
      type: [Boolean, String],
      default: true
    },
    showPreview: {
      type: Boolean,
      default: true
    },
    // 弹窗参数
    centered: Boolean,
    closable: {
      type: Boolean,
      default: true
    },
    destroyOnClose: Boolean,
    forceRender: Boolean,
    keyboard: {
      type: Boolean,
      default: true
    },
    mask: {
      type: Boolean,
      default: true
    },
    maskClosable: {
      type: Boolean,
      default: true
    },
    maskStyle: Object,
    title: {
      type: String,
      default: '裁剪图片'
    },
    width: {
      type: String,
      default: '680px'
    },
    wrapClassName: String,
    zIndex: {
      type: Number,
      default: 1000
    },
    dialogStyle: Object,
    dialogClass: String
  },
  emits: ['done', 'open', 'closed', 'update:visible'],
  data() {
    return {
      show: true
    };
  },
  mounted() {
    if (this.visible) {
      this.onOpen();
    }
  },
  methods: {
    /* 裁剪完成 */
    onDone(result) {
      this.$emit('done', result);
    },
    /* 更新visible */
    updateVisible(value) {
      this.$emit('update:visible', value);
    },
    /* 弹窗打开回调 */
    onOpen() {
      this.show = true;
      this.$emit('open');
    },
    /* 弹窗关闭回调 */
    onClosed() {
      if (this.destroyOnClose) {
        this.show = false;
      }
      this.$emit('closed');
    }
  },
  watch: {
    visible() {
      if (this.visible) {
        this.onOpen();
      } else {
        this.onClosed();
      }
    }
  }
}
</script>
