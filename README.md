# POVClub
Gadget rental site (React + Vite + TypeScript + Tailwind v4 + Framer Motion). Enquiries go to WhatsApp via `wa.me`; there is no backend or database.

    npm install
    npm run dev      # http://localhost:5173
    npm test         # unit tests for URL generation / return-time maths
    npm run build    # type-check + production build

- Business values (number, prices, product): `src/config.ts` only.
- URL generator: `src/lib/whatsapp.ts` (`buildWhatsAppBookingUrl`).
- Product image: drop your authorized photo at `public/product.png`; otherwise a placeholder illustration is shown.
- Logo: currently a text logo in `src/App.tsx` (`Logo`).

## Manual WhatsApp test
Desktop: fill the form, click "Send enquiry on WhatsApp" -> WhatsApp Web/Desktop opens with the message prefilled to +91 8595610547. Check name, package, price, date, return time. Mobile: same on Android/iOS; the WhatsApp app should open with the draft. Nothing is sent until you press send.

## Not implemented
Real 3D model, backend/admin/availability/payments, FAQ height animation, final terms/deposit/cancellation (marked "to be confirmed").
