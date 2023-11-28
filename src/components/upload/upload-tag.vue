<template>
  <div>
    <el-tag v-for="(item,index) in list"
            :key="index"
            :closable="!disabled && !item.disabled"
            :title="item[props.label]"
            :effect="item.status === 'success' ? 'light' : 'plain'"
            :size="size === 'mini' ? 'medium': 'default'"
            :disable-transitions="disableTransitions"
            class="sp-margin-right__small sp-margin-bottom__small sp-upload-tag"
            @close="handleRemove(item)"
            @click="handleDownload(item)">
      <div v-if="showPercentage && item.status === 'uploading'"
           class="sp-upload-tag__progress-mask"
           :style="{
             width: 'calc(' + item.percentage + '% - 2px)'
           }"></div>
      <span class="sp-tag">{{ item[props.label] }}</span>
      <i v-if="item.status === 'uploading'"
         class="el-icon-loading"
         style="margin-left: 10px;"></i>
    </el-tag>
    <el-upload ref="uploadInstance"
               :size="size"
               :file-list="list"
               :action="uploadUrl"
               :show-file-list="false"
               :label="label"
               :limit="limitFileCount"
               :disabled="disabled"
               :multiple="multiple"
               :accept="acceptFileType"
               :before-upload="beforeUpload || handleBeforeUpload"
               :before-remove="beforeRemove"
               :on-preview="onPreview || handlePreview"
               :on-remove="onRemove || handleRemove"
               :on-exceed="onExceed || handleExceed"
               :on-progress="onProgress"
               :on-change="handleChange"
               :on-success="onSuccess || handleSuccess"
               :http-request="httpRequest"
               :headers="requestHeaders"
               :auto-upload="autoUpload"
               :class="{'sp-upload-tag': disabled}"
               style="display: inline-block;">
      <el-button v-if="!disabled && (limitFileCount <= 0 || (list && limitFileCount > list.length))"
                 :type="buttonType"
                 :icon="buttonIcon"
                 :size="size">{{ buttonLabel || '点击上传' }}</el-button>
      <el-button v-if="waitingUpload"
                 :size="size"
                 :type="buttonType"
                 icon="el-icon-upload2"
                 @click.stop="handleUploadClick">开始上传</el-button>
    </el-upload>
  </div>
</template>
<script>
import UploadMixin from './mixins'

export default {
  name: 'GzUploadTag',
  mixins: [UploadMixin],
  props: {
    buttonType: { type: String, default: 'primary' },
    buttonIcon: { type: String, default: 'el-icon-upload' },
    buttonLabel: String,
    disableTransitions: Boolean
  }
}
</script>
