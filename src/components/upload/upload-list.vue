<template>
  <el-upload ref="uploadInstance"
             :size="size"
             :file-list="list"
             :action="uploadUrl"
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
             :class="{'sp-upload-list': disabled}">
    <template #trigger>
      <slot name="trigger">
        <el-button v-if="!disabled"
                   type="primary"
                   icon="el-icon-upload"
                   size="small">选择文件</el-button>
      </slot>
    </template>
    <template #tip>
      <slot name="tip">
        <div v-if="!disabled"
             class="el-upload__tip">点击上传文件
        </div>
      </slot>
    </template>
    <template #file="{file}">
      <slot name="file"
            :file="file">
      </slot>
    </template>
    <slot name="default"></slot>
  </el-upload>
</template>

<script>
import UploadMixin from './mixins'

export default {
  name: 'GzUploadList',
  mixins: [UploadMixin]
}
</script>
