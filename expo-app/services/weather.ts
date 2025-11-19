import { Location, WeatherData } from '../types'

const API_KEY = 'YOUR_OPENWEATHERMAP_API_KEY' // Replace with your API key
const BASE_URL = 'https://api.openweathermap.org/data/2.5'

/**
 * Fetch weather data from OpenWeatherMap API
 * Replace this function to use a different weather provider
 */
export async function fetchWeatherData(location: Location): Promise<WeatherData> {
  try {
    const { latitude, longitude } = location
    
    // Fetch 7-day forecast
    const forecastUrl = `${BASE_URL}/onecall?lat=${latitude}&lon=${longitude}&exclude=current,minutely,hourly,alerts&units=metric&appid=${API_KEY}`
    
    const response = await fetch(forecastUrl)
    
    if (!response.ok) {
      throw new Error('Failed to fetch weather data')
    }
    
    const data = await response.json()
    
    // Get city name from reverse geocoding
    const cityUrl = `${BASE_URL}/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`
    const cityResponse = await fetch(cityUrl)
    const cityData = await cityResponse.json()
    
    // Map API response to our format
    const forecast = data.daily.map((day: any) => ({
      date: new Date(day.dt * 1000).toISOString(),
      dayTemp: Math.round(day.temp.day),
      nightTemp: Math.round(day.temp.night),
      description: day.weather[0].description
    }))
    
    return {
      location: cityData.name || 'Unknown Location',
      forecast
    }
  } catch (error) {
    console.error('Weather API error:', error)
    
    // Return mock data as fallback
    return {
      location: 'Amsterdam',
      forecast: Array.from({ length: 7 }, (_, i) => ({
        date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toISOString(),
        dayTemp: Math.floor(Math.random() * 15) + 15,
        nightTemp: Math.floor(Math.random() * 10) + 5,
        description: 'Partly cloudy'
      }))
    }
  }
}

/**
 * Get cached weather data if available and not expired
 */
export async function getCachedWeatherData(): Promise<WeatherData | null> {
  // Implementation would use AsyncStorage
  return null
}

/**
 * Cache weather data for offline use
 */
export async function cacheWeatherData(data: WeatherData): Promise<void> {
  // Implementation would use AsyncStorage
}
