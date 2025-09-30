Setup

1. Create `.env` in `server/` from `.env.example`:

```
MONGODB_URI=your_atlas_connection_string
PORT=4000
```

2. Install and run:

```
npm install
npm run dev
```

API

- GET `/api/health`
- GET `/api/candidates?q=&status=&sort=`
- POST `/api/candidates`
- GET `/api/candidates/:id`
- PUT `/api/candidates/:id`
- POST `/api/candidates/:id/answers`


