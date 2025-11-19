export interface Location {
  latitude: number
  longitude: number
  city?: string
}

export interface WeatherShift {
  type: 'rise' | 'drop'
  temp: string
  label: string
  status: 'happening' | 'coming'
  collapsed: string
  expanded: string
  bgColor: string
  inactiveBtnColor: string
  statusColor: string
}

export interface Settings {
  minimumShift: number
  showShiftsIn: string
  lookAhead: string
  showRisingShifts: boolean
  showDroppingShifts: boolean
  includeDayTemps: boolean
  includeNightTemps: boolean
  tempUnit: string
}

export interface WeatherData {
  location: string
  forecast: Array<{
    date: string
    dayTemp: number
    nightTemp: number
    description: string
  }>
}
