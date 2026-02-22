# Learn Vault

Education marketplace platform built with Next.js 14, TypeScript, Prisma, and Tailwind CSS.

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment**
   - Copy `.env.example` to `.env`
   - Set `DATABASE_URL` (default: `file:./dev.db` for SQLite)
   - Set `NEXTAUTH_SECRET` (e.g. `openssl rand -base64 32`)
   - Set `NEXTAUTH_URL` (e.g. `http://localhost:3000`)

3. **Initialize database**
   ```bash
   npx prisma db push
   npx prisma db seed
   ```

4. **Run dev server**
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000).

### Test accounts (after seed)
- **Student**: `student@test.com` / `password123`
- **Tutor**: `tutor@test.com` / `password123`

## Features

- **Auth**: NextAuth (credentials), sign up with 10 LV bonus
- **Notes**: Upload, browse, purchase with LV validation
- **Wallet**: 2 LV = ₱1, 20% commission on cashout
- **Daily tasks**: Complete tasks for LV rewards
- **Tutors**: Book sessions (LV deducted from wallet)
- **Study tools**: Flashcards, Pomodoro (records completion)

## API Routes

| Route | Method | Auth | Description |
|-------|--------|------|-------------|
| `/api/auth/signup` | POST | No | Register |
| `/api/auth/[...nextauth]` | GET/POST | - | NextAuth |
| `/api/wallet` | GET | Yes | Balance |
| `/api/wallet/transactions` | GET | Yes | History |
| `/api/wallet/purchase-points` | POST | Yes | Buy LV |
| `/api/wallet/cashout` | POST | Yes | Withdraw (20% fee) |
| `/api/notes` | GET/POST | POST=Yes | List / Create |
| `/api/notes/[id]/purchase` | POST | Yes | Buy note |
| `/api/dashboard` | GET | Yes | Stats |
| `/api/daily-tasks` | GET | Yes | List tasks |
| `/api/daily-tasks/complete` | POST | Yes | Complete task |
| `/api/tutors` | GET | No | List tutors |
| `/api/tutors/book` | POST | Yes | Book session |
| `/api/flashcards` | GET/POST | Yes | List / Create |
| `/api/pomodoro/complete` | POST | Yes | Record session |

## Design Notes

- **Fonts**: Press Start 2P (display), system serif/sans
- **Colors**: `lv-dark-green`, `lv-pastel-green`, `lv-accent-yellow`, `lv-purple`
