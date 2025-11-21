"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

const days = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"]
const fullDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

function getSettings() {
  if (typeof window === "undefined") {
    return {
      minimumShift: 12,
      showRisingShifts: true,
      showDroppingShifts: false,
    }
  }

  const minimumShiftStr = localStorage.getItem("minimumShift") || "12°"
  const minimumShift = Number.parseInt(minimumShiftStr.replace("°", ""))
  const showRisingShifts = localStorage.getItem("showRisingShifts") !== "false"
  const showDroppingShifts = localStorage.getItem("showDroppingShifts") === "true"

  return {
    minimumShift,
    showRisingShifts,
    showDroppingShifts,
  }
}

function generateRandomShifts() {
  const settings = getSettings()

  const types = []
  if (settings.showRisingShifts) types.push("rise")
  if (settings.showDroppingShifts) types.push("drop")

  if (types.length === 0) {
    return null
  }

  const numShifts = Math.floor(Math.random() * 4)

  if (numShifts === 0) {
    return null
  }

  const shifts = []

  for (let i = 0; i < numShifts; i++) {
    const type = types[Math.floor(Math.random() * types.length)]
    const tempDiff = settings.minimumShift + Math.floor(Math.random() * 16)
    const startTemp = Math.floor(Math.random() * 25) + 5
    const endTemp = type === "rise" ? startTemp + tempDiff : startTemp - tempDiff

    const daysUntil = Math.floor(Math.random() * 7)
    const isToday = daysUntil === 0
    const sameDay = isToday && Math.random() > 0.5

    const startDay = isToday ? "today" : days[Math.floor(Math.random() * days.length)]
    const endDay = sameDay
      ? ""
      : isToday
        ? days[Math.floor(Math.random() * days.length)]
        : days[Math.floor(Math.random() * days.length)]

    const status = daysUntil === 0 ? "happening" : "coming"
    const timeOfDay = ["morning", "midday", "evening", "night"][Math.floor(Math.random() * 4)]

    let collapsedText = ""
    let expandedText = ""

    if (isToday && sameDay) {
      collapsedText = `today ${startTemp}° → ${endTemp}°`
      expandedText = `This ${type} is happening now: Today ${timeOfDay} (${startTemp}°) → ${endTemp}°`
    } else if (isToday && !sameDay) {
      const endDayIndex = days.indexOf(endDay)
      const endDayFull = fullDays[endDayIndex]
      collapsedText = `today ${startTemp}° → ${endDay} ${endTemp}°`
      expandedText = `This ${type} is happening now: Today ${timeOfDay} (${startTemp}°) → ${endDayFull} ${timeOfDay} (${endTemp}°)`
    } else {
      const startDayIndex = days.indexOf(startDay)
      const endDayIndex = days.indexOf(endDay)
      const startDayFull = fullDays[startDayIndex]
      const endDayFull = fullDays[endDayIndex]

      collapsedText = `${startDay} ${startTemp}° → ${endDay} ${endTemp}°`
      expandedText =
        status === "happening"
          ? `This ${type} is happening now: ${startDayFull} ${timeOfDay} (${startTemp}°) → ${endDayFull} ${timeOfDay} (${endTemp}°)`
          : `This ${type} starts in ${daysUntil} day${daysUntil !== 1 ? "s" : ""}: ${startDayFull} ${timeOfDay} (${startTemp}°) → ${endDayFull} ${timeOfDay} (${endTemp}°)`
    }

    shifts.push({
      type,
      temp: `${tempDiff}°`,
      label: type,
      status,
      collapsed: collapsedText,
      expanded: expandedText,
      bgColor: type === "rise" ? "#FEDADA" : "#DAEDF7",
      inactiveBtnColor: type === "rise" ? "#FEEFEF" : "#EAF5FE",
      statusColor: type === "rise" ? "#FC8888" : "#6DB3E0",
    })
  }

  return shifts
}

