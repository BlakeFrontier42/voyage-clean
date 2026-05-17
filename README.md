# Voyage — Career Command Center

> **The operating system for an ambitious job hunt.**
> A sci-fi-themed React Native + Expo app for tracking applications, contacts, follow-ups, and momentum — built so the job hunt feels like running a mission, not a spreadsheet.

**Built by [Blake Holley](https://www.linkedin.com/in/blake-holley-0b4753235)** — IT & Automation Engineer / Python Developer
📧 blake.frontierlabs@gmail.com  ·  🐙 [github.com/BlakeFrontier42](https://github.com/BlakeFrontier42)

---

## Why this exists

I'm doing a real job hunt right now — targeting NOC, IT Support, Junior Systems Administrator, and Automation Engineer roles. Spreadsheets are fine. Sticky notes are worse. The actual problem is **operational continuity** — knowing every morning exactly which follow-ups are due, which interviews need prep, which contacts you owe a reply, and whether you're trending toward or away from your goal.

Voyage is the tool I needed. So I built it.

---

## What works today

- **Mission tracking with persistence** — every application is a "mission" with company, role, salary range, location, status, URL, notes. Stored locally in AsyncStorage; survives app restart.
- **Status pipeline** — `saved → applied → interviewing → offer → accepted` (or `rejected`). Tap any stage on the mission detail to advance.
- **Mission Control dashboard** — active missions count, response rate, streak, career energy, trajectory sparkline. Pull-to-refresh.
- **Empty-state onboarding** — first launch shows a clean "log your first mission" CTA, not fake demo data.
- **Mission Detail screen** — inline editable notes, interview prep accordion (behavioral / technical / culture), follow-up scheduler templates, status pipeline, delete with confirmation.
- **Contacts** (network) — relationship engine with tags, last interaction, message templates. *(Currently demo data — persistence layer migration pending.)*
- **Coaching** — morning brief, habit tracker, weekly retro. *(Demo data, persistence migration pending.)*
- **Trajectory** — career graph, archetypes, risk-tolerance slider. *(Demo data, persistence migration pending.)*
- **Profile** — Blake's real defaults seeded; editable; theme customization scaffolded.

---

## Roadmap

| Phase | Scope |
|---|---|
| **A — Foundation** *(done)* | Mission CRUD with AsyncStorage persistence; Blake's profile seeded |
| **B — Network & habits persistence** | Migrate contacts, habits, weekly retro to AsyncStorage |
| **C — AI follow-ups** | Generate context-aware follow-up messages via Anthropic API |
| **D — Email sync** | Gmail OAuth → auto-import applications from confirmation emails |
| **E — Cloud sync** | Optional Supabase sync for multi-device |
| **F — Web companion** | Lightweight Next.js view of the same data store |

---

## Tech Stack

| Layer | Tech |
|---|---|
| Framework | **React Native 0.76** + **Expo SDK 52** |
| Navigation | **Expo Router 4** (file-based, tab + stack) |
| Persistence | **AsyncStorage** (local-first; cloud sync optional later) |
| State | React Context + hooks (no Redux/Zustand) |
| Animations | **React Native Reanimated 3** |
| Charts | React Native SVG (custom) |
| Icons | @expo/vector-icons (Ionicons) |
| Haptics | expo-haptics |
| Auth/Cloud (optional) | Supabase scaffolded |

---

## Quick Start

```bash
cd voyage-app
npm install
npx expo start
```

Then either:
- Scan the QR code with **Expo Go** on your iPhone (fastest path; no Xcode needed)
- Press **`i`** in the terminal to open the iOS Simulator
- Press **`a`** for Android Emulator

---

## Architecture

```
voyage-app/
├── app/                          # Expo Router screens
│   ├── _layout.tsx               # Root layout — wraps MissionsProvider
│   ├── index.tsx                 # Splash
│   ├── (auth)/                   # Login + signup
│   ├── (tabs)/
│   │   ├── index.tsx             # Mission Control dashboard
│   │   ├── trajectory.tsx        # Career trajectory
│   │   ├── coaching.tsx          # Morning brief + habits
│   │   ├── contacts.tsx          # Network
│   │   └── profile.tsx           # Profile + settings
│   └── mission/
│       ├── [id].tsx              # Mission detail (persistent edit/delete)
│       └── new.tsx               # New mission (persistent save)
├── components/                   # Reusable UI (GlowCard, NeonButton, etc.)
├── lib/
│   ├── storage.ts                # AsyncStorage CRUD primitives
│   ├── MissionsContext.tsx       # Provider + useMissions() hook
│   ├── store.ts                  # Default profile + still-demo data for non-migrated screens
│   └── supabase.ts               # Cloud sync scaffold
├── constants/theme.ts            # Design tokens
├── types/index.ts                # TypeScript interfaces
└── supabase/migrations/          # Schema for future cloud sync
```

The pattern is deliberate: AsyncStorage is the source of truth for missions today, with the same shape as the Supabase schema. Migrating to cloud later is a swap of the storage layer, not a rewrite.

---

## Design Principles

- **Local-first.** No account required to use it. Cloud sync is opt-in.
- **Empty state > demo data.** First launch is honest about being empty and invites action.
- **One canonical model.** A mission in AsyncStorage has the exact same fields as a mission in the future Supabase schema.
- **Sci-fi as motivation.** "Launch mission" feels better than "Add application." Naming matters when you do something 100 times.
- **Dark, calm, tactile.** Neon cyan + deep space, with haptics on every meaningful action.

---

## For Hiring Managers

If you found this from my LinkedIn or GitHub: this is a real, in-use tool I built for myself during my own job search. It demonstrates:

- **Mobile development** — React Native + Expo, file-based routing, animations, haptics
- **Local-first architecture** — AsyncStorage + Context pattern that mirrors a future cloud schema
- **Pragmatic product design** — built the minimum that's actually useful before chasing scope (email sync, AI follow-ups, Supabase) that's planned but not shipped
- **Self-direction** — I identified the problem, designed the solution, shipped the MVP

I'm currently looking for **NOC, IT Support, Junior Systems Administrator, Technical Support Engineer, or Automation Engineer** roles. Open to **Denver / Boulder / Colorado Springs CO** or **Remote**.

- **Email**: blake.frontierlabs@gmail.com
- **LinkedIn**: <https://www.linkedin.com/in/blake-holley-0b4753235>
- **GitHub**: <https://github.com/BlakeFrontier42>
- **Other portfolio pieces**:
  - [Lumare — Capital Intelligence Platform](https://github.com/BlakeFrontier42/lumare-project)
  - [SMR Site Finder — interactive nuclear deployment map](https://github.com/BlakeFrontier42/smr-site-finder) ([live demo](https://smr-site-finder.vercel.app))

---

## License

Private — Voyage Career OS © 2026
