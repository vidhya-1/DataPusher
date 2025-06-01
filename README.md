# Data Pusher App

A simple Express.js app to receive JSON data and forward it to third-party platforms (destinations) using webhooks. Each destination is associated with an account, and data is forwarded based on a secret token.

##  Tech Stack

- Node.js
- Express.js
- Sequelize ORM
- SQLite
- Axios (for forwarding data to destinations)

---

##  Project Structure

├── models/
│ ├── index.js # Sequelize config & model setup
│ ├── account.js # Account schema
│ └── destination.js # Destination schema
├── routes/
│ ├── accountRoutes.js # CRUD for accounts
│ ├── destinationRoutes.js # CRUD for destinations
│ └── dataHandler.js # Handles incoming data & forwards to destinations
├── server.js # App entry point
├── data.db # SQLite DB file


---

##  Features

- Create, update, delete accounts and destinations.
- Automatically generate secret tokens for accounts.
- Receive JSON data at `/server/incoming_data` and forward to linked destinations.
- Forwards data using `POST`, `PUT`, or `GET` based on destination method.
- Includes custom headers per destination.
- Secure access via `CL-X-TOKEN` header.

---

## Getting Started

### 1. Install Dependencies

```bash
npm install
 
### Start the server

node server.js
