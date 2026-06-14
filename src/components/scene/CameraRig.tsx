import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import gsap from 'gsap'
import * as THREE from 'three'
import { useStore } from '../../store/useStore'
import type { OrbitControls } from 'three-stdlib'

type AnimPhase = 'idle' | 'rotating' | 'zooming' | 'entering-ocean'

const CameraRig = () => {
  const { camera } = useThree()
  const controls = useThree(state => state.controls) as OrbitControls | null

  const activeShip         = useStore(state => state.activeShip)
  const viewMode           = useStore(state => state.viewMode)
  const setViewMode        = useStore(state => state.setViewMode)
  const setIsTransitioning = useStore(state => state.setIsTransitioning)

  const proxy         = useRef({ phi: Math.PI / 4, theta: Math.PI, distance: 3 })
  const isAnimating   = useRef(false)
  const phase         = useRef<AnimPhase>('idle')
  const fadeTriggered = useRef(false)

  useEffect(() => {
    if (!activeShip || viewMode !== 'globe') return

    const targetPhi   = (90 - activeShip.lat) * (Math.PI / 180)
    const targetTheta = (activeShip.lng + 180) * (Math.PI / 180)

    if (controls) controls.enabled = false
    isAnimating.current   = true
    fadeTriggered.current = false
    phase.current         = 'rotating'

    // Phase 1 — rotate to face the ship
    gsap.to(proxy.current, {
      phi: targetPhi,
      theta: targetTheta,
      duration: 2.5,
      ease: 'power2.inOut',
      onComplete: () => {

        // Phase 2 — zoom into the surface
        phase.current = 'zooming'
        gsap.to(proxy.current, {
          distance: 1.3,
          duration: 2.5,
          ease: 'power3.in',

          onUpdate: () => {
            // start fading while camera is still moving
            if (proxy.current.distance < 1.7 && !fadeTriggered.current) {
              fadeTriggered.current = true
              setIsTransitioning(true)
            }
          },

          onComplete: () => {
            // switch scene instantly at peak fade — camera never stops
            phase.current = 'entering-ocean'
            setViewMode('ocean')

            camera.position.set(-2.8, 0.35, 1.2)
camera.lookAt(0, 0.05, 0)
;(camera as THREE.PerspectiveCamera).fov = 62
;(camera as THREE.PerspectiveCamera).updateProjectionMatrix()

            // reveal ocean quickly
            setTimeout(() => {
              setIsTransitioning(false)
              isAnimating.current = false
              phase.current = 'idle'
            }, 250)
          },
        })
      },
    })
  }, [activeShip?.id])

  useEffect(() => {
    if (viewMode === 'globe') {
      ;(camera as THREE.PerspectiveCamera).fov = 45
      ;(camera as THREE.PerspectiveCamera).updateProjectionMatrix()
    }
  }, [viewMode])

  useFrame(() => {
    if (!isAnimating.current) return
    if (phase.current !== 'rotating' && phase.current !== 'zooming') return

    const { phi, theta, distance } = proxy.current
    camera.position.set(
      -distance * Math.sin(phi) * Math.cos(theta),
       distance * Math.cos(phi),
       distance * Math.sin(phi) * Math.sin(theta)
    )
    camera.lookAt(0, 0, 0)
  })

  return null
}

export default CameraRig