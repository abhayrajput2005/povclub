import { useState, useMemo, type ReactNode } from 'react'
import { motion, MotionConfig, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Menu, X, MessageCircle, Clock, PartyPopper, Heart, Clapperboard, Check, ShieldCheck, CalendarClock, Smartphone, Glasses } from 'lucide-react'
import { CONFIG, MULTI_DAY_ID } from './config'
import { buildWhatsAppBookingUrl, buildGeneralEnquiryUrl, validateBooking, getSummary, calcReturn, type BookingDetails } from './lib/whatsapp'

const Logo = () => <a href="#top" className="text-xl font-extrabold tracking-tight">POV<span className="grad">Club</span></a>
const reveal = { initial: { opacity: 0, y: 28 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: '-60px' }, transition: { duration: .6 } }
const btn = 'inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-semibold min-h-12 transition hover:-translate-y-0.5 active:translate-y-0'
const primary = `${btn} bg-gradient-to-r from-blue to-cyan text-bg shadow-[0_0_30px_-6px_#1677FF]`
const ghost = `${btn} border border-white/15 hover:border-cyan/60 hover:bg-white/5`
const Section = ({ id, title, sub, children }: { id: string; title: string; sub?: string; children: ReactNode }) => (
  <section id={id} className="mx-auto max-w-6xl px-5 py-20 md:py-28">
    <motion.div {...reveal} className="mb-10 max-w-2xl"><h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">{title}</h2>{sub && <p className="mt-3 text-muted">{sub}</p>}</motion.div>{children}
  </section>)

function Navbar() {
  const [open, setOpen] = useState(false)
  const links = [['Explore', '#explore'], ['Pricing', '#pricing'], ['How It Works', '#how'], ['FAQ', '#faq']]
  return (<header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-bg/80 backdrop-blur">
    <nav aria-label="Main" className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5"><Logo />
      <ul className="hidden md:flex gap-8 text-sm text-muted">{links.map(([l, h]) => <li key={h}><a className="hover:text-fg transition" href={h}>{l}</a></li>)}</ul>
      <a href={buildGeneralEnquiryUrl()} className={`${primary} hidden md:inline-flex !py-2 !min-h-10`}>Book Now</a>
      <button className="md:hidden p-2" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button></nav>
    {open && <motion.ul initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="md:hidden flex flex-col gap-1 border-t border-white/10 bg-bg2 p-4">
      {links.map(([l, h]) => <li key={h}><a onClick={() => setOpen(false)} className="block rounded-lg px-3 py-3 text-lg" href={h}>{l}</a></li>)}
      <li><a href={buildGeneralEnquiryUrl()} className={`${primary} w-full mt-2`}>Book Now</a></li></motion.ul>}
  </header>)
}

function Product() {
  const [err, setErr] = useState(false)
  return err || true ? (err ? <Placeholder /> : <img src="/product.png" alt="Ray-Ban Meta smart glasses" className="w-full drop-shadow-[0_20px_40px_rgba(22,119,255,.45)]" onError={() => setErr(true)} />) : null
}
const Placeholder = () => (<svg viewBox="0 0 400 160" role="img" aria-label="Smart glasses illustration (replace with product photo)" className="w-full drop-shadow-[0_20px_40px_rgba(22,119,255,.5)]">
  <defs><linearGradient id="g" x1="0" x2="1"><stop offset="0" stopColor="#1677FF" /><stop offset="1" stopColor="#35E5FF" /></linearGradient></defs>
  <path d="M10 50 L50 40 H350 L390 50" stroke="url(#g)" strokeWidth="8" fill="none" strokeLinecap="round" />
  <rect x="45" y="45" width="130" height="80" rx="30" fill="#0B1019" stroke="url(#g)" strokeWidth="8" /><rect x="225" y="45" width="130" height="80" rx="30" fill="#0B1019" stroke="url(#g)" strokeWidth="8" />
  <path d="M175 70 Q200 55 225 70" stroke="url(#g)" strokeWidth="8" fill="none" /><circle cx="52" cy="52" r="5" fill="#35E5FF" /></svg>)

