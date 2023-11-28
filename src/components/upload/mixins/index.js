// ========================================================
// 封装文件上传需要的基本属性和方法
// @author wangyb
// @createTime 2023-11-15
// ========================================================

import { calcFileSize, toFixed } from "../utils";

export default {
  model: {
    prop: "fileList",
  },
  props: {
    id: { type: String },
    label: { type: String },
    size: { type: String },
    fileList: {
      type: Array,
      default() {
        return [];
      },
    },
    dataSourceType: { type: String, default: "restful" },
    dataSource: { type: String },
    props: {
      type: Object,
      default() {
        return { value: "uid", label: "name" };
      },
    },
    uploadUrl: {
      type: String,
      default() {
        return "/gzFile/upload"; // process.env.VUE_FILE_UPLOAD_URL || "/gzFile/upload";
      },
    },
    downloadUrl: {
      type: String,
      default() {
        return "/gzFile/download"; // process.env.VUE_FILE_DOWNLOAD_URL || "/gzFile/download";
      },
    },
    limitFileCount: { type: Number, default: 10 },
    limitFileSize: { type: Number, default: 0 }, // 文件大小限制 小于等于0为不限制
    acceptFileType: { type: String },
    uploadVisible: { type: Boolean, default: true },
    disabled: { type: Boolean, default: false },
    multiple: { type: Boolean, default: true }, // 是否多个上传
    height: { type: String },
    width: { type: String, default: "100%" },
    beforeUpload: { type: Function },
    beforeRemove: { type: Function },
    onPreview: { type: Function },
    onRemove: { type: Function },
    onExceed: { type: Function },
    onProgress: { type: Function },
    onChange: { type: Function },
    onSuccess: { type: Function },
    autoUpload: { type: Boolean, default: true }, // 自动上传
    showPercentage: { type: Boolean, default: true }, // 显示上传进度
    showManualUpload: { type: Boolean, default: true }, // 显示上传进度
    downloadVisible: { type: Boolean, default: true }, // 显示下在按钮
    headers: Object,
    httpRequest: { type: Function },
  },
  data() {
    return {
      list: [],
    };
  },
  computed: {
    waitingUpload() {
      let list = this.list || [];
      return (
        !this.autoUpload &&
        this.showManualUpload &&
        !!list.find((item) => item.status === "ready")
      );
    },
    requestHeaders() {
      return Object.assign({}, this.headers, {
        "Access-Token": this.$store.state.User && this.$store.state.User.key,
      });
    },
  },
  watch: {
    fileList: {
      handler(newVal) {
        if (newVal !== this.list) {
          this.list = newVal;
        }
      },
      immediate: true,
    },
  },
  // 过虑tag 显示名的字段长度
  filters: {
    formatPercentage(val) {
      return toFixed(val, 2);
    },
  },
  methods: {
    // 上传文件之前执行
    handleBeforeUpload(file) {
      let fileSize =
        this.limitFileSize > 0 ? file.size / 1024 < this.limitFileSize : true;

      if (!fileSize) {
        this.$message.error(
          "文件大小不能超过" + calcFileSize(this.limitFileSize, "KB")
        );
      }
      return fileSize;
    },
    // 点击文件列表中已上传的文件时的钩子
    handlePreview(file) {
      // 调用文件下载方法
      this.handleDownload(file);
    },
    // 文件列表移除文件时的钩子
    handleRemove(file) {
      if (this.beforeRemove && !this.beforeRemove(file, this.list)) {
        return;
      }
      // 判断list
      let index = this.list.indexOf(file);
      if (index !== -1) {
        this.list.splice(index, 1);
      }
      // 手动调用文件状态改变的事件
      this.handleChange(file, this.list);
    },
    // 文件上传成功时的钩子
    handleSuccess(response, file, fileList) {
      // 判断是否上传成功
      if (response.status !== "success") {
        file.status = "fail";
        this.$message.error("文件上传失败: " + response.errMsg);
        return;
      }
      const data = response.data[0];
      const _file = {
        uid: file.uid.toString(),
        md5: data.md5,
        name: data.name,
        path:
          data.path ||
          encodeURI(
            this.downloadUrl +
              "?md5=" +
              data.md5 +
              "&name=" +
              encodeURIComponent(data.name)
          ),
        suffix_name: data.suffix_name,
        size: data.size,
        accessory_resource_id: data.accessory_resource_id,
        sp_accessory_upload_id: data.sp_accessory_upload_id,
      };
      // 合并文件对象
      Object.assign(file, _file);
    },
    handleChange(file, fileList) {
      this.list = fileList;
      // 如果有onChange
      if (this.onChange) {
        this.onChange(file, fileList);
      }
      this.$emit("input", this.list);
      this.$emit("change", this.list);
    },
    // 文件超出个数限制的钩子
    handleExceed(files, fileList) {
      this.$message.error("上传文件个数不能超过" + this.limitFileCount + "个");
    },
    // 下载文件
    handleDownload(file) {
      if (!this.downloadVisible) {
        return;
      }
      if (file.status !== "success") {
        return;
      }
      if (!file.path) {
        file.path =
          this.path +
          "?md5=" +
          file.md5 +
          "&name=" +
          encodeURIComponent(file.name);
      }
      // 调用文件流下载
      let url =
        file.path +
        (file.path.indexOf("?") !== -1 ? "&type=blob" : "?type=blob");
      window.open(url);
    },
    handleUploadClick() {
      const { uploadInstance } = this.$refs;
      uploadInstance && uploadInstance.submit();
    },
    // 清空已上传的文件列表（该方法不支持在before-upload中调用）
    clearFiles() {
      const { uploadInstance } = this.$refs;
      uploadInstance && uploadInstance.clearFiles();
    },
  },
};
