<template>
  <el-upload ref="uploadInstance"
             list-type="picture-card"
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
             :auto-upload="autoUpload">
    <i v-if="!disabled && (limitFileCount <= 0 || (list && limitFileCount > list.length))"
       class="el-icon-plus"></i>
    <template #file="{file}">
      <div class="sp-upload-picture-card-list__item">
        <el-image :uid="file.uid"
                  style="width: 100%; height: 100%;"
                  :src="file.path"
                  :preview-src-list="srcList"
                  fit="cover"
                  lazy>
        </el-image>
        <span class="el-upload-list__item-actions">
          <span class="el-upload-list__item-preview"
                @click="handlePreview(file)">
            <i class="el-icon-zoom-in"></i>
          </span>
          <span v-if="downloadVisible"
                class="el-upload-list__item-delete"
                @click="handleDownload(file)">
            <i class="el-icon-download"></i>
          </span>
          <span v-if="!disabled"
                class="el-upload-list__item-delete"
                @click="handleRemove(file)">
            <i class="el-icon-delete"></i>
          </span>
        </span>
      </div>
    </template>
  </el-upload>
</template>

<script>
import ImageUploadMixin from './mixins/imageUpload'

export default {
  name: 'GzUploadPictureCard',
  mixins: [ImageUploadMixin],
  props: {
    // 宽度
    width: { type: String }
  }
}
</script>