function Hero() {
  const mx = useMotionValue(0), my = useMotionValue(0)
  const rx = useSpring(useTransform(my, [-.5, .5], [8, -8]), { stiffness: 80, damping: 15 }), ry = useSpring(useTransform(mx, [-.5, .5], [-10, 10]), { stiffness: 80, damping: 15 })
  const onMove = (e: React.MouseEvent<HTMLDivElement>) => { const r = e.currentTarget.getBoundingClientRect(); mx.set((e.clientX - r.left) / r.width - .5); my.set((e.clientY - r.top) / r.height - .5) }
  const words = ['YOUR WORLD.', 'YOUR POV.']
  return (<section id="top" className="relative overflow-hidden pt-28 pb-16 md:pt-36">
    <div className="grid-bg absolute inset-0" aria-hidden />
    <div className="absolute -top-20 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-blue/25 blur-[120px]" aria-hidden />
    {Array.from({ length: 14 }).map((_, i) => <span key={i} className="dot" aria-hidden style={{ left: `${(i * 37) % 100}%`, top: `${40 + (i * 13) % 55}%`, animationDelay: `${i * .7}s` }} />)}
    <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-5 md:grid-cols-2">
      <div>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4 text-xs font-semibold tracking-[.2em] text-cyan">NOW RENTING · LPU / PHAGWARA</motion.p>
        <h1 className="text-5xl font-black leading-[.95] tracking-tight md:text-7xl">{words.map((w, i) => <motion.span key={w} className={`block ${i ? 'grad' : ''}`} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .15 + i * .15, duration: .7 }}>{w}</motion.span>)}</h1>
        <p className="mt-5 text-xl font-semibold">{CONFIG.tagline}</p>
        <p className="mt-3 max-w-md text-muted">Rent smart glasses for your next adventure, unforgettable moments, and content worth sharing.</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row"><a href="#pricing" className={primary}>Explore Rental Plans</a><a href={buildGeneralEnquiryUrl()} className={ghost}><MessageCircle size={18} />Book on WhatsApp</a></div>
      </div>
      <div onMouseMove={onMove} onMouseLeave={() => { mx.set(0); my.set(0) }} className="relative mx-auto w-full max-w-md [perspective:900px]">
        <div className="absolute inset-4 rounded-full border border-cyan/20" aria-hidden /><div className="absolute -inset-4 rounded-full border border-blue/20" aria-hidden />
        <motion.div initial={{ opacity: 0, scale: .85 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: .9, delay: .3 }} style={{ rotateX: rx, rotateY: ry }} className="py-16">
          <motion.div animate={{ y: [0, -12, 0] }} transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}><Product /></motion.div></motion.div>
      </div></div></section>)
}

const features = [[Clock, 'Flexible durations', '2, 6 or 12 hours, or multi-day on request.'], [Smartphone, 'Hands-free POV', 'Smart glasses for capturing moments from your point of view.'], [ShieldCheck, 'Confirmation first', 'POVClub confirms availability before anything is final.']] as const
function Showcase() {
  return (<Section id="explore" title="Ray-Ban Meta Smart Glasses, Gen 1" sub="Our first rental gadget. One unit available, so enquire early.">
    <div className="grid items-center gap-8 md:grid-cols-2">
      <motion.div {...reveal} className="rounded-3xl border border-white/10 bg-gradient-to-b from-bg2 to-bg p-8 [perspective:800px]"><motion.div whileHover={{ rotateY: -8, rotateX: 4 }} transition={{ type: 'spring', stiffness: 80 }}><Product /></motion.div></motion.div>
      <div className="grid gap-4">{features.map(([I, t, d]) => <motion.div key={t} {...reveal} className="flex gap-4 rounded-2xl border border-white/10 bg-bg2 p-5"><I className="shrink-0 text-cyan" /><div><h3 className="font-bold">{t}</h3><p className="text-sm text-muted">{d}</p></div></motion.div>)}
        <a href="#book" className={primary}>Rent these glasses</a>
        <p className="text-xs text-muted">POVClub is an independent rental service and is not affiliated with or endorsed by Ray-Ban or Meta.</p></div></div></Section>)
}

function Pricing({ sel, setSel }: { sel: string; setSel: (s: string) => void }) {
  return (<Section id="pricing" title="Simple rental plans" sub="Pick a plan, then send your enquiry on WhatsApp.">
    <div className="grid gap-5 md:grid-cols-3">{CONFIG.packages.map((p, i) => { const on = sel === p.id; return (
      <motion.button key={p.id} type="button" aria-pressed={on} onClick={() => { setSel(p.id); document.getElementById('book')?.scrollIntoView({ behavior: 'smooth' }) }}
        initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * .12 }} whileHover={{ y: -6 }} animate={{ scale: on ? 1.03 : 1 }}
        className={`rounded-3xl border p-6 text-left transition-colors ${on ? 'border-cyan bg-blue/10 shadow-[0_0_40px_-10px_#35E5FF]' : 'border-white/10 bg-bg2 hover:border-blue/60'}`}>
        <p className="text-sm font-semibold text-cyan">{p.label}</p><p className="mt-3 text-4xl font-black">₹{p.price}</p><p className="text-muted">{p.hours} hours</p><p className="mt-3 text-sm text-muted">{p.desc}</p>
        <span className={`${on ? primary : ghost} mt-5 w-full`}>{on ? <><Check size={18} />Selected</> : 'Select Package'}</span></motion.button>) })}</div>
    <p className="mt-6 text-sm text-muted">Multi-day: {CONFIG.multiDayDiscountPercent}% off eligible rental charges for rentals longer than 24 hours. <button className="text-cyan underline" onClick={() => { setSel(MULTI_DAY_ID); document.getElementById('book')?.scrollIntoView({ behavior: 'smooth' }) }}>Enquire for multi-day</button></p></Section>)
}

