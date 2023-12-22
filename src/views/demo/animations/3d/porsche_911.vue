<template>
  <div ref="container"
       style="width: 100%; height: 100%;"></div>
</template>

<script>
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

export default {
  name: 'DemoAnimationThreeDimHello',
  mounted() {
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    init() {
      // init
      const { container } = this.$refs

      const renderer = new THREE.WebGLRenderer({ antialias: true })
      renderer.setSize(container.clientWidth, container.clientHeight)
      renderer.toneMapping = THREE.ACESFilmicToneMapping
      renderer.toneMappingExposure = 1
      renderer.outputEncoding = THREE.sRGBEncoding
      container.appendChild(renderer.domElement)

      const scene = new THREE.Scene()
      scene.background = new THREE.Color(0xbfe3dd)

      const pmremGenerator = new THREE.PMREMGenerator(renderer)
      scene.environment = pmremGenerator.fromScene(
        new RoomEnvironment(renderer),
        0.04
      ).texture

      // 直射光源（太阳光）
      // const directionalLight = new THREE.DirectionalLight(0x404040, 100)
      // directionalLight.position.set(100, 100, 0)
      // scene.add(directionalLight)

      const camera = new THREE.PerspectiveCamera(
        75,
        container.clientWidth / container.clientHeight,
        0.01,
        1000
      )
      // camera.position.z = 100
      camera.position.set(10, 10, 10)
      camera.lookAt(0, 0, 0)

      const controls = new OrbitControls(camera, renderer.domElement)
      controls.target.set(0, 0.5, 0)
      controls.update()
      controls.enablePan = false
      controls.enableDamping = true

      // animation
      function animation(time) {
        requestAnimationFrame(animation)

        controls.update()

        renderer.render(scene, camera)
      }
      // renderer.setAnimationLoop(animation)

      const loader = new GLTFLoader()

      loader.load(
        '/static/material/3d/free_1975_porsche_911_930_turbo/scene.gltf',
        function (gltf) {
          window.model = gltf
          console.log(gltf.scene)
          gltf.scene.scale.x = 5
          gltf.scene.scale.y = 5
          gltf.scene.scale.z = 5
          scene.add(gltf.scene)
          animation()
        },
        undefined,
        function (error) {
          console.error(error)
        }
      )
    }
  }
}
</script>