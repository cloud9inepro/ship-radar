import { useEffect, useRef } from 'react'
import { useStore } from '../store/useStore'
import { mockShips } from '../data/mockShips'
import { getShipType, getFlagFromMMSI } from '../lib/shipTypes'
import type { Ship } from '../store/useStore'

const WS_URL = 'wss://stream.aisstream.io/v0/stream'
const MAX_SHIPS = 100
const STORE_UPDATE_INTERVAL = 5000 // push to store every 5s
const MAX_STORE_SHIPS = 500 

export const useAIS = () => {
  const setShipList  = useStore(state => state.setShipList)
  const shipMap      = useRef<Map<string, Ship>>(new Map())
  const wsRef        = useRef<WebSocket | null>(null)

  useEffect(() => {
    const apiKey = import.meta.env.VITE_AIS_API_KEY

    if (!apiKey) {
      console.warn('No VITE_AIS_API_KEY — using mock data')
      setShipList(mockShips)
      return
    }

    const connect = () => {
      const ws = new WebSocket(WS_URL)
      wsRef.current = ws

      ws.onopen = () => {
        console.log('AIS stream connected')
        ws.send(JSON.stringify({
          APIKey:             apiKey,
          BoundingBoxes:      [[[-90, -180], [90, 180]]],
          FilterMessageTypes: ['PositionReport', 'ShipStaticData'],
        }))
      }

ws.onmessage = async (event) => {
  try {
    // aisstream sends data as Blob — convert to text first
    const text = event.data instanceof Blob
      ? await event.data.text()
      : event.data

    const data = JSON.parse(text)
    const mmsi = String(data.MetaData?.MMSI)
    if (!mmsi || mmsi === 'undefined') return

    const existing: Ship = shipMap.current.get(mmsi) ?? {
      id:          mmsi,
      name:        data.MetaData?.ShipName?.trim() || `Vessel ${mmsi}`,
      type:        'generic',
      lat:         data.MetaData?.latitude  ?? 0,
      lng:         data.MetaData?.longitude ?? 0,
      heading:     0,
      speed:       0,
      destination: 'Unknown',
      flag:        getFlagFromMMSI(Number(mmsi)),
    }

    if (data.MessageType === 'PositionReport') {
      const pos = data.Message.PositionReport
      shipMap.current.set(mmsi, {
        ...existing,
        lat:     data.MetaData?.latitude  ?? existing.lat,
        lng:     data.MetaData?.longitude ?? existing.lng,
        heading: pos.TrueHeading === 511 ? (pos.Cog ?? 0) : (pos.TrueHeading ?? 0),
        speed:   pos.Sog ?? 0,
      })
    }

    if (data.MessageType === 'ShipStaticData') {
      const stat = data.Message.ShipStaticData
      shipMap.current.set(mmsi, {
        ...existing,
        name:        data.MetaData?.ShipName?.trim() || existing.name,
        type:        getShipType(stat.Type ?? 0),
        destination: stat.Destination?.trim() || 'Unknown',
      })
    }

  } catch (err) {
    console.error('AIS parse error:', err)
  }
}

      ws.onerror = (err) => {
        console.error('AIS WebSocket error:', err)
      }

      ws.onclose = () => {
        console.warn('AIS stream closed — reconnecting in 5s')
        setTimeout(connect, 5000)
      }
    }

    connect()

    // batch push to store every 5s so we don't re-render on every message
 const interval = setInterval(() => {
  const allShips = Array.from(shipMap.current.values())
    .filter(s => s.lat !== 0 && s.lng !== 0 && s.name && s.speed > 0)

  // bucket ships by type
  const byType: Record<string, typeof allShips> = {
    cargo:     allShips.filter(s => s.type === 'cargo'),
    tanker:    allShips.filter(s => s.type === 'tanker'),
    passenger: allShips.filter(s => s.type === 'passenger'),
    fishing:   allShips.filter(s => s.type === 'fishing'),
    military:  allShips.filter(s => s.type === 'military'),
    generic:   allShips.filter(s => s.type === 'generic'),
  }

  // take a balanced slice from each type
  const balanced = [
    ...byType.cargo.slice(0, 120),
    ...byType.tanker.slice(0, 120),
    ...byType.passenger.slice(0, 60),
    ...byType.fishing.slice(0, 80),
    ...byType.military.slice(0, 30),
    ...byType.generic.slice(0, 90),
  ]

  console.log(
    `Ships by type — cargo: ${byType.cargo.length}, tanker: ${byType.tanker.length}, ` +
    `passenger: ${byType.passenger.length}, fishing: ${byType.fishing.length}, ` +
    `military: ${byType.military.length}, generic: ${byType.generic.length}`
  )

  if (balanced.length > 0) setShipList(balanced)
}, STORE_UPDATE_INTERVAL)

    return () => {
      wsRef.current?.close()
      clearInterval(interval)
    }
  }, [])
}