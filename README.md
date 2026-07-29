# FaceClone – Facebook Clone with Backend

A simple Facebook-style social feed with a serverless backend on Vercel.

## Features
- Login with name
- Create posts (stored on server)
- Like & comment (server-side)
- Seeded demo posts

## API
- `GET  /api/posts` – list posts
- `POST /api/posts` – create post `{ author, avatar, content }`
- `PUT  /api/posts` – like or comment `{ id, action: "like"|"comment", user, text? }`

Data is in-memory (resets on cold start / redeploy). Perfect for demos.

## Local
Just open `index.html` or deploy to Vercel.
