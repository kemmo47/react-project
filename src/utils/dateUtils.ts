import { TIMEZONE } from '@/constants'
import { CenterList } from '@/types'
import moment from 'moment-timezone'

const weekJPNames = ['日', '月', '火', '水', '木', '金', '土']

/**
 * Convert Unix timestamp to Japanese date format (MM/DD (day))
 */
export function formatDate(timestamp: number): { date: string; dayOfWeek: string } {
  const date = new Date(timestamp * 1000)
  const month = date.getMonth() + 1
  const day = date.getDate()
  const dayOfWeek = weekJPNames[date.getDay()]

  return {
    date: `${month.toString().padStart(2, '')}/${day.toString().padStart(2, '0')}`,
    dayOfWeek: `${dayOfWeek}`,
  }
}

export const timestampToJPDate = (timestamp: number): { value: number; label: string } => {
  const res = moment.tz(timestamp * 1000, 'Asia/Tokyo')
  return {
    label: res.format('MM/DD') + '（' + weekJPNames[res.day()] + '）',
    value: timestamp,
  }
}

export const getShopDateSets = (within: number) => {
  const dateList = []
  const now = moment().tz(TIMEZONE)
  const nowStartOfDay = now.clone().startOf('day')
  const isAfterCutoff = now.hour() > 18 || (now.hour() === 18 && now.minute() >= 30)

  const startOffset = isAfterCutoff ? 1 : 0

  for (let i = 0; i < within; i++) {
    const dateJST = nowStartOfDay.clone().add(i + startOffset, 'days')
    dateList.push({ date: dateJST.unix() })
  }

  return dateList
}

/**
 * Format date in MM/DD (day) format from Date object
 */
export function formatDateObject(date: Date): string {
  const month = date.getMonth() + 1
  const day = date.getDate()
  const dayOfWeek = weekJPNames[date.getDay()]

  return `${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}（${dayOfWeek}）`
}

/**
 * Get available dates for delivery or store visit
 * Returns an array of dates starting from today + minDays to today + maxDays
 */
export function generateTimeList(
  minDay: number,
  maxDay: number,
  isComeToday: boolean
): { timestamp: number; formatted: string }[] {
  const now = new Date()
  const timeZone = TIMEZONE
  const options = { timeZone, hour12: false }
  const currentTimeStr = now.toLocaleString('en-US', {
    ...options,
    hour: 'numeric',
    minute: 'numeric',
  })
  const [currentHour, currentMinutes] = currentTimeStr.split(':').map(Number)
  const isPast1830 = currentHour > 18 || (currentHour === 18 && currentMinutes >= 30)
  const startDate = new Date(now.toLocaleString('en-US', { timeZone }))

  startDate.setHours(0, 0, 0, 0)

  if (!isComeToday || isPast1830) {
    startDate.setDate(startDate.getDate() + 1)
  }

  const timeList = []

  for (let i = minDay; i > 0; i--) {
    const prevDate = new Date(startDate)
    prevDate.setDate(startDate.getDate() - i)
    timeList.push({
      timestamp: Math.floor(Math.floor(prevDate.getTime() / 1000)),
      formatted: formatDateObject(prevDate),
    })
  }

  timeList.push({
    timestamp: Math.floor(Math.floor(startDate.getTime() / 1000)),
    formatted: formatDateObject(startDate),
  })

  for (let i = 1; i <= maxDay; i++) {
    const nextDate = new Date(startDate)
    nextDate.setDate(startDate.getDate() + i)
    timeList.push({
      timestamp: Math.floor(Math.floor(nextDate.getTime() / 1000)),
      formatted: formatDateObject(nextDate),
    })
  }

  return timeList
}

/**
 * Convert Japanese date format (MM/DD (day)) to Unix timestamp
 */
export function parseJapaneseDate(dateString: string): number {
  // Extract MM/DD from the string
  const match = RegExp(/(\d{2})\/(\d{2})/).exec(dateString)
  if (!match) return 0

  const month = parseInt(match[1], 10) - 1
  const day = parseInt(match[2], 10)

  const date = new Date()
  date.setMonth(month)
  date.setDate(day)
  date.setHours(0, 0, 0, 0)

  return Math.floor(date.getTime() / 1000)
}

/**
 * Get a list of available dates for bringing items to the store
 * @param reservationRescheduleSent - The date when the reservation was sent
 * @param reservationRescheduleExpired - The expiration date of the reservation
 * @returns An array of objects containing the available dates in Unix timestamp format
 */
export function listDateBringTokyo(
  reservationRescheduleSent: string,
  reservationRescheduleExpired: string
) {
  const result = []

  // The data received from API is in GMT, so "subtract(9, 'hours')" converts it to Asia/Tokyo
  const baseDate = moment
    .tz(reservationRescheduleSent, 'GMT')
    .subtract(9, 'hours')
    .tz(TIMEZONE)
    .startOf('day')

  // The data received from API is in GMT, so "subtract(9, 'hours')" converts it to Asia/Tokyo
  const expiredDate = moment
    .tz(reservationRescheduleExpired, 'GMT')
    .subtract(9, 'hours')
    .tz(TIMEZONE)
    .startOf('day')

  const now = moment().tz(TIMEZONE)
  const today = now.clone().startOf('day')
  const isAfterCutoff = now.hour() > 18 || (now.hour() === 18 && now.minute() >= 30)

  const totalDays = expiredDate.diff(baseDate, 'days') + 1

  for (let i = 0; i <= totalDays; i++) {
    const targetDate = baseDate.clone().add(i, 'days')

    if (targetDate.isAfter(today) || (targetDate.isSame(today) && !isAfterCutoff)) {
      result.push({ date: targetDate.unix() })
    }
  }

  return result
}

/**
 * Get details of a center based on the business domain
 * @param business_domain - The business domain to search for
 * @param centers - Array of center objects to search
 * @param infoKey - The key to retrieve from the matched center
 * @returns The value of the infoKey from the matched center or null
 */
export function getCenterDetail<K extends keyof CenterList>(
  business_domain: string,
  centers: CenterList[],
  infoKey: K
): CenterList[K] | null {
  const center = centers.reduce(
    (map, center) => {
      map[center.business_domain] = center
      return map
    },
    {} as Record<string, CenterList>
  )[business_domain][infoKey]

  return center
}

// Formats a Date object to Japanese date format (e.g., '11月25日 (火)')
export function stringToJPDate(s: string): string {
  if (!s) return ''
  const isoStr = s.replace(' ', 'T')
  const date = new Date(isoStr)
  const formattedDate = `${date.getMonth() + 1}/${date.getDate()}`
  const weekday = weekJPNames[date.getDay() === 0 ? 6 : date.getDay() - 1]
  return `${formattedDate} (${weekday})`
}
