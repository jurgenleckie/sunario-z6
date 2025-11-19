'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface PickerProps {
  isOpen: boolean
  onClose: () => void
  options: string[]
  selectedValue: string
  onSelect: (value: string) => void
  title: string
}

function IOSPicker({ isOpen, onClose, options, selectedValue, onSelect, title }: PickerProps) {
  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end justify-center"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30 animate-fade-in" />
      
      {/* Picker Container */}
      <div 
        className="relative w-full max-w-[390px] bg-[#F2F2F7] rounded-t-2xl animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-[#C6C6C8]">
          <button 
            onClick={onClose}
            className="text-[17px] font-normal text-[#007AFF]"
          >
            Done
          </button>
          <span className="text-[13px] font-semibold text-[#8E8E93]">{title}</span>
          <div className="w-12" /> {/* Spacer */}
        </div>
        
        {/* Picker Wheel */}
        <div className="h-[216px] overflow-y-auto relative">
          {/* Selection Indicator */}
          <div className="absolute top-1/2 left-0 right-0 h-[44px] -mt-[22px] border-t border-b border-[#C6C6C8] bg-white/30 pointer-events-none" />
          
          {/* Options */}
          <div className="py-[86px]">
            {options.map((option, index) => (
              <button
                key={index}
                onClick={() => onSelect(option)}
                className={`w-full h-[44px] flex items-center justify-center text-[21px] transition-all ${
                  selectedValue === option 
                    ? 'font-semibold text-[#424242]' 
                    : 'font-normal text-[#757575]'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SettingsPage() {
  const router = useRouter()
  const [isSlideOut, setIsSlideOut] = useState(false)
  
  const [showRisingShifts, setShowRisingShifts] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('showRisingShifts')
      return saved !== null ? saved === 'true' : true
    }
    return true
  })
  
  const [showDroppingShifts, setShowDroppingShifts] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('showDroppingShifts')
      return saved !== null ? saved === 'true' : false
    }
    return false
  })
  
  const [includeDayTemps, setIncludeDayTemps] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('includeDayTemps')
      return saved !== null ? saved === 'true' : true
    }
    return true
  })
  
  const [includeNightTemps, setIncludeNightTemps] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('includeNightTemps')
      return saved !== null ? saved === 'true' : true
    }
    return true
  })

  const [minimumShift, setMinimumShift] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('minimumShift')
      return saved || '12°'
    }
    return '12°'
  })
  
  const [showShiftsIn, setShowShiftsIn] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('showShiftsIn')
      return saved || '2 days'
    }
    return '2 days'
  })
  
  const [lookAhead, setLookAhead] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('lookAhead')
      return saved || '7 days'
    }
    return '7 days'
  })
  
  const [tempUnit, setTempUnit] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('tempUnit')
      return saved || 'Auto (°C)'
    }
    return 'Auto (°C)'
  })
  
  const [openPicker, setOpenPicker] = useState<string | null>(null)

  const [animatingToggle, setAnimatingToggle] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('showRisingShifts', String(showRisingShifts))
    }
  }, [showRisingShifts])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('showDroppingShifts', String(showDroppingShifts))
    }
  }, [showDroppingShifts])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('includeDayTemps', String(includeDayTemps))
    }
  }, [includeDayTemps])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('includeNightTemps', String(includeNightTemps))
    }
  }, [includeNightTemps])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('minimumShift', minimumShift)
    }
  }, [minimumShift])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('showShiftsIn', showShiftsIn)
    }
  }, [showShiftsIn])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('lookAhead', lookAhead)
    }
  }, [lookAhead])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('tempUnit', tempUnit)
    }
  }, [tempUnit])

  const minimumShiftOptions = Array.from({ length: 26 }, (_, i) => `${i + 5}°`)
  const showShiftsInOptions = [
    '12 hours', '18 hours', '1 day', '1.5 days', '2 days', 
    '2.5 days', '3 days', '4 days', '5 days', '6 days', '7 days'
  ]
  const lookAheadOptions = Array.from({ length: 7 }, (_, i) => `${i + 1} day${i > 0 ? 's' : ''}`)
  const tempUnitOptions = ['Auto (°C)', 'Celsius', 'Fahrenheit']

  const handleToggle = (toggleName: string, currentState: boolean, setter: (value: boolean) => void) => {
    setAnimatingToggle(toggleName)
    setter(!currentState)
    
    setTimeout(() => {
      setAnimatingToggle(null)
    }, 450)
  }

  const getAnimationClass = (toggleName: string, isOn: boolean) => {
    if (animatingToggle === toggleName) {
      return isOn ? 'animate-toggle-on' : 'animate-toggle-off'
    }
    return ''
  }

  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsSlideOut(true)
    setTimeout(() => {
      router.push('/')
    }, 300)
  }

  return (
    <div 
      className={`min-h-screen bg-[#EEEEEE] flex flex-col overflow-y-auto ${
        isSlideOut ? 'animate-slide-out' : 'animate-slide-in'
      }`}
    >
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        <Link href="/location" className="px-3 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap">
          Location
        </Link>
        <Link href="/" className="px-3 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap">
          No shifts
        </Link>
        <Link href="/settings" className="px-3 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap">
          Settings
        </Link>
        <Link href="/random" className="px-3 py-1 bg-blue-600 text-white text-xs rounded whitespace-nowrap">
          Random
        </Link>
      </div>

      <style jsx global>{`
        @keyframes toggle-on {
          0% { 
            transform: scale(1); 
            box-shadow: 0px 0px 0px 0px rgba(0, 0, 0, 0);
          }
          50% { 
            transform: scale(1.03); 
            box-shadow: 0px 2px 8px 2px rgba(0, 0, 0, 0.08);
          }
          100% { 
            transform: scale(1); 
            box-shadow: 0px 0px 0px 0px rgba(0, 0, 0, 0);
          }
        }
        
        @keyframes toggle-off {
          0% { 
            transform: scale(1); 
            box-shadow: 0px 0px 0px 0px rgba(0, 0, 0, 0);
          }
          50% { 
            transform: scale(0.97); 
            box-shadow: 0px 1px 6px 1px rgba(0, 0, 0, 0.08);
          }
          100% { 
            transform: scale(1); 
            box-shadow: 0px 0px 0px 0px rgba(0, 0, 0, 0);
          }
        }
        
        .animate-toggle-on {
          animation: toggle-on 450ms cubic-bezier(0.25, 0.8, 0.25, 1);
        }
        
        .animate-toggle-off {
          animation: toggle-off 450ms cubic-bezier(0.25, 0.8, 0.25, 1);
        }
        
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slide-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 250ms ease-out;
        }
        
        .animate-slide-up {
          animation: slide-up 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        
        @keyframes slide-in {
          from { 
            transform: translateX(100%); 
            opacity: 0.5;
          }
          to { 
            transform: translateX(0); 
            opacity: 1;
          }
        }
        
        @keyframes slide-out {
          from { 
            transform: translateX(0); 
            opacity: 1;
          }
          to { 
            transform: translateX(100%); 
            opacity: 0.5;
          }
        }
        
        .animate-slide-in {
          animation: slide-in 300ms cubic-bezier(0, 0, 0.2, 1);
        }
        
        .animate-slide-out {
          animation: slide-out 300ms cubic-bezier(0, 0, 0.2, 1);
        }
      `}</style>

      <div className="flex flex-col px-5 pb-0 flex-1" style={{ paddingTop: '36px' }}>
        <div className="max-w-[350px] mx-auto w-full flex flex-col gap-6 flex-1">
          <div className="flex items-center justify-between" style={{ height: '40px', padding: '12px 0' }}>
            <button onClick={handleBack} className="flex items-center justify-center w-8 h-10">
              <ChevronLeft className="w-6 h-6 text-[#424242]" strokeWidth={2.4} />
            </button>
            <div className="flex-1 flex items-center justify-center">
              <h1 className="text-base font-bold tracking-tight text-[#424242]">Settings</h1>
            </div>
            <div className="w-8"></div>
          </div>

          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-2.5">
              <div className="px-4">
                <h2 className="text-[15px] font-bold leading-[19px] text-[#757575]">Temp shifts</h2>
              </div>
              <div className="flex flex-col gap-px">
                <button 
                  onClick={() => setOpenPicker('minimumShift')}
                  className="flex items-center gap-4 px-4 py-4 bg-white rounded-t-xl h-[53px]"
                >
                  <div className="flex-1 flex flex-col justify-center gap-1">
                    <span className="text-[15px] font-semibold leading-[19px] text-[#424242] text-left">Minimum shift</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[15px] font-medium leading-[19px] text-[#424242]">{minimumShift}C</span>
                    <ChevronRight className="w-5 h-5 text-[#BDBDBD]" strokeWidth={2} />
                  </div>
                </button>

                <button 
                  onClick={() => setOpenPicker('showShiftsIn')}
                  className="flex items-center gap-4 px-4 py-4 bg-white h-[53px]"
                >
                  <div className="flex-1 flex flex-col justify-center gap-1">
                    <span className="text-[15px] font-semibold leading-[19px] text-[#424242] text-left">Show shifts that occur in</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[15px] font-medium leading-[19px] text-[#424242]">{showShiftsIn}</span>
                    <ChevronRight className="w-5 h-5 text-[#BDBDBD]" strokeWidth={2} />
                  </div>
                </button>

                <div className="flex items-center gap-4 px-4 py-4 bg-white h-[62px]">
                  <div className="flex-1 flex flex-col gap-1">
                    <span className="text-[15px] font-semibold leading-[19px] text-[#424242]">Show rising shifts</span>
                  </div>
                  <button 
                    onClick={() => handleToggle('rising', showRisingShifts, setShowRisingShifts)}
                    className={`relative flex items-center w-[46px] h-[30px] rounded-full transition-all duration-[450ms] ${
                      showRisingShifts ? 'bg-black justify-end' : 'bg-[#E0E0E0] justify-start'
                    } ${getAnimationClass('rising', !showRisingShifts)}`}
                    style={{ 
                      transitionTimingFunction: 'cubic-bezier(0.25, 0.8, 0.25, 1)',
                      boxShadow: showRisingShifts ? '0px 1px 24px 2px rgba(0, 0, 0, 0.09)' : 'none'
                    }}
                  >
                    <div className={`w-[30px] h-[30px] bg-white rounded-full border-[1.6px] transition-all duration-[450ms] ${
                      showRisingShifts ? 'border-black' : 'border-[#E0E0E0]'
                    }`}
                    style={{ 
                      transitionTimingFunction: 'cubic-bezier(0.25, 0.8, 0.25, 1)'
                    }} />
                  </button>
                </div>

                <div className="flex items-center gap-4 px-4 py-4 bg-white rounded-b-xl h-[62px]">
                  <div className="flex-1 flex flex-col gap-1">
                    <span className="text-[15px] font-semibold leading-[19px] text-[#424242]">Show dropping shifts</span>
                  </div>
                  <button 
                    onClick={() => handleToggle('dropping', showDroppingShifts, setShowDroppingShifts)}
                    className={`relative flex items-center w-[46px] h-[30px] rounded-full transition-all duration-[450ms] ${
                      showDroppingShifts ? 'bg-black justify-end' : 'bg-[#E0E0E0] justify-start'
                    } ${getAnimationClass('dropping', !showDroppingShifts)}`}
                    style={{ 
                      transitionTimingFunction: 'cubic-bezier(0.25, 0.8, 0.25, 1)',
                      boxShadow: showDroppingShifts ? '0px 1px 24px 2px rgba(0, 0, 0, 0.09)' : 'none'
                    }}
                  >
                    <div className={`w-[30px] h-[30px] bg-white rounded-full border-[1.6px] transition-all duration-[450ms] ${
                      showDroppingShifts ? 'border-black' : 'border-[#E0E0E0]'
                    }`}
                    style={{ 
                      transitionTimingFunction: 'cubic-bezier(0.25, 0.8, 0.25, 1)'
                    }} />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2.5">
              <div className="px-4">
                <h2 className="text-[15px] font-bold leading-[19px] text-[#757575]">General</h2>
              </div>
              <div className="flex flex-col gap-px">
                <button 
                  onClick={() => setOpenPicker('lookAhead')}
                  className="flex items-center gap-4 px-4 py-4 bg-white rounded-t-xl h-[53px]"
                >
                  <div className="flex-1 flex flex-col justify-center gap-1">
                    <span className="text-[15px] font-semibold leading-[19px] text-[#424242] text-left">Look ahead</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[15px] font-medium leading-[19px] text-[#424242]">{lookAhead}</span>
                    <ChevronRight className="w-5 h-5 text-[#BDBDBD]" strokeWidth={2} />
                  </div>
                </button>

                <div className="flex items-center gap-4 px-4 py-4 bg-white h-[62px]">
                  <div className="flex-1 flex flex-col gap-1">
                    <span className="text-[15px] font-semibold leading-[19px] text-[#424242]">Include day temperatures</span>
                  </div>
                  <button 
                    onClick={() => handleToggle('day', includeDayTemps, setIncludeDayTemps)}
                    className={`relative flex items-center w-[46px] h-[30px] rounded-full transition-all duration-[450ms] ${
                      includeDayTemps ? 'bg-black justify-end' : 'bg-[#E0E0E0] justify-start'
                    } ${getAnimationClass('day', !includeDayTemps)}`}
                    style={{ 
                      transitionTimingFunction: 'cubic-bezier(0.25, 0.8, 0.25, 1)',
                      boxShadow: includeDayTemps ? '0px 1px 24px 2px rgba(0, 0, 0, 0.09)' : 'none'
                    }}
                  >
                    <div className={`w-[30px] h-[30px] bg-white rounded-full border-[1.6px] transition-all duration-[450ms] ${
                      includeDayTemps ? 'border-black' : 'border-[#E0E0E0]'
                    }`}
                    style={{ 
                      transitionTimingFunction: 'cubic-bezier(0.25, 0.8, 0.25, 1)'
                    }} />
                  </button>
                </div>

                <div className="flex items-center gap-4 px-4 py-4 bg-white h-[112px]">
                  <div className="flex-1 flex flex-col gap-1">
                    <span className="text-[15px] font-semibold leading-[19px] text-[#424242]">Include night temperatures</span>
                    <span className="text-[15px] font-normal leading-[19px] tracking-tight text-[#9E9E9E]">
                      Enabling this will result in showing more temp shifts because it&apos;s usually colder at night
                    </span>
                  </div>
                  <button 
                    onClick={() => handleToggle('night', includeNightTemps, setIncludeNightTemps)}
                    className={`relative flex items-center w-[46px] h-[30px] rounded-full transition-all duration-[450ms] ${
                      includeNightTemps ? 'bg-black justify-end' : 'bg-[#E0E0E0] justify-start'
                    } ${getAnimationClass('night', !includeNightTemps)}`}
                    style={{ 
                      transitionTimingFunction: 'cubic-bezier(0.25, 0.8, 0.25, 1)',
                      boxShadow: includeNightTemps ? '0px 1px 24px 2px rgba(0, 0, 0, 0.09)' : 'none'
                    }}
                  >
                    <div className={`w-[30px] h-[30px] bg-white rounded-full border-[1.6px] transition-all duration-[450ms] ${
                      includeNightTemps ? 'border-black' : 'border-[#E0E0E0]'
                    }`}
                    style={{ 
                      transitionTimingFunction: 'cubic-bezier(0.25, 0.8, 0.25, 1)'
                    }} />
                  </button>
                </div>

                <button 
                  onClick={() => setOpenPicker('tempUnit')}
                  className="flex items-center gap-4 px-4 pt-4 pb-5 bg-white rounded-b-xl h-[57px]"
                >
                  <div className="flex-1 flex flex-col justify-center gap-1">
                    <span className="text-[15px] font-semibold leading-[19px] text-[#424242] text-left">Temperature unit</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[15px] font-medium leading-[19px] text-[#424242]">{tempUnit}</span>
                    <ChevronRight className="w-5 h-5 text-[#BDBDBD]" strokeWidth={2} />
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        <IOSPicker
          isOpen={openPicker === 'minimumShift'}
          onClose={() => setOpenPicker(null)}
          options={minimumShiftOptions}
          selectedValue={minimumShift}
          onSelect={(value) => {
            setMinimumShift(value)
            setOpenPicker(null)
          }}
          title="Minimum Shift"
        />

        <IOSPicker
          isOpen={openPicker === 'showShiftsIn'}
          onClose={() => setOpenPicker(null)}
          options={showShiftsInOptions}
          selectedValue={showShiftsIn}
          onSelect={(value) => {
            setShowShiftsIn(value)
            setOpenPicker(null)
          }}
          title="Show Shifts In"
        />

        <IOSPicker
          isOpen={openPicker === 'lookAhead'}
          onClose={() => setOpenPicker(null)}
          options={lookAheadOptions}
          selectedValue={lookAhead}
          onSelect={(value) => {
            setLookAhead(value)
            setOpenPicker(null)
          }}
          title="Look Ahead"
        />

        <IOSPicker
          isOpen={openPicker === 'tempUnit'}
          onClose={() => setOpenPicker(null)}
          options={tempUnitOptions}
          selectedValue={tempUnit}
          onSelect={(value) => {
            setTempUnit(value)
            setOpenPicker(null)
          }}
          title="Temperature Unit"
        />
      </div>

      <div className="flex items-center justify-center py-6">
        <span className="text-[13px] font-normal leading-5 text-[#9E9E9E]" style={{ letterSpacing: '0.01em' }}>sunario© 2025</span>
      </div>
    </div>
  )
}
