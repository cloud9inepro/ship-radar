import type { ShipType } from '../store/useStore'

export const getShipType = (aisType: number): ShipType => {
  if (aisType === 30)                   return 'fishing'
  if (aisType === 35 || aisType === 36) return 'military'
  if (aisType >= 60 && aisType <= 69)   return 'passenger'
  if (aisType >= 70 && aisType <= 79)   return 'cargo'
  if (aisType >= 80 && aisType <= 89)   return 'tanker'
  return 'generic'
}

const MID_MAP: Record<string, string> = {
  '232': 'UK',        '233': 'UK',       '235': 'UK',
  '244': 'Netherlands', '245': 'Netherlands',
  '257': 'Norway',    '258': 'Norway',
  '265': 'Sweden',    '266': 'Sweden',
  '273': 'Russia',
  '303': 'USA',       '338': 'USA',      '366': 'USA',
  '311': 'Bahamas',
  '351': 'Panama',    '352': 'Panama',   '353': 'Panama',
  '477': 'Hong Kong',
  '503': 'Australia',
  '525': 'Indonesia',
  '563': 'Singapore',
  '636': 'Liberia',
  '657': 'South Africa',
  '710': 'Brazil',
  '725': 'Chile',
  '477': 'Hong Kong',
  '416': 'Taiwan',
  '440': 'South Korea', '441': 'South Korea',
  '431': 'Japan',     '432': 'Japan',
}

export const getFlagFromMMSI = (mmsi: number): string => {
  const mid = String(mmsi).slice(0, 3)
  return MID_MAP[mid] ?? 'Unknown'
}