import { useEffect, useState } from 'react'

export const useResponsiveCamera = () => {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return {
    isMobile,
    cameraZ: isMobile ? 4.4 : 3,       // pull back on mobile so globe fits
    minDistance: isMobile ? 2.5 : 1.5,  // cant zoom in as close on mobile
    maxDistance: isMobile ? 6 : 4,      // can zoom out further on mobile
  }
}