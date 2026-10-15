# Food Delivery Order Management — Backend REST API & Real-Time Engine

> Production-grade Node.js / Express / MongoDB backend architecture designed for the CraveBite Food Delivery application. Built with ES modules, JWT authentication, phone + OTP verification, server-side pricing integrity, status transition state machine, and real-time Socket.IO synchronization.

---

## 📋 Table of Contents
1. [Architecture & Technology Stack](#-architecture--technology-stack)
2. [Folder Structure](#-folder-structure)
3. [Setup & Installation Instructions (macOS)](#-setup--installation-instructions-macos)
4. [Environment Variables](#-environment-variables)
5. [Authentication & OTP Flow](#-authentication--otp-flow)
6. [API Endpoint Reference](#-api-endpoint-reference)
   - [Health & Diagnostics](#1-health--diagnostics)
   - [Authentication](#2-authentication)
   - [Menu Management](#3-menu-management)
   - [Order Management](#4-order-management)
   - [User Profile & Addresses](#5-user-profile--addresses)
7. [Real-Time Socket.IO Synchronization](#-real-time-socketio-synchronization)
8. [Automated Testing](#-automated-testing)
9. [Security Highlights](#-security-highlights)

---

## 🛠 Architecture & Technology Stack

- **Runtime & Framework:** Node.js (v18+) with Express.js (ES Modules, `"type": "module"`)
- **Database & ODM:** MongoDB with Mongoose (with TTL auto-expiration index on OTPs, text indexes for menu search, and compound indexes)
- **Authentication:** Phone number verification using 6-digit numeric OTPs hashed with `bcryptjs`, and signed JSON Web Tokens (`jsonwebtoken`)
- **Security:**
  - `helmet` for secure HTTP response headers
  - `cors` configured for local frontend (`http://localhost:5173`, Capacitor mobile schemes)
  - `express-rate-limit` (custom limits on OTP requests, verifications, and general API endpoints)
  - Parameter and body validation via `express-validator`
  - Safe error masking in production (no leaked stack traces)
- **Real-Time Communication:** `socket.io` for room-scoped order lifecycle updates (`order:${orderId}`)
- **Testing Framework:** Vitest with Supertest and `mongodb-memory-server` (in-memory MongoDB isolation for fast, zero-side-effect test runs)

---

## 📂 Folder Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js          # MongoDB connection manager and health reporter
│   │   └── env.js               # Centralized typed environment loader with defaults
│   ├── controllers/
│   │   ├── authController.js    # Send/Verify OTP, Me, Logout
│   │   ├── menuController.js    # Menu listing, search, category filter, Admin CRUD
│   │   ├── orderController.js   # Order creation, verification, status transition
│   │   └── userController.js    # Profile & multi-address CRUD
│   ├── middleware/
│   │   ├── auth.js              # JWT verification & requireAdmin authorization
│   │   ├── errorHandler.js      # Centralized error handler & 404 catcher
│   │   ├── rateLimiter.js       # Tiered rate limiting (API, OTP send, OTP verify)
│   │   └── validate.js          # express-validator evaluation middleware
│   ├── models/
│   │   ├── Menu.js              # Menu items, ingredients, pricing, options, availability
│   │   ├── Order.js             # Order snapshots, pricing, status history, rider details
│   │   ├── Otp.js               # Hashed OTP, attempts counter, TTL expiration index
│   │   └── User.js              # Phone, profile, addresses array, preferences, role
│   ├── routes/
│   │   ├── authRoutes.js        # /api/auth endpoints
│   │   ├── healthRoutes.js      # /api/health endpoint
│   │   ├── menuRoutes.js        # /api/menu endpoints
│   │   ├── orderRoutes.js       # /api/orders endpoints
│   │   ├── profileRoutes.js     # /api/profile (frontend backward-compatibility)
│   │   └── userRoutes.js        # /api/users endpoints
│   ├── services/
│   │   ├── orderService.js      # Server-side pricing calculator & status machine
│   │   └── otpService.js        # OTP generator, bcrypt hashing, cooldown, SMS dispatch
│   ├── sockets/
│   │   └── socketManager.js     # Socket.IO room subscriptions & event broadcasting
│   ├── utils/
│   │   ├── apiError.js          # Custom operational ApiError class
│   │   ├── orderIdGenerator.js  # Readable Order ID generator (e.g. CRV-8291)
│   │   ├── seedMenu.js          # Idempotent menu & admin user seeder
│   │   └── seedRunner.js        # Standalone npm run seed script
│   ├── app.js                   # Express app configuration & middleware pipeline
│   └── server.js                # HTTP + Socket.IO server listener & graceful shutdown
├── tests/
│   ├── setup.js                 # In-memory MongoDB test environment lifecycle
│   ├── auth.test.js             # 8 unit & integration tests for Auth & OTP
│   ├── menu.test.js             # 7 tests for menu catalog, search & admin controls
│   ├── orders.test.js           # 7 tests for pricing integrity & status transitions
│   └── users.test.js            # 4 tests for user profiles and address management
├── .env.example                 # Example environment template
├── .gitignore                   # Ignored files (node_modules, .env, coverage)
├── package.json                 # Project dependencies and npm scripts
├── vitest.config.js             # Vitest configuration
└── README.md                    # Project documentation
```

---

## 🚀 Setup & Installation Instructions (macOS)

### 1. Prerequisites
- **Node.js** v18 or newer (`node -v`)
- **MongoDB** running locally or via Docker (`brew services start mongodb-community` or `docker run -d -p 27017:27017 mongo`)

### 2. Install Dependencies
Open Terminal on your Mac and navigate into `food/backend`:
```bash
cd /Users/raj/Desktop/Food/Backend
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
*(Default `.env` is already configured for local MongoDB on port 27017 and API on port 5000/5001).*

> **macOS AirPlay Note:** On macOS Monterey, Ventura, Sonoma, and Sequoia, the built-in AirPlay Receiver service occupies port `5000` (`commplex-main`). The backend server includes an **automatic port conflict detector**: if port `5000` is taken, it automatically falls back to port `5001` cleanly with zero crash! You can also set `PORT=5001` in `.env`.

### 4. Run Automated Test Suite
Run the 26 automated tests using Vitest (runs entirely against an in-memory MongoDB):
```bash
npm test
```

### 5. Start the Server
For development with auto-reload:
```bash
npm run dev
```

For standard production startup:
```bash
npm start
```

On startup, the server automatically connects to MongoDB, seeds initial menu items (if not already seeded), and prepares the admin user.

---

## ⚙️ Environment Variables

| Variable | Default Value | Description |
| :--- | :--- | :--- |
| `PORT` | `5000` (auto-fallback to `5001`) | Port on which the HTTP/Socket server listens |
| `NODE_ENV` | `development` | Environment mode (`development`, `test`, `production`) |
| `MONGODB_URI` | `mongodb://127.0.0.1:27017/food_delivery` | MongoDB connection connection string |
| `JWT_SECRET` | *(Random string)* | Cryptographic key used to sign JWT access tokens |
| `JWT_EXPIRES_IN` | `7d` | Token lifetime |
| `CLIENT_ORIGIN` | `http://localhost:5173` | Allowed CORS origin for the Vite frontend |
| `OTP_MODE` | `development` | Mode for OTP verification (`development` or `production`) |
| `OTP_TTL_MINUTES` | `5` | Minutes before an issued OTP expires |
| `OTP_DEV_LOG_ENABLED` | `true` | When `true` and not production, logs OTP in backend terminal |
| `MAX_OTP_ATTEMPTS` | `3` | Maximum incorrect verification attempts before OTP is revoked |
| `OTP_COOLDOWN_SECONDS` | `60` | Cooldown period before a new OTP can be requested for a phone |
| `SIMULATE_ORDER_STATUS` | `false` | When `true`, automatically steps newly created orders through statuses |
| `SMS_PROVIDER` | `mock` | SMS provider (`mock`, `twilio`) |

---

## 🔐 Authentication & OTP Flow

The application follows a mobile-first, passwordless OTP verification workflow:

1. **Request OTP (`POST /api/auth/send-otp`):**
   - User inputs mobile number (e.g. `+15551234567`).
   - Phone is normalized to standard format.
   - Server checks resend cooldown (60 seconds).
   - Generates a cryptographically random 6-digit OTP code (`crypto.randomInt`).
   - Hashes the OTP code with `bcryptjs` (salt rounds: 10) and stores it in MongoDB with a 5-minute TTL expiration.
   - Dispatches via SMS provider. In development mode with `OTP_DEV_LOG_ENABLED=true`, prints formatted banner to terminal.
   - **Never exposes the plain OTP in production or HTTP response bodies.**

2. **Verify OTP (`POST /api/auth/verify-otp`):**
   - User submits mobile number and 6-digit code.
   - Server verifies record exists, is unexpired, and attempt count $< 3$.
   - Uses `bcrypt.compare` to validate against stored hash.
   - On failure: increments attempts counter; if limit reached, revokes OTP.
   - On success: invalidates OTP record, checks if user exists (creates new customer record if first login), signs a JWT token, and returns `{ success: true, token, user }`.

3. **Subsequent Calls:**
   - Client sends token in header: `Authorization: Bearer <token>`.
   - Backend `authenticate` middleware verifies JWT and attaches `req.user`.

---

## 📖 API Endpoint Reference

### 1. Health & Diagnostics

#### `GET /api/health`
Checks application uptime and live MongoDB connectivity state.
- **Auth:** None (Public)
- **Response (200 OK):**
```json
{
  "status": "healthy",
  "service": "food-delivery-api",
  "timestamp": "2026-10-14T21:52:00.000Z",
  "uptimeSeconds": 42,
  "database": {
    "status": "healthy",
    "state": "connected",
    "databaseName": "food_delivery",
    "host": "127.0.0.1"
  },
  "environment": "development"
}
```

---

### 2. Authentication

#### `POST /api/auth/send-otp`
Requests an OTP for a mobile phone number.
- **Auth:** None (Rate-limited: 5 requests / 15 mins)
- **Request Body:**
```json
{
  "phone": "+15551234567"
}
```
- **Response (200 OK):**
```json
{
  "success": true,
  "message": "OTP sent successfully to your mobile number",
  "phone": "+15551234567",
  "expiresInSeconds": 300,
  "mode": "development"
}
```

#### `POST /api/auth/verify-otp`
Verifies submitted OTP and issues signed JWT access token.
- **Auth:** None (Rate-limited: 10 attempts / 15 mins)
- **Request Body:**
```json
{
  "phone": "+15551234567",
  "otp": "854591"
}
```
- **Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "isNewUser": false,
  "user": {
    "id": "670d8a...",
    "phone": "+15551234567",
    "name": "Foodie Guest",
    "email": "",
    "avatar": "https://images.unsplash.com/...",
    "role": "customer",
    "addresses": []
  }
}
```

#### `GET /api/auth/me`
Retrieves authenticated user session.
- **Auth:** Required (`Bearer <token>`)

#### `POST /api/auth/logout`
Acknowledge customer logout.
- **Auth:** None

---

### 3. Menu Management

#### `GET /api/menu`
Lists available food items with filtering, search, and pagination.
- **Auth:** None (Public)
- **Query Parameters:**
  - `category`: Filter by category (e.g. `Burger`, `Pizza`, `Biryani`, `Rolls`, `Drinks`)
  - `search`: Keyword search matching name, description, or category
  - `page`: Page number (default: `1`)
  - `limit`: Items per page (default: `50`)
- **Response (200 OK):**
```json
{
  "success": true,
  "count": 8,
  "totalCount": 8,
  "currentPage": 1,
  "totalPages": 1,
  "menu": [
    {
      "id": "b1",
      "name": "Smoky Angus Beast Burger",
      "category": "Burger",
      "description": "Juicy 100% Angus beef patty topped with smoked applewood bacon...",
      "price": 13.99,
      "rating": 4.9,
      "reviewsCount": 384,
      "prepTime": "20-25 min",
      "calories": "720 kcal",
      "isVeg": false,
      "isAvailable": true,
      "image": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd...",
      "ingredients": ["Angus Beef", "Cheddar Cheese", "Brioche Bun"],
      "options": [
        { "name": "Extra Cheddar Cheese", "price": 1.5 },
        { "name": "Double Patty", "price": 3.99 }
      ]
    }
  ]
}
```

#### `GET /api/menu/:id`
Retrieves a single food item by its ID or custom slug (`b1`, `p1`, etc.).
- **Auth:** None (Public)

#### `POST /api/menu` (Admin Only)
Creates a new menu item. Requires role `admin`.

#### `PATCH /api/menu/:id` (Admin Only)
Updates item price, description, or availability. Requires role `admin`.

#### `DELETE /api/menu/:id` (Admin Only)
Deletes a menu item. Requires role `admin`.

---

### 4. Order Management

#### `POST /api/orders`
Creates a new order. **All prices and totals are calculated strictly on the backend** to prevent client tampering.
- **Auth:** Required (`Bearer <token>`)
- **Request Body:**
```json
{
  "items": [
    {
      "id": "b1",
      "quantity": 2,
      "selectedOptions": [
        { "name": "Extra Cheddar Cheese", "price": 1.5 }
      ]
    }
  ],
  "customerName": "Alice Walker",
  "phoneNumber": "+15551234567",
  "deliveryAddress": {
    "tag": "Home",
    "street": "42 Marine Drive, Apt 4B",
    "city": "Downtown Metro",
    "pincode": "400020"
  }
}
```
- **Response (201 Created):**
```json
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "id": "CRV-4982",
    "orderId": "CRV-4982",
    "status": "Order Received",
    "subtotal": 30.98,
    "deliveryFee": 2.99,
    "packagingFee": 1.50,
    "discount": 0,
    "grandTotal": 35.47,
    "total": 35.47,
    "items": [...],
    "deliveryPartner": {
      "name": "Jordan Brooks",
      "rating": 4.9,
      "phone": "+1 (555) 456-7890",
      "vehicle": "Honda Hornet - Orange"
    },
    "timeline": [
      { "status": "Order Received", "completed": true, "current": true },
      { "status": "Preparing", "completed": false, "current": false },
      { "status": "Out for Delivery", "completed": false, "current": false },
      { "status": "Delivered", "completed": false, "current": false }
    ]
  }
}
```

#### `GET /api/orders`
Lists all orders belonging to the authenticated customer.
- **Auth:** Required (`Bearer <token>`)

#### `GET /api/orders/:id`
Retrieves an order by its `orderId` or `_id`. Customers can only view their own orders; admins can view all.
- **Auth:** Required (`Bearer <token>`)

#### `PATCH /api/orders/:id/status`
Updates order status using the validated status machine:
- `Order Received` $\rightarrow$ `Preparing` or `Cancelled`
- `Preparing` $\rightarrow$ `Out for Delivery` or `Cancelled`
- `Out for Delivery` $\rightarrow$ `Delivered`
- `Delivered` $\rightarrow$ Terminal
- `Cancelled` $\rightarrow$ Terminal
- **Auth:** Required. (Customers can only cancel un-prepped orders; Admins can perform all transitions).
- **Socket.IO:** Emits `orderStatusUpdated` to subscribers in `order:${orderId}` room.

#### `DELETE /api/orders/:id`
Deletes an order. Permitted only if status is `Cancelled` or `Order Received`.

---

### 5. User Profile & Addresses

#### `GET /api/users/me` *(also available as `GET /api/profile`)*
Retrieves authenticated customer profile.
- **Auth:** Required (`Bearer <token>`)

#### `PATCH /api/users/me` *(also available as `PUT /api/profile`)*
Updates user profile information (name, email, preferences).
- **Auth:** Required (`Bearer <token>`)

#### `GET /api/users/me/addresses`
Retrieves saved delivery addresses.

#### `POST /api/users/me/addresses`
Adds a new delivery address with optional `isDefault: true`.

#### `PATCH /api/users/me/addresses/:addressId`
Updates a saved delivery address.

#### `DELETE /api/users/me/addresses/:addressId`
Removes a saved address.

---

## 📡 Real-Time Socket.IO Synchronization

Clients subscribe to real-time order updates via Socket.IO:

```javascript
import { io } from 'socket.io-client';

const socket = io('http://localhost:5001', {
  auth: { token: savedJwtToken },
});

// Join the order room
socket.emit('join:order', { orderId: 'CRV-4982' });

// Listen for status changes
socket.on('orderStatusUpdated', (data) => {
  console.log('Order Updated:', data.status, data.timeline);
});
```

---

## 🧪 Automated Testing

The backend includes a comprehensive Vitest test suite that runs against an in-memory MongoDB server:

```bash
cd /Users/raj/Desktop/Food/Backend
npm test
```

### Test Coverage Highlights:
- **`tests/auth.test.js` (8 tests):**
  - Phone validation & format checking
  - OTP generation with bcrypt hashing
  - Attempt counter incrementation and maximum attempt revocation
  - Expired OTP rejection
  - JWT token generation and verification
  - Protected endpoint rejection
- **`tests/menu.test.js` (7 tests):**
  - Catalog retrieval of available dishes
  - Category filtering (`?category=Pizza`)
  - Search keyword filtering (`?search=Angus`)
  - Custom slug (`b1`) and ObjectId lookup
  - Non-existent item 404 responses
  - Customer mutation blocking (401/403)
  - Admin item creation and updates
- **`tests/orders.test.js` (7 tests):**
  - Order creation with strict server-side calculation
  - Client total price tampering rejection
  - Empty cart and zero quantity validation
  - Unavailable menu item rejection
  - Authorization isolation (users cannot view other customers' orders)
  - Valid and invalid status transition rules
  - Order cancellation and deletion permissions
- **`tests/users.test.js` (4 tests):**
  - Profile retrieval & updates
  - Delivery address CRUD lifecycle
  - Unauthenticated rejection

**All 26 tests passed in 4.86s.**

---

## 🛡 Security Highlights

1. **Server-Side Pricing Integrity:** Under no circumstances does the backend trust client-submitted subtotals or totals. Each item is verified against the database `price`, valid selected options are checked, delivery fees are calculated algorithmically, and the grand total is computed securely on the server.
2. **Hashed Credentials:** OTPs are never stored in plaintext. They are salted and hashed with `bcryptjs` and auto-expire in 5 minutes via MongoDB TTL indexes.
3. **Information Disclosure Prevention:** The plain OTP is never returned in HTTP responses. Stack traces are masked in production.
4. **Access Isolation:** Cross-tenant order inspection is blocked via customer ID verification.
5. **Tiered Rate Limiting:** Brute force attacks on OTP generation and validation are mitigated by strict IP window rate limiters.
