import { create } from 'zustand'

export type ShipType = 'cargo' | 'tanker' | 'passenger' | 'fishing' | 'military' | 'generic'

export type ViewMode = 'globe' | 'ocean'

export interface Ship {
  id: string
  name: string
  type: ShipType
  lat: number
  lng: number
  heading: number
  speed: number        
  destination: string
  flag: string
}

interface StoreState {
  viewMode: ViewMode
  shipList: Ship[]
  activeShip: Ship | null
  searchQuery: string
  setViewMode: (mode: ViewMode) => void
  setShipList: (ships: Ship[]) => void
  setActiveShip: (ship: Ship | null) => void
  setSearchQuery: (query: string) => void
}

export const useStore = create<StoreState>((set) => ({
  viewMode: 'globe',
  shipList: [],          // all ships → dots on globe
  activeShip: null,      // the one ship → GLB in ocean mode
  searchQuery: '',
  setViewMode: (mode) => set({ viewMode: mode }),
  setShipList: (ships) => set({ shipList: ships }),
  setActiveShip: (ship) => set({ activeShip: ship }),
  setSearchQuery: (query) => set({ searchQuery: query }),
}))