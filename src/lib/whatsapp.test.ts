import { describe, it, expect } from 'vitest'
import { buildWhatsAppBookingUrl, calcReturn, buildGeneralEnquiryUrl, type BookingDetails } from './whatsapp'
const ok: BookingDetails = { name: 'Aman', packageId: 'B', date: '2026-10-20', startTime: '10:00' }
const parse = (u: string) => { const x = new URL(u); return { x, text: x.searchParams.get('text')! } }
describe('buildWhatsAppBookingUrl', () => {
  it('uses wa.me and the right number', () => {
    const { x } = parse(buildWhatsAppBookingUrl(ok))
    expect(x.hostname).toBe('wa.me'); expect(x.pathname).toBe('/918595610547')
    expect([...x.searchParams.keys()]).toEqual(['text'])
  })
  it('encodes message with line breaks and package/price', () => {
    const u = buildWhatsAppBookingUrl(ok); const { text } = parse(u)
    expect(u).toContain('%0A'); expect(u).not.toContain(' ')
    expect(text).toContain('Package: Half-Day Plan (6 hours)'); expect(text).toContain('Rental price: ₹399')
    expect(text).toContain('Expected return: 20 Oct 2026, 4:00 PM')
    expect(text).not.toContain('Additional message')
  })
  it('preserves special characters', () => {
    const { text } = parse(buildWhatsAppBookingUrl({ ...ok, name: "Ravi & O'Neil #1", message: 'a=b&c=d? 100% ✨\nline2' }))
    expect(text).toContain("Name: Ravi & O'Neil #1"); expect(text).toContain('Additional message: a=b&c=d? 100% ✨\nline2')
  })
  it('prices each package', () => {
    expect(parse(buildWhatsAppBookingUrl({ ...ok, packageId: 'A' })).text).toContain('₹199')
    expect(parse(buildWhatsAppBookingUrl({ ...ok, packageId: 'C' })).text).toContain('₹599')
  })
  it('handles midnight rollover', () => {
    expect(calcReturn('2026-12-31', '22:30', 240)).toEqual({ date: '1 Jan 2027', time: '2:30 AM', nextDay: true })
    expect(parse(buildWhatsAppBookingUrl({ ...ok, packageId: 'C', startTime: '20:00' })).text).toContain('21 Oct 2026, 8:00 AM')
  })
  it('handles multi-day enquiries without a fixed price', () => {
    const { text } = parse(buildWhatsAppBookingUrl({ ...ok, packageId: 'MULTI', days: 3 }))
    expect(text).toContain('Multi-day rental (3 days)'); expect(text).toContain('15% off'); expect(text).toContain('23 Oct 2026, 10:00 AM')
  })
  it('rejects invalid input', () => {
    expect(() => buildWhatsAppBookingUrl({ ...ok, name: '' })).toThrow()
    expect(() => buildWhatsAppBookingUrl({ ...ok, date: '' })).toThrow()
    expect(() => buildWhatsAppBookingUrl({ ...ok, startTime: '25:00' })).toThrow()
    expect(() => buildWhatsAppBookingUrl({ ...ok, packageId: 'MULTI', days: 1 })).toThrow()
    expect(() => buildWhatsAppBookingUrl({ ...ok, packageId: 'Z' })).toThrow()
  })
  it('has a single phone number and general URL works', () => {
    const u = buildWhatsAppBookingUrl(ok); expect(u.split('918595610547').length).toBe(2)
    expect(new URL(buildGeneralEnquiryUrl()).pathname).toBe('/918595610547')
  })
})
