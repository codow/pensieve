<template>
  <div class="fr-page__container">
    <div class="fr-page__header"
         style="background-color: #662211;">
      我是头部
    </div>
    <div class="fr-page__main">
      <div class="fr-page__aside"
           style="background-color: #226611;">
        我是边框
      </div>
      <div class="fr-page__main"
           style="overflow: auto;">
        <div class="fr-copyright">
          我是版权信息
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.fr-page__container {
  height: 100%;
}
.fr-page__header {
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 48px;
  border-top: 1px solid transparent;
  border-bottom: 1px solid transparent;
}

.fr-page__main {
  overflow: auto;
}

.fr-page__container > .fr-page__main {
  height: calc(100% - 50px);
  padding-top: 50px;
}

.fr-page__header + .fr-page__main {
  padding-top: 50px;
}

.fr-page__aside {
  width: 280px;
  padding: 0 10px;
  float: left;
}

.fr-page__main > .fr-page__aside {
  height: 100%;
}

.fr-page__main > .fr-page__main {
  height: 100%;
}

.fr-page__aside + .fr-page__main {
  margin-left: 300px;
  width: auto;
}

.fr-copyright {
  width: 100%;
  height: 40px;
  line-height: 20px;
  padding: 10px 0;
  text-align: center;
}
</style>

<script>
export default {
  name: 'home',
  data () {
    return {
      webcamStream: null
    }
  },
  destroyed () {
    this.destroyWebcam()
  },
  methods: {
    initWebcam () {
      this.destroyWebcam()
      const { webcam } = this.$refs
      const getUserMedia = navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia
      if (getUserMedia) {
        navigator.getUserMedia({
          video: true,
          audio: true
        }, (stream) => {
          // webcam.src = window.URL.createObjectURL(stream)
          this.webcamStream = stream
          webcam.srcObject = stream
          webcam.play()
        }, () => {
          console.log("navigator.getUserMedia error: ", error)
        })
      } else {
        console.log("不支持摄像头");
      }
    },

    destroyWebcam () {
      if (this.webcamStream) {
        this.webcamStream.getVideoTracks()[0].stop()
      }
    },

    snapshot () {
      const { webcam, snapshotCanvas, snapshotImage } = this.$refs
      snapshotCanvas.width = webcam.videoWidth
      snapshotCanvas.height = webcam.videoHeight
      const ctx = snapshotCanvas.getContext('2d');
      if (this.webcamStream) {
        // ctx.width = webcam.videoWidth
        // ctx.height = webcam.videoHeight
        ctx.drawImage(webcam, 0, 0, webcam.videoWidth, webcam.videoHeight);
        // “image/webp”对Chrome有效，
        // 其他浏览器自动降为image/png
        snapshotImage.src = snapshotCanvas.toDataURL('image/png');
      }
    }
  }
}
</script>