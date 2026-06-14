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
  isTransitioning: boolean
  setViewMode: (mode: ViewMode) => void
  setShipList: (ships: Ship[]) => void
  setActiveShip: (ship: Ship | null) => void
  setSearchQuery: (query: string) => void
  setIsTransitioning: (val: boolean) => void
}

export const useStore = create<StoreState>((set) => ({
  viewMode: 'globe',
  shipList: [],
  activeShip: null,
  searchQuery: '',
  isTransitioning: false,
  setViewMode: (mode) => set({ viewMode: mode }),
  setShipList: (ships) => set({ shipList: ships }),
  setActiveShip: (ship) => set({ activeShip: ship }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setIsTransitioning: (val) => set({ isTransitioning: val }),
}))