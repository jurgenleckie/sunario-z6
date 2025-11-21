'use client'

import { useState, ReactNode } from 'react'
import { Check } from 'lucide-react'

export function DevicePreviewWrapper({ children }: { children: ReactNode }) {
  const [showInDevice, setShowInDevice] = useState(false)

  return (
    <>
      <button
        onClick={() => setShowInDevice(!showInDevice)}
        className="fixed top-4 left-4 z-[100] px-4 py-2 bg-gray-800 text-white text-sm rounded-lg shadow-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
      >
        {showInDevice && <Check size={16} />}
        Show in device
      </button>

      {showInDevice ? (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-8">
          <div className="relative bg-black rounded-[60px] shadow-2xl p-3">
            {/* Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[150px] h-[30px] bg-black rounded-b-[20px] z-50" />
            
            {/* Exact 390x844 viewport */}
            <div 
              className="relative bg-white rounded-[50px] overflow-hidden"
              style={{ width: '390px', height: '844px' }}
            >
              {children}
            </div>
          </div>
        </div>
      ) : (
        children
      )}
    </>
  )
}
