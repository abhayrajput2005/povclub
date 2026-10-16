export interface RentalPackage { id: string; hours: number; price: number; label: string; desc: string }
export const CONFIG = {
  brand: 'POVClub',
  tagline: 'Experience More. Own Less.',
  whatsappNumber: '918595610547', // digits only: no "+", no spaces
  displayPhone: '+91 8595610547',
  product: 'Ray-Ban Meta smart glasses Gen 1',
  serviceArea: 'LPU / Phagwara, Punjab',
  multiDayDiscountPercent: 15,
  packages: [
    { id: 'A', hours: 2, price: 199, label: 'Quick Experience', desc: 'A short window for a date, a walk or a quick Reel.' },
    { id: 'B', hours: 6, price: 399, label: 'Half-Day Plan', desc: 'Enough time for an event, a campus day or a trip.' },
    { id: 'C', hours: 12, price: 599, label: 'Extended Experience', desc: 'A full day of moments, from morning to night.' },
  ] as RentalPackage[],
}
export const MULTI_DAY_ID = 'MULTI'
