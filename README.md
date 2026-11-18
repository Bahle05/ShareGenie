# ShareGenie

A community donation platform: people list items they no longer need, and others in the community find and claim them. The aim is simple, to keep useful things in use and get them to people who need them.

## Features

- **Accounts:** register, log in and log out, with passwords hashed using bcrypt and sessions held in a JSON Web Token (JWT) stored in an HTTP cookie
- **Donate an item:** list an item with a name, description and condition (new or used)
- **Browse donations:** see what's available in the community
- **Personal dashboard and profile:** view and edit your details, including a profile picture upload, and see the items you've donated
- **Protected routes:** middleware checks the JWT before allowing access to the dashboard and profile pages

## Tech stack

| Layer | Tools |
|---|---|
| Backend | Node.js, Express |
| Database | MongoDB with Mongoose |
| Views | EJS templates, Tailwind CSS |
| Auth | bcrypt, jsonwebtoken, cookie-parser |
| Uploads | Multer (profile pictures) |

## Structure

```
app.js            Express setup, routes and error handling
models/           User, Item, Donation (Mongoose schemas)
controllers/      auth, profile and user logic
middleware/       JWT authentication and profile guards
routes/           /auth, /items, /profile
views/            EJS pages: home, sign up, dashboard, profile, about
```

The app follows an MVC structure: Mongoose models define the data, controllers hold the logic, and EJS views render the pages.

## Run it locally

```bash
git clone https://github.com/Bahle05/ShareGenie.git
cd ShareGenie
npm install
cp .env.example .env     # set MONGO_URI and JWT_SECRET
npm run dev              # http://localhost:3000
```

You'll need MongoDB running locally or a MongoDB Atlas connection string.

## What I'd improve next

- Let receivers request an item and let donors approve the handover
- Search and filter by category and location
- Validation and rate limiting on the auth routes
- Item photos, and cloud storage for uploads instead of the local `uploads/` folder
- Deploy it publicly

## Author

**Bahle Ludidi**, BSc Computer Science (Information Systems), University of the Western Cape
[LinkedIn](https://www.linkedin.com/in/bahle-ludidi-727657352) · [GitHub](https://github.com/Bahle05)
