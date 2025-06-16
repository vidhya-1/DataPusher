# Data Pusher App

A Node.js and Express.js application designed to receive JSON data and forward it to third-party platforms (destinations) via webhooks. Each destination is linked to an account, and data forwarding is secured using secret tokens.

## Tech Stack

- Node.js
- Express.js
- Sequelize ORM
- SQLite
- Axios (for forwarding data to destinations)
- Redis (for caching)

## Project Structure

```
├── models/
│   ├── index.js           # Sequelize configuration and model setup
│   ├── account.js         # Account model schema
│   ├── destination.js     # Destination model schema
│   ├── accountMember.js   # Account member model schema
│   └── other models...
├── routes/
│   ├── accountRoutes.js       # CRUD operations for accounts
│   ├── destinationRoutes.js   # CRUD operations for destinations
│   ├── accountMember.js       # CRUD for account members
│   ├── dataHandler.js         # Handles incoming data and forwards to destinations
│   ├── logRoutes.js           # Logs retrieval routes
│   └── other route files...
├── queue/
│   └── forwardQueue.js        # Bull queue setup for forwarding jobs
├── test/
│   └── various test files     # Jest/Supertest test suites
├── utils/
│   └── helper.js              # Helper functions and middleware
├── server.js                  # Application entry point
├── data.db                   # SQLite database file
├── package.json              # Project dependencies and scripts
└── README.md                 # Project documentation
```

## Features

- Manage accounts and destinations with full CRUD operations.
- Secure data forwarding using secret tokens (`CL-X-TOKEN` header).
- Receive JSON data at `/server/incoming_data` endpoint and forward it to linked destinations.
- Supports forwarding data via HTTP methods: POST, PUT, GET.
- Custom headers support per destination.
- Role-based access control for API endpoints.
- Caching with Redis for improved performance.
- Background job processing with Bull queue.

## Getting Started

### Prerequisites

- Node.js (v14 or higher recommended)
- Redis server running locally or accessible remotely

### Installation

```bash
npm install
```

### Running the Server

```bash
node server.js
```

The server will start on port 3000 by default or the port specified in your `.env` file.

## Testing

- Tests are written using Jest and Supertest.
- Run tests with:

```bash
npm test
```

## API Endpoints Overview

- `/account` - Manage accounts
- `/destination` - Manage destinations
- `/accountMember` - Manage account members
- `/logs` - Retrieve logs
- `/server/incoming_data` - Endpoint to receive and forward incoming JSON data

## Notes

- Ensure Redis is running for caching and queue processing.
- Secret tokens are automatically generated for accounts.
- Use appropriate headers and roles when accessing protected endpoints.

