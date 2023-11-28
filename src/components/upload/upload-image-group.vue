<template>
  <div class="sp-upload-picture-group-container"
       :style="{ height: height,width:width }">
    <div class="sp-upload-picture-group-items-container">
      <ul class="sp-upload-picture-group-items">
        <li class="sp-upload-picture-group__item"
            :key="item.group_id"
            :class="[{'sp-upload-picture-group__item-active': item.group_id === activeTypeId},{'sp-upload-picture-group__item-border-top-none':index === 0}]"
            :style="{height:groupHeightVal,lineHeight:groupHeightVal}"
            @click="handleTypeColumn(item)"
            v-for="(item,index) in typeColumn">
          {{ item.name_ch }} ({{ groupFileListMap[item.group_id] ? groupFileListMap[item.group_id].length : 0 }})
        </li>
      </ul>
    </div>
    <div class="sp-upload-picture-group-upload-container">
      <el-upload ref="uploadInstance"
                 style="height: 60%"
                 class="sp-upload-picture-group"
                 v-if="!disabled"
                 :show-file-list="false"
                 :drag="true"
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
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">拖拽文件，或<em>点击上传</em></div>
      </el-upload>
      <div class="sp-upload-picture-group-images-container">
        <div v-if="groupFileListMap[activeTypeId] && groupFileListMap[activeTypeId].length > 0"
             style="width: 95%;height: 100%">
          <el-carousel type="card"
                       :height="groupImagesHeightVal"
                       :autoplay="false">
            <el-carousel-item v-for="item in groupFileListMap[activeTypeId]"
                              :key="item.md5">
              <div class="sp-upload-picture-group-images-carousel-item">
                <el-image :uid="item.uid"
                          style="width: 100%; height: 100%;text-align: center;"
                          :src="item.path"
                          fit="contain">
                  <div slot="error"
                       style="color: #DCDFE6">
                    <i style="font-size: 50px;"
                       class="el-icon-picture-outline"></i>
                    <p style="margin: 0;font-size: 24px;padding-top: 10px">暂无内容</p>
                  </div>
                </el-image>
                <span class="sp-upload-picture-group__item-actions">
                  <span class="sp-upload-picture-group__item-action"
                        @click="handlePreview(item)">
                    <i class="el-icon-zoom-in"></i>
                  </span>
                  <span v-if="downloadVisible"
                        class="sp-upload-picture-group__item-action"
                        @click="handleDownload(item)">
                    <i class="el-icon-download"></i>
                  </span>
                  <span v-if="!disabled"
                        class="sp-upload-picture-group__item-action"
                        @click="handleRemove(item)">
                    <i class="el-icon-delete"></i>
                  </span>
                </span>
              </div>
            </el-carousel-item>
          </el-carousel>
        </div>
        <div v-else>
          <el-image style="text-align: center;width: 100%">
            <div slot="error"
                 style="color: #DCDFE6">
              <i style="font-size: 50px;"
                 class="el-icon-picture-outline"></i>
              <p style="margin: 0;font-size: 24px;padding-top: 10px">暂无内容</p>
            </div>
          </el-image>
        </div>
      </div>
    </div>
    <image-viewer v-if="showViewer"
                  :z-index="zIndex"
                  :initial-index="imageIndex"
                  :on-close="handlePreviewClose"
                  :url-list="previewSrcList" />
  </div>
</template>

<script>
import ImageViewer from 'element-ui/packages/image/src/image-viewer.vue'

import ImageUploadMixin from './mixins/imageUpload'

import { isNotBlank } from './utils'

let prevOverflow = ''

export default {
  name: 'GzUploadPictureGroup',
  mixins: [ImageUploadMixin],
  components: {
    ImageViewer
  },
  props: {
    typeColumn: {
      type: Array,
      default() {
        return []
      }
    },
    height: { type: String, default: '300px' }, // 高度
    width: { type: String, default: '' }, // 宽度
    zIndex: {
      type: Number,
      default: 2000
    }
  },
  data() {
    return {
      imageIndex: 0,
      showViewer: false,
      activeTypeId: '',
      activeTypeColumn: {}
    }
  },
  computed: {
    // 每个组别的高度
    groupHeightVal() {
      if (isNotBlank(this.height)) {
        return parseInt(this.height) / this.typeColumn.length - 1 + 'px'
      }
      return 0
    },
    // 详情显示走马灯的高度
    carouselHeightVal() {
      if (isNotBlank(this.height)) {
        return parseInt(this.height) - 50 / this.typeColumn.length + 'px'
      }
      return 0
    },
    // 分组图片走马灯的高度
    groupImagesHeightVal() {
      if (isNotBlank(this.height)) {
        return parseInt(this.height) * 0.4 - 20 + 'px'
      }
      return 0
    },

    groupFileListMap() {
      const map = {}
      const groupList = this.typeColumn || []
      groupList.forEach((group) => {
        const groupId = group.group_id
        map[groupId] = this.list.filter((item) => {
          return groupId === item.group_id
        })
      })
      return map
    },

    previewSrcList() {
      return this.groupFileListMap[this.activeTypeId]
        .filter((item) => !!item.path)
        .map((item) => item.path)
    }
  },
  watch: {
    'typeColumn.length': {
      handler(newValue, oldValue) {
        if (newValue !== oldValue) {
          this.initData()
        }
      }
    }
  },
  created() {
    this.initData()
  },
  methods: {
    initData() {
      if (this.typeColumn.length > 0) {
        this.activeTypeId = this.typeColumn[0].group_id
        this.activeTypeColumn = this.typeColumn[0]
      }
    },
    // 点击左侧分组项
    handleTypeColumn(typeColumn) {
      this.activeTypeColumn = typeColumn
      this.activeTypeId = typeColumn.group_id
    },
    // 图片点击放大
    handlePreview(file) {
      // 判断file是第几个文件
      let index = this.groupFileListMap[this.activeTypeId].findIndex(
        (item) => item.uid === file.uid
      )
      this.imageIndex = index === -1 ? 0 : index
      // prevent body scroll
      prevOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      this.showViewer = true
    },
    handlePreviewClose() {
      document.body.style.overflow = prevOverflow
      this.showViewer = false
    }
  }
}
</script>