function Booking({ sel, setSel }: { sel: string; setSel: (s: string) => void }) {
  const [f, setF] = useState({ name: '', date: '', startTime: '', days: 2, message: '' })
  const [errs, setErrs] = useState<Record<string, string>>({})
  const d: BookingDetails = { ...f, packageId: sel, days: f.days }
  const sum = getSummary(d); const today = new Date().toISOString().slice(0, 10)
  const ret = useMemo(() => sum && f.date && f.startTime ? calcReturn(f.date, f.startTime, sum.minutes) : null, [sum, f.date, f.startTime])
  const submit = (e: React.FormEvent) => { e.preventDefault(); const er = validateBooking(d); setErrs(er); if (Object.keys(er).length) return; window.location.href = buildWhatsAppBookingUrl(d) }
  const inp = 'w-full rounded-xl border border-white/15 bg-bg px-4 py-3 min-h-12 focus:border-cyan'
  const Err = ({ k }: { k: string }) => errs[k] ? <p id={`${k}-e`} role="alert" className="mt-1 text-sm text-red-400">{errs[k]}</p> : null
  const field = (k: keyof typeof f) => ({ id: k, 'aria-invalid': !!errs[k], 'aria-describedby': errs[k] ? `${k}-e` : undefined })
  return (<Section id="book" title="Send your enquiry" sub="Details go into a prefilled WhatsApp message. Nothing is stored by this site.">
    <motion.form {...reveal} onSubmit={submit} noValidate className="grid gap-6 rounded-3xl border border-white/10 bg-bg2 p-6 md:grid-cols-2 md:p-8">
      <div className="grid gap-4">
        <div><label htmlFor="name" className="mb-1 block text-sm">Your name</label><input {...field('name')} className={inp} autoComplete="name" value={f.name} onChange={e => setF({ ...f, name: e.target.value })} /><Err k="name" /></div>
        <div><label htmlFor="pkg" className="mb-1 block text-sm">Rental package</label><select id="pkg" className={inp} value={sel} onChange={e => setSel(e.target.value)}>{CONFIG.packages.map(p => <option key={p.id} value={p.id}>{p.label} · {p.hours}h · ₹{p.price}</option>)}<option value={MULTI_DAY_ID}>Multi-day (price confirmed on WhatsApp)</option></select></div>
        {sel === MULTI_DAY_ID && <div><label htmlFor="days" className="mb-1 block text-sm">Number of days</label><input {...field('days')} type="number" min={2} max={30} className={inp} value={f.days} onChange={e => setF({ ...f, days: Number(e.target.value) })} /><Err k="days" /></div>}
        <div className="grid grid-cols-2 gap-3"><div><label htmlFor="date" className="mb-1 block text-sm">Preferred date</label><input {...field('date')} type="date" min={today} className={inp} value={f.date} onChange={e => setF({ ...f, date: e.target.value })} /><Err k="date" /></div>
          <div><label htmlFor="startTime" className="mb-1 block text-sm">Start time</label><input {...field('startTime')} type="time" className={inp} value={f.startTime} onChange={e => setF({ ...f, startTime: e.target.value })} /><Err k="startTime" /></div></div>
        <div><label htmlFor="message" className="mb-1 block text-sm">Message (optional)</label><textarea {...field('message')} rows={3} maxLength={300} className={inp} value={f.message} onChange={e => setF({ ...f, message: e.target.value })} /><Err k="message" /></div>
      </div>
      <div className="flex flex-col justify-between gap-6 rounded-2xl border border-cyan/20 bg-bg p-6">
        <dl className="grid gap-3 text-sm" aria-live="polite"><h3 className="text-lg font-bold">Booking summary</h3>
          <div><dt className="text-muted">Package</dt><dd>{sum ? sum.packageLabel : '—'}</dd></div>
          <div><dt className="text-muted">Rental price</dt><dd className="text-2xl font-black grad">{sum ? sum.priceLabel : '—'}</dd></div>
          <div><dt className="text-muted">Expected return (IST)</dt><dd>{ret ? `${ret.date}, ${ret.time}${ret.nextDay ? ' (next day)' : ''}` : 'Pick a date and time'}</dd></div></dl>
        <div><button type="submit" className={`${primary} w-full`}><MessageCircle size={18} />Send enquiry on WhatsApp</button>
          <p className="mt-3 text-xs text-muted">Your enquiry is not a confirmed booking. POVClub will check availability and confirm the details on WhatsApp.</p></div></div>
    </motion.form></Section>)
}

