import React, { useState, useRef, Suspense, useMemo } from 'react'
import logo from './logo.svg'
import './App.css'
import * as THREE from 'three'
import { Canvas, useLoader, useFrame, extend, useThree } from 'react-three-fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import corona from './Covid-19fin2.glb'
import { Object3D } from 'three'

function Model(particle) {
  console.log('Model -> particle', particle)
  const gltf = useLoader(GLTFLoader, corona, (loader) => {
    const dracoLoader = new DRACOLoader()
    dracoLoader.decoderPath = '/draco-gltf/'
    loader.setDRACOLoader(dracoLoader)
  })
  const [geometry, setGeometry] = useState()

  // init
  if (!geometry) {
    // Scene settings
    const scene = gltf.scene.clone(true) // so we can instantiate multiple copies of this geometry
    setGeometry(scene)
  }
  const group = useRef()
  useFrame((state) => {
    // Makes the light follow the mouse
    // light.current.position.set(mouse.current[0] / aspect, -mouse.current[1] / aspect, 0)
    // Run through the randomized data to calculate some movement
    const { t, factor, speed, xFactor, yFactor, zFactor } = particle
    // There is no sense or reason to any of this, just messing around with trigonometric functions
    let time = t * 2 + speed / 2
    const a = Math.cos(time) + Math.sin(time * 1) / 10
    const b = Math.sin(time) + Math.cos(time * 2) / 10
    const s = Math.cos(time)
    // particle.mx += (mouse.current[0] - particle.mx) * 0.01
    // particle.my += (mouse.current[1] * -1 - particle.my) * 0.01
    // Update the dummy object
    group.current.position.set(
      a + xFactor + Math.cos((time / 10) * factor) + (Math.sin(time * 1) * factor) / 10,
      b + yFactor + Math.sin((time / 10) * factor) + (Math.cos(time * 2) * factor) / 10,
      b + zFactor + Math.cos((time / 10) * factor) + (Math.sin(time * 3) * factor) / 10
    )
    console.log("Model -> group.current", group.current)
    group.current.scale.set(s, s, s)
    // group.current.rotation.set(s * 5, s * 5, s * 5)
    group.current.rotation.x = group.current.rotation.y += 0.01
    // group.current.updateMatrix()
  })
  return (
    <group >
      <primitive ref={group} object={geometry} dispose={null} />
    </group>
  )
}
function Models({ count }) {
  // The innards of this hook will run every frame

  return new Array(count).fill().map((_, i) => {
    const t = Math.random() * 100
    const factor = 20 + Math.random() * 100
    const speed = 0.01 + Math.random() / 500
    const xFactor = -50 + Math.random() * 100
    const yFactor = -50 + Math.random() * 100
    const zFactor = -50 + Math.random() * 100
    const modelProps = { t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0 }

    return <Model {...modelProps} />
  })
}

extend({ OrbitControls })
const Controls = (props) => {
  const { gl, camera } = useThree()
  const ref = useRef()
  useFrame(() => ref.current.update())
  return <orbitControls ref={ref} args={[camera, gl.domElement]} {...props} />
}
function App() {
  return (
    <Canvas camera={{ position: [0, 0, 15] }}>
      <ambientLight intensity={0.4} />
      <pointLight intensity={20} position={[-10, -25, -10]} color='#200f20' />
      <spotLight
        castShadow
        intensity={4}
        angle={Math.PI / 8}
        position={[15, 25, 5]}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <Suspense fallback={null}>
        <Models count={20} />
      </Suspense>
      {/* <Controls
        autoRotate
        enablePan={false}
        enableZoom={false}
        enableDamping
        dampingFactor={0.5}
        rotateSpeed={1}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 2}
      /> */}
    </Canvas>
  )
}

export default App
