"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

type ShiftsContextType = {
  shifts: any
  setShifts: (shifts: any) => void
  randomGif: string
  setRandomGif: (gif: string) => void
  isInitialized: boolean
  setIsInitialized: (val: boolean) => void
}

const ShiftsContext = createContext<ShiftsContextType | null>(null)

export function ShiftsProvider({ children }: { children: ReactNode }) {
  const [shifts, setShifts] = useState<any>(null)
  const [randomGif, setRandomGif] = useState<string>("")
  const [isInitialized, setIsInitialized] = useState(false)

  return (
    <ShiftsContext.Provider value={{ 
      shifts, 
      setShifts, 
      randomGif, 
      setRandomGif,
      isInitialized,
      setIsInitialized
    }}>
      {children}
    </ShiftsContext.Provider>
  )
}

export function useShifts() {
  const context = useContext(ShiftsContext)
  if (!context) {
    throw new Error("useShifts must be used within ShiftsProvider")
  }
  return context
}
