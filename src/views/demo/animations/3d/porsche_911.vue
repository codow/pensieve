<template>
  <div ref="container"
       style="width: 100%; height: 100%;"></div>
</template>

<script>
import * as THREE from 'three'
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

import helvetikerRegularTypefaceJson from 'three/examples/fonts/helvetiker_regular.typeface.json'

export default {
  name: 'DemoAnimationThreeDimHello',
  mounted () {
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    init () {
      // init
      const { container } = this.$refs
      const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.01, 10)
      // camera.position.z = 100
      camera.position.set(0, 0, 10)
      camera.lookAt(0, 0, 0)

      const scene = new THREE.Scene()

      const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
      directionalLight.position.set(0, 1, 0)
      scene.add(directionalLight)

      const renderer = new THREE.WebGLRenderer({ antialias: true })
      renderer.setSize(container.clientWidth, container.clientHeight)
      renderer.toneMapping = THREE.ACESFilmicToneMapping
      renderer.toneMappingExposure = 1
      renderer.outputEncoding = THREE.sRGBEncoding

      // animation
      function animation (time) {
        renderer.render(scene, camera)
      }
      // renderer.setAnimationLoop(animation)

      container.appendChild(renderer.domElement)

      const loader = new GLTFLoader()

      loader.load('/static/material/3d/free_1975_porsche_911_930_turbo/scene.gltf', function (gltf) {
        window.model = gltf
        console.log(gltf.scene)
        gltf.scene.scale.x = 5
        gltf.scene.scale.y = 5
        gltf.scene.scale.z = 5
        scene.add(gltf.scene)
        animation()
      }, undefined, function (error) {
        console.error(error)
      })
    }
  }
}
</script>