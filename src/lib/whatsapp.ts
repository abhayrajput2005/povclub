import { CONFIG, MULTI_DAY_ID } from '../config'

export interface BookingDetails {
  name: string; packageId: string; date: string; startTime: string
  days?: number; message?: string; product?: string
}
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

export function validateBooking(d: BookingDetails): Record<string, string> {
  const e: Record<string, string> = {}
  const name = d.name?.trim() ?? ''
  if (name.length < 2 || name.length > 60) e.name = 'Enter your name (2–60 characters).'
  const isMulti = d.packageId === MULTI_DAY_ID
  if (!isMulti && !CONFIG.packages.some(p => p.id === d.packageId)) e.packageId = 'Choose a rental package.'
  if (!/^\d{4}-\d{2}-\d{2}$/.test(d.date ?? '') || isNaN(Date.parse(d.date + 'T00:00:00Z'))) e.date = 'Choose a valid date.'
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(d.startTime ?? '')) e.startTime = 'Choose a valid start time.'
  if (isMulti && !(Number.isInteger(d.days) && d.days! >= 2 && d.days! <= 30)) e.days = 'Enter 2–30 days.'
  if ((d.message ?? '').length > 300) e.message = 'Keep your message under 300 characters.'
  return e
}

/** Wall-clock arithmetic in IST (Asia/Kolkata, UTC+5:30, no DST) — independent of the browser's timezone. */
export function calcReturn(date: string, time: string, minutes: number) {
  const [y, m, day] = date.split('-').map(Number); const [h, mi] = time.split(':').map(Number)
  const t = new Date(Date.UTC(y, m - 1, day, h, mi) + minutes * 60000)
  const hh = t.getUTCHours(), mm = String(t.getUTCMinutes()).padStart(2, '0')
  return {
    date: `${t.getUTCDate()} ${MONTHS[t.getUTCMonth()]} ${t.getUTCFullYear()}`,
    time: `${hh % 12 || 12}:${mm} ${hh < 12 ? 'AM' : 'PM'}`,
    nextDay: t.getUTCDate() !== day,
  }
}
export const formatDate = (d: string) => { const [y, m, day] = d.split('-').map(Number); return `${day} ${MONTHS[m - 1]} ${y}` }
export const formatTime = (t: string) => { const [h, m] = t.split(':').map(Number); return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}` }

export function getSummary(d: BookingDetails) {
  if (d.packageId === MULTI_DAY_ID) {
    const days = d.days ?? 0
    return { packageLabel: `Multi-day rental (${days} days)`, priceLabel: `To be confirmed on WhatsApp (${CONFIG.multiDayDiscountPercent}% off eligible rental charges for rentals longer than 24 hours)`, minutes: days * 1440 }
  }
  const p = CONFIG.packages.find(x => x.id === d.packageId)
  if (!p) return null
  return { packageLabel: `${p.label} (${p.hours} hours)`, priceLabel: `₹${p.price}`, minutes: p.hours * 60 }
}

const base = (text: string) => `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(text)}`

export function buildWhatsAppBookingUrl(d: BookingDetails): string {
  const errors = validateBooking(d)
  if (Object.keys(errors).length) throw Object.assign(new Error('Invalid booking details'), { errors })
  const s = getSummary(d)!
  const r = calcReturn(d.date, d.startTime, s.minutes)
  const lines = [
    `Hi ${CONFIG.brand}! I would like to enquire about renting ${d.product ?? CONFIG.product}.`, '',
    `Name: ${d.name.trim()}`, `Package: ${s.packageLabel}`, `Rental price: ${s.priceLabel}`,
    `Preferred date: ${formatDate(d.date)}`, `Start time: ${formatTime(d.startTime)}`,
    `Expected return: ${r.date}, ${r.time}`,
  ]
  const extra = d.message?.trim()
  if (extra) lines.push(`Additional message: ${extra}`)
  lines.push('', 'Please confirm availability and the final booking details.')
  return base(lines.join('\n'))
}

/** For CTAs that don't carry form data (navbar, hero, footer). */
export const buildGeneralEnquiryUrl = () =>
  base(`Hi ${CONFIG.brand}! I would like to enquire about renting ${CONFIG.product}. Please share availability.`)
