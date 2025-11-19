import { WeatherData, WeatherShift, Settings } from '../types'

const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
const fullDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export function detectShifts(
  weatherData: WeatherData,
  settings: Settings
): WeatherShift[] | null {
  const shifts: WeatherShift[] = []
  
  const { minimumShift, showRisingShifts, showDroppingShifts, includeDayTemps, includeNightTemps } = settings
  
  // Extract temperatures for analysis
  const temperatures: Array<{ date: Date; temp: number; isDay: boolean }> = []
  
  weatherData.forecast.forEach(day => {
    const date = new Date(day.date)
    
    if (includeDayTemps) {
      temperatures.push({ date, temp: day.dayTemp, isDay: true })
    }
    
    if (includeNightTemps) {
      temperatures.push({ date, temp: day.nightTemp, isDay: false })
    }
  })
  
  // Detect shifts
  for (let i = 0; i < temperatures.length - 1; i++) {
    const current = temperatures[i]
    const next = temperatures[i + 1]
    
    const tempDiff = Math.abs(next.temp - current.temp)
    
    if (tempDiff >= minimumShift) {
      const isRise = next.temp > current.temp
      
      // Check if this shift type should be shown
      if ((isRise && !showRisingShifts) || (!isRise && !showDroppingShifts)) {
        continue
      }
      
      const startDate = current.date
      const endDate = next.date
      const daysDiff = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
      
      const startDay = days[startDate.getDay()]
      const endDay = days[endDate.getDay()]
      const startDayFull = fullDays[startDate.getDay()]
      const endDayFull = fullDays[endDate.getDay()]
      
      const timeOfDay = current.isDay ? 'midday' : 'night'
      const isToday = daysDiff === 0
      const status = isToday ? 'happening' : 'coming'
      
      const type = isRise ? 'rise' : 'drop'
      
      const collapsedText = `${startDay} ${current.temp}° → ${endDay} ${next.temp}°`
      const expandedText = status === 'happening'
        ? `This ${type} is happening now: ${startDayFull} ${timeOfDay} (${current.temp}°) → ${endDayFull} ${timeOfDay} (${next.temp}°)`
        : `This ${type} starts in ${daysDiff} day${daysDiff !== 1 ? 's' : ''}: ${startDayFull} ${timeOfDay} (${current.temp}°) → ${endDayFull} ${timeOfDay} (${next.temp}°)`
      
      shifts.push({
        type,
        temp: `${tempDiff}°`,
        label: type,
        status,
        collapsed: collapsedText,
        expanded: expandedText,
        bgColor: type === 'rise' ? '#FEDADA' : '#DAEDF7',
        inactiveBtnColor: type === 'rise' ? '#FEEFEF' : '#EAF5FE',
        statusColor: type === 'rise' ? '#FC8888' : '#6DB3E0'
      })
      
      // Limit to 3 shifts
      if (shifts.length >= 3) break
    }
  }
  
  return shifts.length > 0 ? shifts : null
}
