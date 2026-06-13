import Globe from '../globe/Globe'
import ShipDots from '../globe/ShipDots'

const SceneManager = () => {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 3, 5]} intensity={1.5} />
      <Globe />
      <ShipDots />
    </>
  )
}

export default SceneManager