export default function RandomPage() {
  const router = useRouter()
  const [shifts, setShifts] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState(1)
  const [isExpanded, setIsExpanded] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("shiftExpandedState")
      return saved === "true"
    }
    return false
  })
  const currentYear = new Date().getFullYear()

  const [pullDistance, setPullDistance] = useState(0)
  const [isPulling, setIsPulling] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [startY, setStartY] = useState(0)

  const handleStart = (clientY: number) => {
    if (window.scrollY === 0) {
      setStartY(clientY)
      setIsPulling(true)
    }
  }

  const handleMove = (clientY: number) => {
    if (!isPulling || isRefreshing) return
    const distance = Math.max(0, clientY - startY)
    if (distance > 0) {
      setPullDistance(Math.min(distance, 200))
    }
  }

  const handleEnd = () => {
    setIsPulling(false)
    if (pullDistance > 100 && !isRefreshing) {
      setPullDistance(52)
      setIsRefreshing(true)
      setTimeout(() => {
        handleRegenerate()
        setIsRefreshing(false)
        setPullDistance(0)
      }, 1500)
    } else {
      setPullDistance(0)
    }
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    handleStart(e.touches[0].clientY)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientY)
  }

  const handleTouchEnd = () => {
    handleEnd()
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("button, a")) return
    handleStart(e.clientY)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPulling) {
      e.preventDefault()
      handleMove(e.clientY)
    }
  }

  const handleMouseUp = () => {
    if (isPulling) {
      handleEnd()
    }
  }

  const handleMouseLeave = () => {
    if (isPulling) {
      handleEnd()
    }
  }

  const refreshIconOpacity = isRefreshing ? 1 : Math.min(pullDistance / 100, 1)
  const refreshIconRotation = isRefreshing ? "spin" : `${pullDistance * 3}deg`
  const refreshIconTop = "24px"

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("shiftExpandedState", String(isExpanded))
    }
  }, [isExpanded])

  useEffect(() => {
    const randomShifts = generateRandomShifts()
    setShifts(randomShifts)
    setLoading(false)
  }, [])

  const handleRegenerate = () => {
    setLoading(true)
    setActiveTab(1)
    setTimeout(() => {
      const randomShifts = generateRandomShifts()
      setShifts(randomShifts)
      setLoading(false)
    }, 300)
  }

  const TabButton = ({ number, isActive, currentShift }: { number: number; isActive: boolean; currentShift: any }) => {
    const imageStyle = {
      width: "56px",
      height: "56px",
      minWidth: "56px",
      minHeight: "56px",
      maxWidth: "56px",
      maxHeight: "56px",
      objectFit: "cover" as const,
      flexShrink: 0,
    }

    const isDropPage = currentShift?.type === "drop"

    if (number === 1) {
      if (isActive) {
        return <img src="/images/tab-1-active.png" alt="1" style={imageStyle} />
      } else {
        return (
          <img
            src={isDropPage ? "/images/tab-1-inactive-rise.png" : "/images/tab-1-inactive-drop.png"}
            alt="1"
            style={imageStyle}
          />
        )
      }
    }

    if (number === 2) {
      if (isActive) {
        return <img src="/images/tab-2-active.png" alt="2" style={imageStyle} />
      } else {
        return (
          <img
            src={isDropPage ? "/images/tab-2-inactive-rise.png" : "/images/tab-2-inactive-drop.png"}
            alt="2"
            style={imageStyle}
          />
        )
      }
    }

    if (number === 3) {
      if (isActive) {
        return <img src="/images/tab-3-active.png" alt="3" style={imageStyle} />
      } else {
        return (
          <img
            src={isDropPage ? "/images/tab-3-inactive-rise.png" : "/images/tab-3-inactive-drop.png"}
            alt="3"
            style={imageStyle}
          />
        )
      }
    }

    return null
  }

  const Arrow = () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        display: "inline-block",
        verticalAlign: "middle",
        margin: "0 3px",
      }}
    >
      <path
        d="M8.94886 17.1818L6.97159 15.2216L12.1619 10.0312H0V7.15057H12.1619L6.97159 1.96875L8.94886 0L17.5398 8.59091L8.94886 17.1818Z"
        fill="#424242"
      />
    </svg>
  )

  const renderTextWithArrow = (text: string) => {
    const parts = text.split("→")
    if (parts.length === 1) return text
    return (
      <>
        {parts[0]}
        <Arrow />
        {parts[1]}
      </>
    )
  }

  const getRandomGif = () => {
    const gifs = [
      "/gifs/no-shifts/dancing.gif",
      "/gifs/no-shifts/trump-yes.gif",
      "/gifs/no-shifts/napoleon-yes.gif",
      "/gifs/no-shifts/lebowski-thumbs.gif",
      "/gifs/no-shifts/office-party.gif",
      "/gifs/no-shifts/baby-cheer.gif",
      "/gifs/no-shifts/oprah-tears.gif",
      "/gifs/no-shifts/shaq-nod.gif",
      "/gifs/no-shifts/happy-crying.gif",
      "/gifs/no-shifts/elmo-celebrate.gif",
      "/gifs/no-shifts/excited-kid.gif",
    ]
    return gifs[Math.floor(Math.random() * gifs.length)]
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    )
  }

  if (!shifts) {
    const randomGif = getRandomGif()

    return (
      <div
        className="relative w-full min-h-screen bg-white flex flex-col max-w-[600px] mx-auto"
        style={{ fontFamily: "Inter, sans-serif" }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
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
          <button
            onClick={handleRegenerate}
            className="px-3 py-1 bg-blue-600 text-white text-xs rounded whitespace-nowrap"
          >
            Random
          </button>
        </div>

        <div
          style={{
            position: "fixed",
            top: refreshIconTop,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 40,
            opacity: isRefreshing || pullDistance > 10 ? 1 : 0,
            transition: isRefreshing ? "opacity 0.2s ease-in-out" : "none",
            pointerEvents: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            willChange: "opacity",
          }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            style={{
              transform: refreshIconRotation === "spin" ? undefined : `rotate(${refreshIconRotation})`,
              transformOrigin: "center center",
              willChange: "transform",
              animation: refreshIconRotation === "spin" ? "spin 1s linear infinite" : undefined,
            }}
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              fill="none"
              stroke="#424242"
              strokeWidth="3"
              strokeDasharray="8 4"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <div
          className="flex flex-col items-center pt-5 pb-0 px-4 sm:px-6 flex-1"
          style={{
            transform: `translateY(${pullDistance}px)`,
            transition: isPulling ? "none" : "transform 0.5s ease-out",
          }}
        >
          <div className="flex flex-col items-start gap-10 w-full max-w-[342px] py-3 flex-1">
            <div className="flex flex-row justify-end items-center w-full" style={{ padding: "12px" }}>
              <Link href="/settings">
                <button
                  className="flex items-center justify-center w-10 h-10 rounded-full"
                  style={{ filter: "drop-shadow(0px 0px 22px rgba(0, 0, 0, 0.06))" }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M3 8L15 8M15 8C15 9.65686 16.3431 11 18 11C19.6569 11 21 9.65685 21 8C21 6.34315 19.6569 5 18 5C16.3431 5 15 6.34315 15 8ZM9 16L21 16M9 16C9 17.6569 7.65685 19 6 19C4.34315 19 3 17.65685 3 16C3 14.3431 4.34315 13 6 13C7.65685 13 9 14.3431 9 16Z"
                      stroke="#424242"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </Link>
            </div>

            <div className="flex flex-col items-start gap-5 w-full">
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
                src={randomGif || "/placeholder.svg"}
                alt="Happy celebration"
                className="w-full h-[240px] object-cover rounded-[24px]"
              />
            </div>
          </div>

          <div className="py-6 text-center w-full">
            <p
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 400,
                fontSize: "13px",
                lineHeight: "20px",
                color: "#9E9E9E",
                letterSpacing: "0.01em",
              }}
            >
              sunario© {currentYear}
            </p>
          </div>
        </div>
      </div>
    )
  }

  const currentShift = shifts[activeTab - 1]

  return (
    <div
      className="relative w-full min-h-screen overflow-y-auto flex flex-col items-center max-w-[600px] mx-auto"
      style={{ backgroundColor: "#FFFFFF", fontFamily: "Inter, sans-serif" }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
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
        <button
          onClick={handleRegenerate}
          className="px-3 py-1 bg-blue-600 text-white text-xs rounded whitespace-nowrap"
        >
          Random
        </button>
      </div>

      <div
        style={{
          position: "absolute",
          top: refreshIconTop,
          left: "50%",
          transform: "translateX(-50%) translateZ(0)",
          opacity: refreshIconOpacity,
          zIndex: 10,
          transition: isRefreshing
            ? "opacity 0.5s ease-out, top 0.5s ease-out"
            : isPulling
              ? "none"
              : "opacity 0.5s ease-out, top 0.5s ease-out",
          width: "24px",
          height: "24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          willChange: "opacity",
        }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          style={{
            transform: refreshIconRotation === "spin" ? undefined : `rotate(${refreshIconRotation})`,
            transformOrigin: "center center",
            willChange: "transform",
            animation: refreshIconRotation === "spin" ? "spin 1s linear infinite" : undefined,
          }}
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            fill="none"
            stroke="#424242"
            strokeWidth="3"
            strokeDasharray="8 4"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <div
        className="w-full flex flex-col items-center pt-5 px-3 sm:px-5 flex-1"
        style={{
          transform: `translateY(${pullDistance}px)`,
          transition: isPulling ? "none" : "transform 0.5s ease-out",
        }}
      >
        <div
          className="flex flex-col justify-between items-start"
          style={{
            width: "350px",
            background: currentShift.bgColor,
            borderRadius: "20px",
            padding: "12px 20px 32px 24px",
            flex: 1,
          }}
        >
          <div className="flex flex-row justify-between items-center w-full">
            <div className="flex flex-col justify-center items-start gap-0">
              <p
                style={{
                  fontFamily: "Inter",
                  fontWeight: 700,
                  fontSize: "14px",
                  lineHeight: "16px",
                  letterSpacing: "-0.02em",
                  color: "#424242",
                }}
              >
                Amsterdam
              </p>
              <p
                style={{
                  fontFamily: "Inter",
                  fontWeight: 500,
                  fontSize: "14px",
                  lineHeight: "16px",
                  letterSpacing: "-0.02em",
                  color: "#424242",
                }}
              >
                1 min ago
              </p>
            </div>

            <Link href="/settings">
              <button
                className="flex items-center justify-center w-10 h-10 rounded-full"
                style={{ filter: "drop-shadow(0px 0px 22px rgba(0, 0, 0, 0.06))" }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M3 8L15 8M15 8C15 9.65686 16.3431 11 18 11C19.6569 11 21 9.65685 21 8C21 6.34315 19.6569 5 18 5C16.3431 5 15 6.34315 15 8ZM9 16L21 16M9 16C9 17.6569 7.65685 19 6 19C4.34315 19 3 17.65685 3 16C3 14.3431 4.34315 13 6 13C7.65685 13 9 14.3431 9 16Z"
                    stroke="#424242"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </Link>
          </div>

          <div className="flex flex-col items-start gap-7 w-full flex-1 justify-end">
            {shifts.length > 1 && (
              <div
                className="flex flex-row items-center"
                style={{ gap: "10px", marginBottom: "12px", paddingLeft: "4px" }}
              >
                {shifts.map((_: any, index: number) => (
                  <button
                    key={index + 1}
                    onClick={() => {
                      setActiveTab(index + 1)
                    }}
                    style={{
                      width: "56px",
                      height: "56px",
                      minWidth: "56px",
                      minHeight: "56px",
                      maxWidth: "56px",
                      maxHeight: "56px",
                      padding: 0,
                      border: "none",
                      background: "transparent",
                      cursor: "pointer",
                      flexShrink: 0,
                      overflow: "hidden",
                    }}
                  >
                    <TabButton number={index + 1} isActive={activeTab === index + 1} currentShift={currentShift} />
                  </button>
                ))}
              </div>
            )}

            <div className="flex flex-col items-start gap-4 w-full">
              <div className="flex flex-row items-baseline" style={{ marginBottom: "0px" }}>
                <span
                  style={{
                    fontFamily: "Inter",
                    fontWeight: 500,
                    fontSize: "140px",
                    lineHeight: "140px",
                    letterSpacing: "-0.09em",
                    color: "#424242",
                    marginRight: "-38px",
                  }}
                >
                  {currentShift.temp}
                </span>
                <span
                  style={{
                    fontFamily: "Inter",
                    fontWeight: 700,
                    fontSize: "30px",
                    lineHeight: "36px",
                    letterSpacing: "-0.02em",
                    color: "#424242",
                  }}
                >
                  {currentShift.label}
                </span>
              </div>

              <div
                className="flex flex-row justify-between items-end w-full"
                style={{ padding: "0 4px", gap: "16px", marginTop: "4px" }}
              >
                <div className="flex flex-col items-start" style={{ gap: "0px", flex: 1, paddingLeft: "4px" }}>
                  <p
                    style={{
                      fontFamily: "Inter",
                      fontWeight: 700,
                      fontSize: "24px",
                      lineHeight: "26px",
                      letterSpacing: "-0.02em",
                      color: currentShift.statusColor,
                      marginBottom: "0px",
                    }}
                  >
                    {currentShift.status}
                  </p>
                  <div
                    style={{
                      overflow: "hidden",
                      transition:
                        "max-height 500ms cubic-bezier(0.4, 0, 0.2, 1), opacity 500ms cubic-bezier(0.4, 0, 0.2, 1)",
                      maxHeight: isExpanded ? "200px" : "30px",
                      opacity: 1,
                    }}
                  >
                    <p
                      style={{
                        fontFamily: "Inter",
                        fontWeight: 700,
                        fontSize: "24px",
                        lineHeight: "30px",
                        letterSpacing: "-0.03em",
                        color: "#424242",
                        marginTop: "0px",
                      }}
                    >
                      {renderTextWithArrow(isExpanded ? currentShift.expanded : currentShift.collapsed)}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="flex items-center justify-center flex-shrink-0"
                  style={{
                    width: "36px",
                    height: "36px",
                    background: currentShift.type === "rise" ? "#FEEFEF" : "#EAF5FE",
                    border: "none",
                    borderRadius: "8px",
                    padding: 0,
                    cursor: "pointer",
                  }}
                >
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 28 28"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{
                      transform: isExpanded ? "rotate(0deg)" : "rotate(180deg)",
                      transition: "transform 500ms cubic-bezier(0.4, 0, 0.2, 1)",
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

        <div className="py-6 text-center w-full">
          <p
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 400,
              fontSize: "13px",
              lineHeight: "20px",
              color: "#9E9E9E",
              letterSpacing: "0.01em",
            }}
          >
            sunario© {currentYear}
          </p>
        </div>
      </div>
    </div>
  )
}
