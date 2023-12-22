<template>
  <div ref="container" style="width: 100%; height: 100%;"></div>
</template>

<script>
import * as THREE from 'three'
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js'
import { FontLoader } from 'three/addons/loaders/FontLoader.js'

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
      const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.01, 500)
      // camera.position.z = 100
      camera.position.set(0, 0, 100)
      camera.lookAt(0, 0, 0)

      const scene = new THREE.Scene()

      // 绘制一个立方体
      const geometry = new THREE.BoxGeometry(20, 20, 20)
      const material = new THREE.MeshNormalMaterial()

      const cube = new THREE.Mesh(geometry, material)
      scene.add(cube)

      // 绘制一个线
      const lineMaterial = new THREE.LineBasicMaterial({ color: '#0066ff' })
      const linePoints = [
        new THREE.Vector3(-10, 20, 0),
        new THREE.Vector3(0, 30, 0),
        new THREE.Vector3(10, 20, 0)
      ]
      const lineGeometry = new THREE.BufferGeometry().setFromPoints(linePoints)
      const line = new THREE.Line(lineGeometry, lineMaterial)
      scene.add(line)

      // 增加一个点光源
      const pointLight = new THREE.PointLight(0xffffff, 5)
      pointLight.color.setHSL(Math.random(), 1, 0.5)
      pointLight.position.set(-30, 10, 30)
      scene.add(pointLight)
      scene.add(pointLight)

      const fontLoader = new FontLoader()
      const font = fontLoader.parse(helvetikerRegularTypefaceJson)

      const fontGeometry = new TextGeometry('Hello three.js!', {
        font: font,
        size: 5,
        height: 5,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 10,
        bevelSize: 8,
        bevelSegments: 5
      })
      fontGeometry.computeBoundingBox()
      const fontMaterials = [
        new THREE.MeshPhongMaterial({ color: 0xffffff, flatShading: true }), // front
        // new THREE.MeshPhongMaterial({ color: 0xffffff }) // side
      ]
      const fontMesh = new THREE.Mesh(fontGeometry, fontMaterials)
      fontMesh.position.x = -60
      fontMesh.position.y = 10
      fontMesh.position.z = 0
      scene.add(fontMesh)

      const renderer = new THREE.WebGLRenderer({ antialias: true })
      renderer.setSize(container.clientWidth, container.clientHeight)

      // animation
      function animation (time) {
        cube.rotation.x = time / 2000
        cube.rotation.y = time / 1000
        // cube.rotation.z = time / 1500
        renderer.render(scene, camera)
      }
      renderer.setAnimationLoop(animation)

      container.appendChild(renderer.domElement)
    }
  }
}
</script>