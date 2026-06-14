import * as THREE from 'three'
import { useRef, useMemo, useEffect } from 'react'
import { useGraph } from '@react-three/fiber'
import { useGLTF, useAnimations } from '@react-three/drei'
import { SkeletonUtils } from 'three-stdlib'
import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js'

type ActionName = 'Scene'

interface GLTFAction extends THREE.AnimationClip {
  name: ActionName
}

type GLTFResult = GLTF & {
  nodes: {
    Object_30: THREE.SkinnedMesh
    _rootJoint: THREE.Bone
  }
  materials: {
    ['Textures.001']: THREE.MeshStandardMaterial
  }
  animations: GLTFAction[]
}

export function WakeTrailModel(props: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>(null)
  const { scene, animations } = useGLTF('/models/trail.glb')
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene])
  const { nodes, materials } = useGraph(clone) as GLTFResult
  const { actions } = useAnimations(animations, group)

  // auto-play the looping trail animation on mount
  useEffect(() => {
    const action = actions['Scene']
    if (!action) return
    action.reset().play()
    action.setLoop(THREE.LoopRepeat, Infinity)
  }, [actions])

  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Sketchfab_Scene">
        <group name="Sketchfab_model" rotation={[-Math.PI / 2, 0, 0]} scale={0.014}>
          <group name="e066257e2fb948da81897b8c3984d8c3fbx" rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
            <group name="Object_2">
              <group name="RootNode">
                <group name="Particle_Trail_Rig" rotation={[-Math.PI / 2, 0, 0]} scale={100}>
                  <group name="Object_5">
                    <primitive object={nodes._rootJoint} />
                    <group name="Object_29" rotation={[-Math.PI / 2, 0, 0]} scale={100} />
                    <skinnedMesh
                      name="Object_30"
                      geometry={nodes.Object_30.geometry}
                      material={materials['Textures.001']}
                      skeleton={nodes.Object_30.skeleton}
                    />
                  </group>
                </group>
                <group name="Particle_Trail" rotation={[-Math.PI / 2, 0, 0]} scale={100} />
              </group>
            </group>
          </group>
        </group>
      </group>
    </group>
  )
}

useGLTF.preload('/models/trail.glb')