# MANNA ICE — website

Static marketing + ordering site for MANNA ICE (block ice supplier, Orozo, Abuja).
Built with React + TypeScript + Tailwind CSS, bundled by Vite.

Orders are taken in the browser and sent to the business over WhatsApp — there is
no server and no database.

## Running it locally

```bash
npm install     # first time only
npm run dev     # http://localhost:5173
```

## Building for production

```bash
npm run build   # type-checks, then writes the site to dist/
npm run preview # serves the built site locally
```

Everything in `dist/` is plain static files — any static host will serve them.

## Editing the business details

All of it lives in [`src/config.ts`](src/config.ts):

| Setting | What it does |
| --- | --- |
| `whatsapp` | Number that receives orders. International format, digits only. |
| `phoneDisplay`, `email`, `address`, `hours` | Shown in the contact section and footer. |
| `currency`, `pricePerBlock` | Price of one ice block; every product is priced from this. |
| `deliveryFee`, `freeDeliveryOver` | Delivery charge and the free-delivery threshold. |
| `VIDEOS` | Optional background videos for the two showcase sections. Empty = show the photo. |

Products live in [`src/data/products.ts`](src/data/products.ts); photos are in `public/`.

## How ordering works

1. The customer fills the cart and the checkout form (name, phone, address, date,
   time slot, payment method).
2. The order is given an ID (`MI-XXXXXX`) and saved in that customer's own browser
   (`localStorage`) — it is **not** sent anywhere automatically.
3. They tap **Confirm on WhatsApp** (or the email link) to send the full order to
   the business. Nothing reaches you until they do.

## Deploying to Render (free tier)

The repo includes `render.yaml`, so this is close to one-click:

1. Push the repo to GitHub.
2. On [render.com](https://render.com): **New +** → **Blueprint** → connect this
   repo. Render reads `render.yaml` and creates a static site that runs
   `npm install && npm run build` and publishes `dist/`.
3. Render gives you a free `https://manna-ice.onrender.com`-style URL, and
   redeploys on every push to `main`.

Static sites on Render's free tier do not sleep, unlike free web services.

## Deploying elsewhere

Any static host works — Netlify, Vercel, Cloudflare Pages, GitHub Pages or plain
shared hosting. Build command `npm run build`, publish directory `dist`.
