import { Suspense } from 'react'
import { useStore } from '../../store/useStore'
import { Model as CargoModel }     from '../models/Cargo'
import { Model as TankerModel }    from '../models/Tanker'
import { Model as FishingModel }   from '../models/Fishing'
import { Model as PassengerModel } from '../models/Passenger'
import { Model as MilitaryModel }  from '../models/Military'
import { Model as GenericModel }     from '../models/Generic'
import { useResponsiveCamera } from '../../hooks/useResponsiveCamera'

// type ModelConfig = {
//   scale: number
//   position: [number, number, number]
//   rotation?: [number, number, number]
// }

// scale and position per ship type — adjust once you see each model
interface ModelConfig {
  scale:          number
  mobileScale?:   number
  tabletScale?:   number
  position:       [number, number, number]
  mobilePosition?: [number, number, number]
  tabletPosition?: [number, number, number]
  rotation?:      [number, number, number]
}

const MODEL_CONFIG: Record<'cargo' | 'tanker' | 'fishing' | 'passenger' | 'military' | 'generic', ModelConfig> = {
  cargo:     { 
    scale: 0.7,   mobileScale: 0.35,  tabletScale: 0.4,
    position: [-2, 0, 0], mobilePosition: [0, 0.1, 0], tabletPosition: [-0.5, 0, 0],  
    rotation: [0, Math.PI / 1, 0] as [number, number, number],
  },
  tanker:    { 
    scale: 0.03,  mobileScale: 0.05,  tabletScale: 0.04,
       position: [0, 0, 0], mobilePosition: [0, 0, 0], tabletPosition: [0, 0, 0], 
    rotation: [0, Math.PI / 0.1, 0] as [number, number, number],
  },
  fishing:   { 
    scale: 0.7,   mobileScale: 0.45,  tabletScale: 0.58,
    position: [-1, -0.1, 0],
    rotation: [0, Math.PI / 0.56, 0] as [number, number, number],
  },
  passenger: { 
    scale: 3,     mobileScale: 1.2,   tabletScale: 1.8,
    position: [0.3, 0.5, 0], mobilePosition: [0, 0.3, 0], tabletPosition: [0, 0.29, 0], 
    rotation: [0, Math.PI / 0.1, 0] as [number, number, number],
  },
  military:  { 
    scale: 0.6,     mobileScale: 0.24,  tabletScale: 0.8,
        position: [0, 0, 0], mobilePosition: [0.5, 0, 0], tabletPosition: [0, 0, 0], 
    rotation: [0, -Math.PI / 2, 0] as [number, number, number],
  },
  generic:   { 
    scale: 6,     mobileScale: 2.3,  tabletScale: 3.5,
    position: [-1.5, 1, 0], mobilePosition: [-1, 0.5, 0], tabletPosition: [-1.4, 0.6, 0], 
    rotation: [0, Math.PI / 2, 0] as [number, number, number],
  },
}

const ShipSwitch = () => {
  const activeShip = useStore(state => state.activeShip)
  const { isMobile, isTablet } = useResponsiveCamera()

  if (!activeShip) return null

  const config = MODEL_CONFIG[activeShip.type] ?? MODEL_CONFIG.cargo

const activeScale = isMobile
  ? (config.mobileScale    ?? config.scale)
  : isTablet
  ? (config.tabletScale    ?? config.scale)
  : config.scale

const activePosition = isMobile
  ? (config.mobilePosition ?? config.position)
  : isTablet
  ? (config.tabletPosition ?? config.position)
  : config.position

const sharedProps = {
  scale:    activeScale,
  position: activePosition,
  rotation: config.rotation ?? [0, Math.PI / 2, 0] as [number, number, number],
}

//   const sharedProps = {
//     scale:    activeScale,
//     position: config.position,
//     rotation: config.rotation ?? [0, Math.PI / 2, 0] as [number, number, number],
//   }

  switch (activeShip.type) {
    case 'cargo':     return <CargoModel     {...sharedProps} />
    case 'tanker':    return <TankerModel    {...sharedProps} />
    case 'fishing':   return <FishingModel   {...sharedProps} />
    case 'passenger': return <PassengerModel {...sharedProps} />
    case 'military':  return <MilitaryModel  {...sharedProps} />
    case 'generic':   return <GenericModel     {...sharedProps} />
    default:          return <CargoModel     {...sharedProps} />
  }
}

const ShipModel = () => {
  return (
    <Suspense fallback={null}>
      <ShipSwitch />
    </Suspense>
  )
}

export default ShipModel