const steps = [['Choose Your Plan', 'Pick 2, 6 or 12 hours, or ask for multi-day.'], ['Send Your Enquiry', 'Your details open in WhatsApp, prefilled.'], ['Get Confirmation', 'POVClub confirms only after checking availability.'], ['Enjoy Your POV', 'Collect the glasses and go make moments.']]
const uses = [[PartyPopper, 'Birthdays & Celebrations', 'Capture the surprise from your own point of view.'], [Heart, 'Dates & Trips', 'Stay in the moment and keep the memories hands-free.'], [Clapperboard, 'Reels & Creator Moments', 'Fresh first-person footage for your content.']] as const
const why = [[CalendarClock, 'Flexible rental durations'], [MessageCircle, 'Simple WhatsApp-first enquiries'], [ShieldCheck, 'Confirmation before payment'], [Glasses, 'Experience gadgets without purchasing them']] as const
const faqs = [['How do I book?', 'Choose a plan, fill in the form and send your enquiry on WhatsApp.'], ['Is my booking automatically confirmed?', 'No. POVClub checks availability and confirms details on WhatsApp.'], ['What are the rental prices?', `${CONFIG.packages.map(p => `${p.hours} hours ₹${p.price}`).join(', ')}. ${CONFIG.multiDayDiscountPercent}% off eligible rental charges for rentals longer than 24 hours.`], ['Is a deposit required?', 'Deposit details are not finalised. POVClub will confirm before booking.'], ['Can I book on the same day?', 'Possibly, subject to availability. Ask on WhatsApp.'], ['Where do I collect and return the device?', `Service area: ${CONFIG.serviceArea}. Exact handover details are confirmed before booking.`], ['Can I rent for multiple days?', 'Yes, send a multi-day enquiry. The final price is confirmed on WhatsApp.'], ['What are the privacy rules for recording?', 'Always get consent before recording others and respect private spaces and local rules. Detailed rules will be confirmed before booking.']]

export default function App() {
  const [sel, setSel] = useState('B')
  return (<MotionConfig reducedMotion="user"><Navbar /><main>
    <Hero /><Showcase /><Pricing sel={sel} setSel={setSel} /><Booking sel={sel} setSel={setSel} />
    <Section id="how" title="How it works" sub="Confirmation happens only after POVClub checks availability."><ol className="grid gap-4 md:grid-cols-4">{steps.map(([t, d], i) => <motion.li key={t} {...reveal} transition={{ delay: i * .1 }} className="rounded-2xl border border-white/10 bg-bg2 p-5"><span className="text-cyan font-black">0{i + 1}</span><h3 className="mt-2 font-bold">{t}</h3><p className="text-sm text-muted">{d}</p></motion.li>)}</ol></Section>
    <Section id="uses" title="Made for moments"><div className="grid gap-4 md:grid-cols-3">{uses.map(([I, t, d]) => <motion.div key={t} {...reveal} whileHover={{ y: -6 }} className="rounded-2xl border border-white/10 bg-gradient-to-b from-bg2 to-bg p-6"><I className="text-cyan" /><h3 className="mt-4 font-bold">{t}</h3><p className="text-sm text-muted">{d}</p></motion.div>)}</div></Section>
    <Section id="why" title="Why POVClub?"><div className="grid gap-4 sm:grid-cols-2">{why.map(([I, t]) => <motion.div key={t} {...reveal} className="flex items-center gap-4 rounded-2xl border border-white/10 bg-bg2 p-5"><I className="text-cyan" />{t}</motion.div>)}</div></Section>
    <Section id="faq" title="FAQ"><div className="grid gap-3">{faqs.map(([q, a]) => <details key={q} className="group rounded-2xl border border-white/10 bg-bg2 px-5 py-4"><summary className="cursor-pointer font-semibold">{q}</summary><p className="mt-2 text-muted">{a}</p></details>)}</div></Section></main>
    <footer className="border-t border-white/10 bg-bg2"><div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 md:grid-cols-3"><div><Logo /><p className="mt-2 text-muted">{CONFIG.tagline}</p><a href={buildGeneralEnquiryUrl()} className="mt-3 inline-block text-cyan">WhatsApp {CONFIG.displayPhone}</a></div>
      <nav aria-label="Footer" className="grid gap-2 text-muted"><a href="#pricing">Pricing</a><a href="#how">How It Works</a><a href="#faq">FAQ</a></nav>
      <div className="grid gap-2 text-sm text-muted"><p>Rental terms, cancellation policy and privacy information: to be confirmed by POVClub before booking.</p><p>Record responsibly: get consent and respect private spaces.</p></div></div>
      <p className="border-t border-white/10 py-4 text-center text-xs text-muted">© POVClub. Not affiliated with Ray-Ban or Meta.</p></footer></MotionConfig>)
}
