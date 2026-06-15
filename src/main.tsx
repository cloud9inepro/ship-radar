import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { extend } from '@react-three/fiber'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { useGLTF } from '@react-three/drei'


const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/')

const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)



useGLTF.preload('/models/cargo-transformed.glb')
useGLTF.preload('/models/tanker-transformed.glb')
useGLTF.preload('/models/fishing-transformed.glb')
useGLTF.preload('/models/passenger-transformed.glb')
useGLTF.preload('/models/military-transformed.glb')
useGLTF.preload('/models/yacht-transformed.glb')
