// ========================================================
// 图片上传的基础功能
// @author wangyb
// @createTime 2023-11-15
// ========================================================
import UploadMixin from './index'
import { calcFileSize } from '../utils'

export default {
  mixins: [UploadMixin],
  computed: {
    srcList() {
      const list = []
      this.list.forEach((item) => {
        if (item.path) {
          list.push(item.path)
        }
      })
      return list
    }
  },
  methods: {
    // 上传之前的限制
    handleBeforeUpload(file) {
      let fileSize =
        this.limitFileSize > 0 ? file.size / 1024 < this.limitFileSize : true

      const acceptType =
        /\.(jpg|jpeg|png|bmp|BMP|JPG|PNG|JPEG|TIFF|tiff|PJP|pjp|JFIF|jfif|GIF|gif|SVG|svg|SVGZ|svgz|WEBP|webp|ICO|ico|XBM|xbm|DIB|dib|TIF|tif|PJPEG|pjpeg|AVIF|avif)$/.test(
          file.name
        )
      if (!fileSize) {
        this.$message.error(
          '文件大小不能超过' + calcFileSize(this.limitFileSize, 'KB')
        )
      } else if (!acceptType) {
        // 只能上传图片类型
        this.$message.error('请选择图片类型的文件')
      }
      return fileSize && acceptType
    },
    // 点击图片放大
    handlePreview(file) {
      // 判断file是第几个文件
      const { uploadInstance } = this.$refs
      const image = uploadInstance.$el.querySelector(
        "img[uid='" + file.uid + "']"
      )
      image && image.click()
    }
  }
}
