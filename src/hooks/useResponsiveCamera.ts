import { useEffect, useState } from 'react'

export const useResponsiveCamera = () => {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768)
  const [isTablet, setIsTablet] = useState(() => window.innerWidth >= 768 && window.innerWidth < 1024)

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth
      setIsMobile(w < 768)
      setIsTablet(w >= 768 && w < 1024)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return {
    isMobile,
    isTablet,
    // globe camera
    cameraZ:     isMobile ? 3.8 : 3,
    minDistance: isMobile ? 2.5 : 1.5,
    maxDistance: isMobile ? 6 : 4,
    // ocean camera Z — closer on mobile so ship fills frame
    oceanCameraZ: isMobile ? 3 : isTablet ? 4.5 : 6,
    // model scale multiplier — larger on mobile to stay prominent
    scaleMultiplier: isMobile ? 1.4 : isTablet ? 1.1 : 1.0,

  maxGlobeShips:  isMobile ? 20 : isTablet ? 40 : 50,
  maxGlobeLabels: isMobile ? 10  : isTablet ? 15 : 20,
  }
}