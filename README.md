# Subscription Management Microservice API

A robust RESTful API for managing user subscriptions in a SaaS platform. Built with Node.js, Express, and MongoDB.

## Features

- 🔐 **Secure Authentication**: JWT-based authentication system
- 💼 **Plan Management**: Create, update, and manage subscription plans
- 📊 **Subscription Management**: Users can subscribe, upgrade, downgrade, and cancel plans
- ⏱️ **Automatic Expiration**: Built-in scheduler to automatically expire subscriptions
- 🔄 **Renewal System**: Support for subscription renewals
- 🛡️ **Input Validation**: Comprehensive request validation with Joi
- 📈 **Scalable Architecture**: Clean architecture with MVC pattern
- 🔍 **Robust Error Handling**: Standardized error responses
- 📝 **Logging**: Winston-based logging system

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Joi
- **Logging**: Winston
- **Security**: Helmet, CORS, Rate Limiting

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/register` | Register a new user |
| POST | `/api/v1/auth/login` | Authenticate a user |

### Plans

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/plans` | Get all plans |
| GET | `/api/v1/plans/:id` | Get a specific plan |
| POST | `/api/v1/plans` | Create a new plan (Admin) |
| PUT | `/api/v1/plans/:id` | Update a plan (Admin) |
| DELETE | `/api/v1/plans/:id` | Delete a plan (Admin) |

### Subscriptions

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/subscriptions` | Create a new subscription |
| GET | `/api/v1/subscriptions/:userId` | Get a user's subscription |
| PUT | `/api/v1/subscriptions/:userId` | Update a user's subscription |
| DELETE | `/api/v1/subscriptions/:userId` | Cancel a user's subscription |
| POST | `/api/v1/subscriptions/:subscriptionId/renew` | Renew a subscription |
| POST | `/api/v1/subscriptions/check-expired` | Check for expired subscriptions (Admin) |

## Getting Started

### Prerequisites

- Node.js (v14+)
- MongoDB

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/alphamoris/subscription-service.git
   cd subscription-service
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Configure environment variables
   Create a `.env` file in the root directory and add the following:
   ```
   PORT=3000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/subscription-service
   JWT_SECRET=your_jwt_secret_here
   JWT_EXPIRES_IN=1d
   LOG_LEVEL=info
   ```

4. Start the server
   ```bash
   # Development mode with auto-restart
   npm run dev
   
   # Production mode
   npm start
   ```

## Data Models

### User
- name: String (required)
- email: String (required, unique)
- password: String (required, min 8 characters)
- role: String (enum: 'user', 'admin', default: 'user')
- active: Boolean (default: true)

### Plan
- name: String (required, unique)
- description: String (required)
- price: Number (required)
- currency: String (enum: 'USD', 'EUR', 'GBP', 'INR', default: 'INR')
- duration: Number (required, min: 1)
- durationUnit: String (enum: 'day', 'month', 'year', default: 'day')
- features: [String]
- isActive: Boolean (default: true)

### Subscription
- user: ObjectId (ref: 'User', required)
- plan: ObjectId (ref: 'Plan', required)
- status: String (enum: 'ACTIVE', 'INACTIVE', 'CANCELLED', 'EXPIRED', 'PENDING', default: 'PENDING')
- startDate: Date (default: now)
- endDate: Date (required)
- autoRenew: Boolean (default: false)
- paymentStatus: String (enum: 'PAID', 'UNPAID', 'FAILED', 'REFUNDED', 'PENDING', default: 'PENDING')
- paymentMethod: String (enum: 'CREDIT_CARD', 'PAYPAL', 'BANK_TRANSFER', 'OTHER', default: 'CREDIT_CARD')
- transactionId: String
- cancellationReason: String
- metaData: Map

## Advanced Features

- **Fault Tolerance**: Transaction support for critical operations
- **Rate Limiting**: Prevent abuse with rate limiting
- **Security**: Encrypted JWTs, secure HTTP headers, CORS protection
- **Smart Subscription Logic**: Automatic renewal and expiration handling
- **Virtual Fields**: Calculated fields like 'isActive' and 'daysRemaining'
- **Indexing**: Strategic database indexes for optimal performance

## Future Enhancements

- Payment gateway integration (Stripe, PayPal)
- Webhooks for subscription events
- Email notifications
- Usage-based billing
- Multiple subscription tiers per user
- Analytics dashboard

 