# Orion Mall Gorakhpur — Digital Experience Preview

A multi-page React experience built with Vite, React Router, Three.js / React Three Fiber, and Framer Motion. It includes a procedural architectural hero, an interactive multi-floor mall preview, independent store and destination pages, and responsive visitor information. Store, floor, event, offer, and mall details are local illustrative data until verified information is provided.

## Requirements

- Node.js 20.19+ (Node 22+ recommended)

## Frontend setup

```powershell
cd client
npm install
npm run dev
```

Open the Vite URL (normally `http://localhost:5173`). The frontend works with local mock data and does not require the API or MongoDB.

### Pages

- `/` — cinematic homepage and interactive preview
- `/explore` — full multi-floor 3D mall explorer
- `/stores` and `/stores/:slug` — searchable directory and store details
- `/dining`, `/events`, `/offers`, `/entertainment`, and `/visit` — dedicated discovery pages
- Unmatched URLs show a custom 404 experience

The explorer uses click-and-drag camera controls rather than pointer lock: the cursor stays available for search and page controls, and drag capture is released on pointer cancellation, tab focus loss, or route changes. Search and floor selection smoothly focus the camera on sample storefronts.

Mock content and configurable sample floor labels are in `client/src/data.js`. The scene and camera controls are in `client/src/MallScene.jsx`; the animated entrance is in `client/src/three/HeroScene.jsx`.

## Optional API and administration

The existing Express/MongoDB API and admin workspace remain available separately. To run them, install dependencies in `server`, configure `server/.env` from `.env.example`, and provide MongoDB 7+:

```powershell
cd server
npm install
```

Set `MONGODB_URI`, `JWT_SECRET` (at least 32 characters), `ADMIN_EMAIL`, and `ADMIN_PASSWORD_HASH`. Generate a password hash from the `server` directory:

```powershell
node -e "require('bcryptjs').hash('choose-a-strong-password', 12).then(console.log)"
```

Do not use the example email or commit the completed environment file. Optionally seed illustrative records with `npm run seed` from `server`.

Start the API with `npm run dev` from `server`; it listens on `http://localhost:5000`. The `/admin` page uses the API, while the public discovery pages currently use local mock data and are structured to be connected to the API later.

### Existing API

- Admin: open `/admin` and sign in with `ADMIN_EMAIL` and the password used to create `ADMIN_PASSWORD_HASH`.
- The admin workspace can list, create, update and delete store, floor, event and offer records; mall profile records can be created or updated. Enquiries are view-only.
- Public content endpoints: `GET /api/mall`, `/api/floors`, `/api/stores`, `/api/events`, and `/api/offers`. Collection endpoints accept `page`, `limit` (maximum 100), `search`, plus store `category` and `floor` filters.
- Visitor messages are validated and rate-limited at `POST /api/enquiries`.
- Protected admin routes are under `/api/admin`; login is `POST /api/admin/login`.
- Admin uploads accept JPEG, PNG, WebP images and binary GLB models (100 MB maximum); uploaded store images are appended to `images`, and GLB URLs are attached at `storefront.modelUrl`. Uploads are stored in `server/uploads`, so configure persistent storage or replace local storage with an object store before deploying multiple API instances.
- Store placement can be configured through `floor` and `coordinates: { "x": number, "y": number, "z": number }` in the admin JSON editor. Scene positions use Three.js world units; a store GLB can be tuned with `storefront.modelScale` and `storefront.modelRotation`.
- Set `CLIENT_ORIGIN` to the exact frontend origin(s) in production.

## Checks

```powershell
cd client
npm run lint
npm run build
```

Provide verified mall details, store data, event and promotion terms, and licensed GLB assets before using the experience as an official directory. The architectural scenes use generated geometry and sample listings.
