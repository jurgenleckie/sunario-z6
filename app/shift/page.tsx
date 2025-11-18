'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function ShiftPage() {
  const currentYear = new Date().getFullYear()
  const [activeTab, setActiveTab] = useState(1)
  const [isExpanded, setIsExpanded] = useState(false)

  const shiftData = {
    1: {
      type: 'rise',
      temp: '9°',
      label: 'rise',
      status: 'happening',
      collapsed: 'thu 8° → sun 17°',
      expanded: 'This rise starts today: Thursday evening (8°) → Sunday midday (17°)',
      bgColor: '#FEDADA',
      inactiveBtnColor: '#FEEFEF',
      statusColor: '#FC8888'
    },
    2: {
      type: 'rise',
      temp: '13°',
      label: 'rise',
      status: 'happening',
      collapsed: 'mon 15° → wed 28°',
      expanded: 'This rise starts in 4 days: Monday evening (15°) → Wednesday evening (28°)',
      bgColor: '#FEDADA',
      inactiveBtnColor: '#FEEFEF',
      statusColor: '#FC8888'
    },
    3: {
      type: 'drop',
      temp: '21°',
      label: 'drop',
      status: 'happening',
      collapsed: 'thu 28° → sat 7°',
      expanded: 'This drop starts in 6 days: Thursday evening (28°) → Saturday evening (7°)',
      bgColor: '#DAEDF7',
      inactiveBtnColor: '#EAF5FE',
      statusColor: '#6DB3E0'
    }
  }

  const currentShift = shiftData[activeTab as keyof typeof shiftData] || shiftData[1]

  const TabButton = ({ number, isActive, bgColor }: { number: number; isActive: boolean; bgColor: string }) => (
    <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="56" height="56" rx="14" fill={isActive ? 'white' : bgColor}/>
      <text 
        x="28" 
        y="32" 
        dominantBaseline="middle" 
        textAnchor="middle" 
        fill={isActive ? '#424242' : '#757575'} 
        fontFamily="Inter" 
        fontWeight={isActive ? '700' : '600'} 
        fontSize="22" 
        letterSpacing="-0.02em"
      >
        {number}
      </text>
    </svg>
  )

  const Arrow = () => (
    <svg 
      width="18" 
      height="18" 
      viewBox="0 0 18 18" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      style={{ 
        display: 'inline-block',
        verticalAlign: 'middle',
        margin: '0 3px'
      }}
    >
      <path d="M8.94886 17.1818L6.97159 15.2216L12.1619 10.0312H0V7.15057H12.1619L6.97159 1.96875L8.94886 0L17.5398 8.59091L8.94886 17.1818Z" fill="#424242"/>
    </svg>
  )

  const renderTextWithArrow = (text: string) => {
    const parts = text.split('→')
    if (parts.length === 1) return text
    
    return (
      <>
        {parts[0]}
        <Arrow />
        {parts[1]}
      </>
    )
  }

  return (
    <div className="relative w-full min-h-screen overflow-y-auto flex flex-col items-center" style={{ backgroundColor: '#FFFFFF', fontFamily: 'Inter, sans-serif' }}>
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <clipPath id="squircle-clip" clipPathUnits="objectBoundingBox">
            <path d="M 0.5,0 C 0.776,0 1,0.224 1,0.5 S 0.776,1 0.5,1 0.224,1 0,0.776 0,0.5 0.224,0 0.5,0 Z" />
          </clipPath>
        </defs>
      </svg>

      {/* Test Navigation Links */}
      <div className="fixed top-2 left-2 z-50 flex gap-2">
        <Link href="/" className="px-3 py-1 bg-gray-800 text-white text-xs rounded">
          No shifts
        </Link>
        <Link href="/shift" className="px-3 py-1 bg-gray-800 text-white text-xs rounded">
          Shift page
        </Link>
        <Link href="/settings" className="px-3 py-1 bg-gray-800 text-white text-xs rounded">
          Settings
        </Link>
      </div>

      <div className="w-full flex flex-col items-center pt-5 pb-0 px-5 flex-1">
        <div 
          className="flex flex-col justify-between items-start"
          style={{
            width: '350px',
            background: currentShift.bgColor,
            borderRadius: '20px',
            padding: '12px 20px 32px 24px',
            flex: 1
          }}
        >
          {/* Header */}
          <div className="flex flex-row justify-between items-center w-full">
            {/* Location and time */}
            <div className="flex flex-col justify-center items-start gap-0">
              <p style={{
                fontFamily: 'Inter',
                fontWeight: 700,
                fontSize: '14px',
                lineHeight: '16px',
                letterSpacing: '-0.02em',
                color: '#424242'
              }}>
                Amsterdam
              </p>
              <p style={{
                fontFamily: 'Inter',
                fontWeight: 500,
                fontSize: '14px',
                lineHeight: '16px',
                letterSpacing: '-0.02em',
                color: '#424242'
              }}>
                1 min ago
              </p>
            </div>

            {/* Settings icon */}
            <Link href="/settings">
              <button 
                className="flex items-center justify-center w-10 h-10 rounded-full"
                style={{ filter: 'drop-shadow(0px 0px 22px rgba(0, 0, 0, 0.06))' }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 8L15 8M15 8C15 9.65686 16.3431 11 18 11C19.6569 11 21 9.65685 21 8C21 6.34315 19.6569 5 18 5C16.3431 5 15 6.34315 15 8ZM9 16L21 16M9 16C9 17.6569 7.65685 19 6 19C4.34315 19 3 17.6568 3 16C3 14.3431 4.34315 13 6 13C7.65685 13 9 14.3431 9 16Z" stroke="#424242" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </Link>
          </div>

          {/* Main Content */}
          <div className="flex flex-col items-start gap-7 w-full flex-1 justify-end">
            <div className="flex flex-row items-center" style={{ gap: '8px' }}>
              {[1, 2, 3].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    width: '56px',
                    height: '56px',
                    padding: 0,
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer'
                  }}
                >
                  <TabButton number={tab} isActive={activeTab === tab} bgColor={currentShift.inactiveBtnColor} />
                </button>
              ))}
            </div>

            <div className="flex flex-col items-start gap-4 w-full">
              {/* Big Number and Label */}
              <div className="flex flex-row items-baseline">
                <span style={{
                  fontFamily: 'Inter',
                  fontWeight: 500,
                  fontSize: '140px',
                  lineHeight: '169px',
                  letterSpacing: '-0.09em',
                  color: '#424242',
                  marginRight: '-38px'
                }}>
                  {currentShift.temp}
                </span>
                <span style={{
                  fontFamily: 'Inter',
                  fontWeight: 700,
                  fontSize: '30px',
                  lineHeight: '36px',
                  letterSpacing: '-0.02em',
                  color: '#424242'
                }}>
                  {currentShift.label}
                </span>
              </div>

              {/* Explanation */}
              <div className="flex flex-row justify-between items-end w-full" style={{ padding: '0 4px', gap: '16px' }}>
                <div className="flex flex-col items-start" style={{ gap: '0px', flex: 1 }}>
                  <p style={{
                    fontFamily: 'Inter',
                    fontWeight: 700,
                    fontSize: '24px',
                    lineHeight: '26px',
                    letterSpacing: '-0.02em',
                    color: currentShift.statusColor
                  }}>
                    {currentShift.status}
                  </p>
                  <p style={{
                    fontFamily: 'Inter',
                    fontWeight: 700,
                    fontSize: '24px',
                    lineHeight: '30px',
                    letterSpacing: '-0.03em',
                    color: '#424242'
                  }}>
                    {renderTextWithArrow(isExpanded ? currentShift.expanded : currentShift.collapsed)}
                  </p>
                </div>

                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="flex items-center justify-center flex-shrink-0"
                  style={{
                    width: '36px',
                    height: '36px',
                    background: currentShift.inactiveBtnColor,
                    borderRadius: '8px'
                  }}
                >
                  <svg 
                    width="28" 
                    height="28" 
                    viewBox="0 0 28 28" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                    style={{
                      transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 300ms ease-in-out'
                    }}
                  >
                    <path 
                      d="M7 10.5L14 17.5L21 10.5" 
                      stroke="#424242" 
                      strokeWidth="2.3" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright - now outside the colored card */}
        <div className="flex flex-row justify-center items-center w-full py-6">
          <p style={{
            fontFamily: 'Inter',
            fontWeight: 400,
            fontSize: '13px',
            lineHeight: '20px',
            color: '#9E9E9E',
            letterSpacing: '0.01em'
          }}>
            sunario© {currentYear}
          </p>
        </div>
      </div>
    </div>
  )
}
