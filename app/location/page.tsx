'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Link from 'next/link'

export default function LocationPage() {
  const router = useRouter()
  const [isPressed, setIsPressed] = useState(false)

  const handleShareLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          localStorage.setItem('userLocation', JSON.stringify({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            timestamp: Date.now()
          }))
          router.push('/random')
        },
        (error) => {
          console.error('[v0] Location error:', error)
          alert('Unable to get your location. Please enable location services.')
        }
      )
    } else {
      alert('Geolocation is not supported by your browser.')
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: '100vh',
        padding: '24px',
        background: '#FFFFFF',
        overflowY: 'scroll',
        maxWidth: '600px',
        margin: '0 auto'
      }}
      className="px-4 sm:px-6"
    >
      <div style={{ position: 'fixed', bottom: '16px', right: '16px', zIndex: 50, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <Link href="/location" style={{ padding: '4px 12px', background: '#1f2937', color: 'white', fontSize: '12px', borderRadius: '4px', textDecoration: 'none', whiteSpace: 'nowrap' }}>
          Location
        </Link>
        <Link href="/" style={{ padding: '4px 12px', background: '#1f2937', color: 'white', fontSize: '12px', borderRadius: '4px', textDecoration: 'none', whiteSpace: 'nowrap' }}>
          No shifts
        </Link>
        <Link href="/settings" style={{ padding: '4px 12px', background: '#1f2937', color: 'white', fontSize: '12px', borderRadius: '4px', textDecoration: 'none', whiteSpace: 'nowrap' }}>
          Settings
        </Link>
        <Link href="/random" style={{ padding: '4px 12px', background: '#2563eb', color: 'white', fontSize: '12px', borderRadius: '4px', textDecoration: 'none', whiteSpace: 'nowrap' }}>
          Random
        </Link>
        <button 
          onClick={() => window.toggleDeviceFrame?.()} 
          style={{ padding: '4px 12px', background: '#9333ea', color: 'white', fontSize: '12px', borderRadius: '4px', cursor: 'pointer', border: 'none', whiteSpace: 'nowrap' }}
        >
          Show in device
        </button>
      </div>

      {/* Content Card */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '48px 0px 32px',
          gap: '32px',
          margin: '0 auto',
          width: '100%',
          maxWidth: '342px',
          flex: 1,
          borderRadius: '20px'
        }}
      >
        {/* Emoji and Text */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px',
            width: '100%'
          }}
        >
          {/* Emoji */}
          <div
            style={{
              fontFamily: 'Inter, system-ui, sans-serif',
              fontWeight: 700,
              fontSize: '34px',
              lineHeight: '38px',
              textAlign: 'center',
              letterSpacing: '-0.03em',
              color: '#000000'
            }}
          >
            😎
          </div>

          {/* Text Container */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              width: '100%',
              gap: '0px'
            }}
          >
            {/* Main heading */}
            <div
              style={{
                width: '100%',
                fontFamily: 'Inter, system-ui, sans-serif',
                fontWeight: 700,
                fontSize: '34px',
                lineHeight: '38px',
                textAlign: 'center',
                letterSpacing: '-0.03em',
                color: '#212121'
              }}
            >
              Hello there, please share your location
            </div>

            {/* Subheading */}
            <div
              style={{
                width: '100%',
                fontFamily: 'Inter, system-ui, sans-serif',
                fontWeight: 700,
                fontSize: '34px',
                lineHeight: '38px',
                textAlign: 'center',
                letterSpacing: '-0.03em',
                color: '#BDBDBD',
                marginTop: '0px'
              }}
            >
              So we can do our forecasting magic
            </div>
          </div>
        </div>

        {/* Share Location Button */}
        <button
          onClick={handleShareLocation}
          onMouseDown={() => setIsPressed(true)}
          onMouseUp={() => setIsPressed(false)}
          onMouseLeave={() => setIsPressed(false)}
          onTouchStart={() => setIsPressed(true)}
          onTouchEnd={() => setIsPressed(false)}
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '12px 48px',
            gap: '6px',
            background: isPressed ? '#23AEE7' : '#5EBFE7',
            borderRadius: '64px',
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'Inter, system-ui, sans-serif',
            fontWeight: 700,
            fontSize: '20px',
            lineHeight: '42px',
            letterSpacing: '-0.03em',
            color: '#000000',
            transition: 'background 0.1s ease'
          }}
        >
          {/* Marker Pin Icon */}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 22C12 22 20 16 20 10C20 5.58172 16.4183 2 12 2C7.58172 2 4 5.58172 4 10C4 16 12 22 12 22Z" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Share location
        </button>
      </div>

      {/* Copyright */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '16px 0px',
          margin: '0 auto',
          width: '100%',
          maxWidth: '342px'
        }}
      >
        <div
          style={{
            fontFamily: 'Inter, system-ui, sans-serif',
            fontWeight: 500,
            fontSize: '14px',
            lineHeight: '20px',
            color: '#9E9E9E'
          }}
        >
          sunario© 2025
        </div>
      </div>
    </div>
  )
}
