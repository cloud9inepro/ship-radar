import Globe from '../globe/Globe'
import ShipDots from '../globe/ShipDots'
import CameraRig from './CameraRig'

const SceneManager = () => {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 3, 5]} intensity={1.5} />
      <Globe />
      <ShipDots />
      <CameraRig />
    </>
  )
}

export default SceneManager