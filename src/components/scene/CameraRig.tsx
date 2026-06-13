import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import gsap from 'gsap'
import { useStore } from '../../store/useStore'
import type { OrbitControls } from 'three-stdlib'

const CameraRig = () => {
  const { camera } = useThree()
  const controls = useThree(state => state.controls) as OrbitControls | null
  const activeShip = useStore(state => state.activeShip)

  // proxy stores the current spherical coordinates GSAP is tweening
  const proxy = useRef({ phi: Math.PI / 4, theta: Math.PI, distance: 3 })
  const isAnimating = useRef(false)

  useEffect(() => {
    if (!activeShip) return

    // convert ship lat/lng to spherical coordinates on the globe
    const targetPhi = (90 - activeShip.lat) * (Math.PI / 180)
    const targetTheta = (activeShip.lng + 180) * (Math.PI / 180)

    // disable orbit controls so they dont fight GSAP
    if (controls) controls.enabled = false
    isAnimating.current = true

    gsap.to(proxy.current, {
      phi: targetPhi,
      theta: targetTheta,
      duration: 2.5,
      ease: 'power2.inOut',
      onComplete: () => {
        isAnimating.current = false
        if (controls) controls.enabled = true
      },
    })
  }, [activeShip?.id]) // only re-run when a different ship is selected

  useFrame(() => {
    if (!isAnimating.current) return

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