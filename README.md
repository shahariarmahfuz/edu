# BhashaRead (ভাষা-রীড) 📖🇧🇩

A mobile-first Bilingual English Reading Education Web Application with integrated Bengali translations, tap-to-reveal sentences, interactive vocabulary bottom sheets, and native speech audio pronunciation.

Built with **Next.js App Router**, **Prisma ORM**, **Neon Serverless PostgreSQL**, and **Tailwind CSS**.

---

## 📱 Mobile-First Features

- **Ergonomic Mobile Viewport:** Optimized specifically for `360px` to `430px` mobile devices with 44px+ tap targets, thumb-zone controls, and clean centered container on desktop viewports.
- **Bilingual Translation Modes:**
  - **Tap to Reveal:** English immersion mode where tapping any sentence smoothly reveals its Bengali translation.
  - **Dual Parallel Mode:** Side-by-side or stacked English and Bengali translations for instant comprehension.
  - **English Only Mode:** Distraction-free English immersion.
- **Interactive Vocabulary Bottom Sheet:** Tapping any highlighted vocabulary word opens an iOS/Android style bottom sheet modal displaying:
  - English word & Phonetic IPA pronunciation (`/ˈeɪn.ʃənt/`)
  - Audio pronunciation powered by the Web Speech API
  - Part of speech badge (`noun`, `verb`, `adjective`, `idiom`)
  - High-contrast Bengali meaning in crisp typography
  - Bilingual context example sentence
- **Reading Ergonomics & Themes:**
  - **Day Mode (Light):** Crisp white with high-contrast slate text
  - **Sepia Mode:** Eye-friendly warm parchment tone for prolonged reading sessions
  - **Night Mode (Dark):** Deep slate charcoal theme
  - **Dynamic Font Resizing:** Stepped font size controls (`sm`, `md`, `lg`, `xl`) with generous `1.75` line height.
- **Admin & Seeder Tool (`/upload`):** Mobile-friendly content manager with guided input form and JSON seeder to insert new passages, sections, and vocabulary directly into Neon PostgreSQL.

---

## 🛠 Tech Stack

- **Framework:** Next.js (App Router, React Server Components & Client Components)
- **Database:** Neon Serverless PostgreSQL with PgBouncer connection pooling
- **ORM:** Prisma ORM 6.19
- **Typography:** Google Fonts (`Inter` for Latin English, `Hind Siliguri` for Bengali)
- **Styling:** Tailwind CSS with custom theme variables
- **Icons:** Lucide React

---

## 🗄 Neon Database Connection & Schema

Neon Serverless PostgreSQL utilizes two connection strings:
1. `DATABASE_URL_POOLED`: Neon PgBouncer connection pooler on port 5432 for high-concurrency serverless queries.
2. `DATABASE_URL`: Direct unpooled connection for Prisma migrations and CLI tasks.

### Environment Setup (`.env`)
```bash
# Direct URL for schema migrations & CLI tasks
DATABASE_URL="postgresql://neondb_owner:npg_lg24QFZdUAmv@ep-patient-shape-a1ukf19x.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

# Pooled URL (Neon PgBouncer) for application queries & serverless routes
DATABASE_URL_POOLED="postgresql://neondb_owner:npg_lg24QFZdUAmv@ep-patient-shape-a1ukf19x-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
```

### Prisma Schema (`prisma/schema.prisma`)
```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL_POOLED")
  directUrl = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum DifficultyLevel {
  BEGINNER
  INTERMEDIATE
  ADVANCED
}

model Passage {
  id                 String           @id @default(cuid())
  slug               String           @unique
  titleEn            String
  titleBn            String
  category           String           @default("General")
  difficulty         DifficultyLevel  @default(BEGINNER)
  englishContent     String           @db.Text
  bengaliContent     String           @db.Text
  summaryEn          String?          @db.Text
  summaryBn          String?          @db.Text
  readingTimeMinutes Int              @default(3)
  isPublished        Boolean          @default(true)
  createdAt          DateTime         @default(now())
  updatedAt          DateTime         @updatedAt

  sections           PassageSection[]
  vocabularies       Vocabulary[]

  @@index([difficulty])
  @@index([category])
  @@index([slug])
}

model PassageSection {
  id          String   @id @default(cuid())
  passageId   String
  orderIndex  Int
  englishText String   @db.Text
  bengaliText String   @db.Text
  passage     Passage  @relation(fields: [passageId], references: [id], onDelete: Cascade)

  @@index([passageId, orderIndex])
}

model Vocabulary {
  id                String   @id @default(cuid())
  passageId         String?
  word              String
  phonetic          String?
  partOfSpeech      String?
  bengaliMeaning    String
  englishDefinition String?  @db.Text
  exampleSentenceEn String?  @db.Text
  exampleSentenceBn String?  @db.Text
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  passage           Passage? @relation(fields: [passageId], references: [id], onDelete: Cascade)

  @@index([passageId])
  @@index([word])
}
```

---

## 🚀 Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/shahariarmahfuz/edu.git
   cd edu
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment:**
   Create `.env` with the Neon credentials as shown above.

4. **Synchronize Database & Seed Content:**
   ```bash
   npm run db:push
   npm run db:seed
   ```

5. **Start Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) on your mobile browser or device simulator.

---

## 🔌 Backend API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/passages` | Lists all published passages with filtering by `difficulty`, `category`, and search `q`. |
| `GET` | `/api/passages/:slug` | Retrieves a single passage with all ordered bilingual sections and vocabulary. |
| `POST` | `/api/passages` | Uploads a new passage, auto-generates paragraph sections, and creates vocabulary items. |
| `GET` | `/api/vocabulary` | Searches vocabulary words across passages. |

---

## 📂 Folder Structure

```
├── prisma/
│   ├── schema.prisma       # Database schema with Neon connection pool
│   └── seed.ts             # Seeder script with authentic bilingual stories
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── passages/
│   │   │   │   ├── [slug]/route.ts  # Single passage API
│   │   │   │   └── route.ts         # List & upload passage API
│   │   │   └── vocabulary/route.ts  # Vocabulary search API
│   │   ├── read/[slug]/page.tsx     # Dynamic bilingual reading page
│   │   ├── upload/page.tsx          # Mobile content manager & JSON seeder
│   │   ├── layout.tsx               # Root layout with Inter & Hind Siliguri fonts
│   │   ├── globals.css              # Light, Sepia & Dark reader themes
│   │   └── page.tsx                 # Library homepage
│   ├── components/
│   │   ├── PassageReader.tsx        # Core interactive reading engine
│   │   ├── ReaderHeader.tsx         # Mobile header with typography & theme controls
│   │   └── VocabularyBottomSheet.tsx# Bottom sheet modal with audio pronunciation
│   ├── lib/
│   │   └── prisma.ts                # PrismaClient singleton for Next.js
│   └── types/
│       └── reading.ts               # Shared TypeScript domain interfaces
```
