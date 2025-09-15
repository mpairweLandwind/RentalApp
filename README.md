# GestImpact - Real Estate Management Platform

A comprehensive real estate management platform built with React, Node.js, and PostgreSQL (Supabase).

## 🏗️ Project Structure

```
GestImpact/
├── client/          # React frontend application
│   ├── src/         # Source code
│   ├── public/      # Static assets
│   └── package.json # Client dependencies
├── server/          # Node.js backend API
│   ├── controllers/ # Route controllers
│   ├── routes/      # API routes
│   ├── prisma/      # Database schema and migrations
│   └── package.json # Server dependencies
└── README.md        # Project documentation
```

## 🚀 Features

### Frontend (React + Vite)
- **Property Management**: List, view, and manage properties
- **Maintenance Tracking**: Monitor property maintenance activities
- **User Authentication**: Secure login and registration
- **Admin Dashboard**: Analytics and management interface
- **Responsive Design**: Mobile-first approach
- **Multi-language Support**: Internationalization ready
- **Payment Integration**: PayPal payment processing

### Backend (Node.js + Express)
- **RESTful API**: Clean and organized endpoints
- **Authentication**: JWT-based authentication
- **Database**: PostgreSQL with Prisma ORM
- **File Upload**: Image and document handling
- **Email Services**: Automated notifications
- **Payment Processing**: PayPal integration
- **Security**: CORS, input validation, and sanitization

## 🛠️ Technology Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Context API** - State management
- **SCSS** - Styling
- **i18next** - Internationalization
- **Leaflet** - Interactive maps

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Prisma** - Database ORM
- **PostgreSQL** - Database (Supabase)
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Nodemailer** - Email services
- **PayPal SDK** - Payment processing

## 📦 Installation

### Prerequisites
- Node.js 18+
- Yarn or npm
- PostgreSQL database (Supabase account)

### 1. Clone the Repository
```bash
git clone https://github.com/mpairweLandwind/RentalApp.git
cd RentalApp
```

### 2. Server Setup
```bash
cd server
yarn install

# Copy and configure environment variables
cp .env.example .env
# Edit .env with your Supabase credentials and other configs

# Run database migrations
yarn prisma migrate dev

# Generate Prisma client
yarn prisma generate

# Start the server
yarn start
```

### 3. Client Setup
```bash
cd ../client
yarn install

# Copy and configure environment variables
cp .env.example .env
# Edit .env with your API endpoints and configs

# Start the development server
yarn dev
```

## 🔧 Configuration

### Server Environment Variables
```env
# Database
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

# Server
PORT=3000
JWT_SECRET=your-jwt-secret

# PayPal
PAYPAL_CLIENT_ID=your-paypal-client-id
PAYPAL_CLIENT_SECRET=your-paypal-secret

# Email
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### Client Environment Variables
```env
VITE_API_URL=http://localhost:3000
VITE_PAYPAL_CLIENT_ID=your-paypal-client-id
```

## 📊 Database Schema

The application uses PostgreSQL with the following main entities:
- **Users** - User accounts and profiles
- **Listings** - Property listings
- **Maintenance** - Property maintenance records
- **Transactions** - Payment and booking transactions

## 🚀 Deployment

### Server (Vercel/Railway/Render)
1. Push your code to GitHub
2. Connect your repository to your hosting platform
3. Set environment variables
4. Deploy

### Client (Vercel/Netlify)
1. Build the project: `yarn build`
2. Deploy the `dist` folder
3. Configure environment variables

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Properties
- `GET /api/listings` - Get all listings
- `POST /api/listings` - Create new listing
- `GET /api/listings/:id` - Get listing by ID
- `PUT /api/listings/:id` - Update listing
- `DELETE /api/listings/:id` - Delete listing

### Maintenance
- `GET /api/maintenance` - Get maintenance records
- `POST /api/maintenance` - Create maintenance record
- `PUT /api/maintenance/:id` - Update maintenance record

### Users
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user profile
- `GET /api/users/:id/bookings` - Get user bookings

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Developer**: mpairweLandwind
- **GitHub**: [@mpairweLandwind](https://github.com/mpairweLandwind)

## 📞 Support

For support, email mpairwelauben22@gmail.com or create an issue on GitHub.

---

**GestImpact** - Making real estate management simple and efficient! 🏠