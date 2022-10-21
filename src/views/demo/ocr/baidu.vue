<template>
  <div class="padding__medium">
    <div>百度OCR</div>
    <el-form label-position="top">
      <el-form-item label="需要识别的图片">
        <div class="image-selector">
          <el-upload action="/api/ocr/file/upload"
                     :show-file-list="false"
                     accept="jpg,jpeg,png"
                     :on-success="handleFileUploadSuccess">
            <el-button size="small"
                       type="primary"
                       icon="el-icon-upload">点击上传</el-button>
            <el-button size="small"
                       icon="el-icon-refresh"
                       @click.stop.prevent="loadFiles">刷新列表</el-button>
          </el-upload>
          <div class="file-list">
            <el-card v-for="item in files"
                     :key="item.name"
                     :body-style="{ padding: '0px' }"
                     class="image-card"
                     :class="{ 'selected' : item === selectedFile }"
                     @click.native="selectedFile = item">
              <el-image class="image"
                        :src="'/api' + item.path"
                        fit="fill"
                        lazy></el-image>
              <div style="padding: 8px;">
                <div class="title">{{ item.name }}</div>
                <div class="bottom clearfix">
                  <time class="time">{{ item.modify_time }}</time>
                </div>
              </div>

              <div class="selected-tag">
                <i class="el-icon-check"></i>
              </div>
            </el-card>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="识别接口">
        <el-radio-group v-model="selectedOcrType">
          <el-radio v-for="item in ocrTypes"
                    :key="item.id"
                    :label="item.id">{{item.label}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button size="small"
                   type="primary"
                   icon="el-icon-search"
                   @click="iamgeRecognition">识别图片</el-button>
      </el-form-item>
      <el-form-item>
        {{iamgeRecognitionResult}}
      </el-form-item>
    </el-form>
  </div>
</template>

<style lang="less" scoped>
.image-selector {
  margin-top: 15px;
}

.file-list {
  padding: 15px;
  height: 368px;
  border: 1px solid #999;
  border-radius: 4px;
  overflow: auto;
  margin-top: 15px;
}

.image-card {
  width: 180px;
  height: 240px;
  display: inline-block;
  margin-top: 15px;
  margin-right: 15px;
  cursor: pointer;
  position: relative;

  &.selected {
    border: 1px solid #67c23a;
    box-shadow: 0 2px 12px 0 rgba(103, 194, 58, 0.1);

    .selected-tag {
      display: block;
    }
  }

  .selected-tag {
    background: #67c23a;
    background: linear-gradient(to top right, transparent 50%, #67c23a 0);
    width: 36px;
    height: 36px;
    padding-right: 3px;
    box-sizing: border-box;
    color: #fff;
    text-align: right;
    line-height: 22px;
    position: absolute;
    right: 0px;
    top: 0px;
    display: none;
  }

  .title {
    line-height: 20px;
    font-size: 14px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .bottom {
    margin-top: 9px;
    line-height: 14px;

    .time {
      font-size: 12px;
      color: #999;
    }
  }
}

.button {
  padding: 0;
  float: right;
}

.image {
  width: 100%;
  height: 180px;
  display: block;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both;
}
</style>

<script>
export default {
  name: 'demo-orc-baidu',

  data () {
    return {
      selectedFile: null,
      selectedOcrType: null,
      iamgeRecognitionResult: null,
      files: [],
      ocrTypes: [],
    }
  },

  created () {
    this.loadFiles()
    this.loadOcrType()
  },

  methods: {
    loadFiles () {
      this.$http.get('/ocr/file/list').then(res => {
        this.files = res.data
      }).catch(e => {
        console.error(e)
      })
    },

    loadOcrType () {
      this.$http.get('/ocr/type/list').then(res => {
        this.ocrTypes = res.data
        this.selectedOcrType = this.ocrTypes[0] ? this.ocrTypes[0].id : null
      }).catch(e => {
        console.error(e)
      })
    },

    handleFileUploadSuccess (response, file, fileList) {
      this.files.push(response.data[0])
    },

    iamgeRecognition () {
      this.$http.get('/ocr/recognition', {
        params: {
          file_name: this.selectedFile.name,
          ocr_type: this.selectedOcrType
        }
      }).then(res => {
        this.iamgeRecognitionResult = res.data
      }).catch(e => {
        console.error(e)
      })
    }
  }
}
</script>