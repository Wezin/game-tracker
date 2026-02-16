## Game Tracker

A full-stack web app for organizing your personal video game library

Through custom lists, game statuses and a customizable profile, this app is designed to allow for the users to not only organize their games, but also express themselves through their library.

## Live Demo Link

- Demo: https://game-tracker-psi-smoky.vercel.app/

## Features

- Search for games via IGDB and added them to your library
- Personal games library with status tags (Backlog, Playing, Finished)
- Create custom lists using games in your library
- Profile page with bio, Top 5 pinned games, pinned lists, and recent activity
- Authentication and persistent database (Supabase Postgres)

## Tools Used

- Next.js + TypeScript
- Tailwind CSS
- Prisma ORM + PostgreSQL (Supabase)
- Better Auth
- IGDB API (Twitch Token)

## How To Run Locally

1. Install Dependencies:
   - npm install
2. Create .env.local:
   - DATABASE_URL=
   - DIRECT_URL=
   - BETTER_AUTH_SECRET=
   - BETTER_AUTH_URL= http://localhost:3000
   - TWITCH_CLIENT_ID=
   - TWITCH_CLIENT_SECRET=
3. Run migration and generate Prisma Client
   - npx prisma migrate deploy
   - npx prisma generate
4. Start dev server
   - npm run dev

## Currnet Project Status

- Single user only demo

## Future Plans

- Reviews + Ratings
- Cleaner UI/UX
- Social Features (View other users profiles, follow users, public lists/reviews)
