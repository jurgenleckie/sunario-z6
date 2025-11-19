'use client'

import Link from 'next/link'

export default function Home() {
  const currentYear = new Date().getFullYear()

  return (
    <div className="relative w-full min-h-screen bg-white flex flex-col" style={{ fontFamily: 'Inter, sans-serif' }}>
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

      <div className="flex flex-col items-center pt-5 pb-0 px-5 flex-1">
        <div className="flex flex-col items-start gap-10 w-full max-w-[342px] py-3 flex-1">
          {/* Header */}
          <div className="flex flex-row justify-end items-center w-full h-10" style={{ padding: '12px' }}>
            <Link href="/settings">
              <button className="flex items-center justify-center w-10 h-10 rounded-full" style={{ filter: 'drop-shadow(0px 0px 22px rgba(0, 0, 0, 0.06))' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 8L15 8M15 8C15 9.65686 16.3431 11 18 11C19.6569 11 21 9.65685 21 8C21 6.34315 19.6569 5 18 5C16.3431 5 15 6.34315 15 8ZM9 16L21 16M9 16C9 17.6569 7.65685 19 6 19C4.34315 19 3 17.6569 3 16C3 14.3431 4.34315 13 6 13C7.65685 13 9 14.3431 9 16Z" stroke="#424242" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </Link>
          </div>

          {/* Text and Image */}
          <div className="flex flex-col items-start gap-5 w-full">
            {/* Text */}
            <div className="flex flex-col items-start w-full">
              <h1 className="w-full font-bold text-[38px] leading-[42px] tracking-[-0.03em] text-[#212121]">
                No big temp
                <br />
                shifts expected
              </h1>
              <p className="w-full font-bold text-[38px] leading-[42px] tracking-[-0.03em] text-[#BDBDBD]">
                the next 7 days
              </p>
            </div>

            <img 
              src="https://media.giphy.com/media/artj92V8o75VPL7AeQ/giphy.gif" 
              alt="Happy celebration" 
              className="w-full h-[240px] object-cover rounded-[24px]"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-row justify-center items-center w-full py-6">
          <p style={{ 
            fontFamily: 'Inter, sans-serif',
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
