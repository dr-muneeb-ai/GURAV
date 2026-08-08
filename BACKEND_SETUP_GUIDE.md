# Backend Setup Guide - Local Testing & Development

This guide will help you set up and run the backend server locally for testing purposes.

## 📋 Prerequisites

Before you start, make sure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **MongoDB** - Either:
  - Local MongoDB installation - [Download](https://www.mongodb.com/try/download/community)
  - Or MongoDB Atlas (cloud) - [Sign up free](https://www.mongodb.com/cloud/atlas)
- **npm** (comes with Node.js)

---

## 🚀 Step-by-Step Setup Instructions

### 1. **Navigate to Backend Directory**

```bash
cd backend
```

### 2. **Install Dependencies**

```bash
npm install
```

This will install all required packages listed in `package.json`.

### 3. **Configure Environment Variables**

The `.env` file already exists in the backend directory with placeholder values. Update it with your actual credentials:

```dotenv
# Server configuration
PORT=4000

# Database
MONGODB_URI=mongodb://localhost:27017
# OR if using MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net

# JWT authentication
JWT_SECRET=your_secure_secret_key_here

# Admin credentials (used for checking admin login)
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_admin_password

# Email service
# Option A (Gmail):
EMAIL_PROVIDER=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password

# Option B (Brevo SMTP):
# EMAIL_PROVIDER=brevo
# BREVO_SMTP_USER=your_brevo_smtp_login
# BREVO_SMTP_PASS=your_brevo_smtp_key
# BREVO_FROM_EMAIL=verified-sender@yourdomain.com
# BREVO_FROM_NAME=ForEver
# BREVO_SMTP_HOST=smtp-relay.brevo.com
# BREVO_SMTP_PORT=587

# Payment gateways (currently not in use - only using COD)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key

# Cloudinary (for image uploads - not currently used)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET_KEY=your_cloudinary_secret_key
```

### 4. **Start MongoDB Server**

**If using Local MongoDB:**

- Windows: MongoDB should auto-start as a service after installation
- Mac/Linux:
  ```bash
  mongod
  ```
  Or if using Homebrew on Mac:
  ```bash
  brew services start mongodb-community
  ```

**If using MongoDB Atlas:**

- Your cloud database will be running automatically

**Verify Connection:**

```bash
mongo
# or
mongosh
# If connected successfully, you'll see a shell prompt
```

### 5. **Start the Backend Server**

**Option A: Simple Start (Production Mode)**

```bash
npm start
```

**Option B: Development Mode with Auto-Reload (Recommended)**

```bash
npm run server
```

This uses `nodemon` which automatically restarts the server when you make changes to files.

**Expected Output:**

```
Server started on PORT : 4000
DB Connected
```

---

## 🔍 Verification Checklist

After starting the server, verify everything is working:

1. **Check if server is running:**

   ```bash
   # In another terminal/PowerShell
   curl http://localhost:4000
   # Should return: API working
   ```

2. **Check MongoDB connection:**
   - Look for "DB Connected" message in the console
   - If you see errors, check:
     - MongoDB is actually running
     - MONGODB_URI in .env is correct
     - Database name is `e-commerce`

3. **Test API Endpoints:**
   - You can use Postman or any REST client
   - Or use curl commands

---

## 📡 API Endpoints (For Testing)

### User Endpoints

```
POST /api/user/register     - Register new user
POST /api/user/login        - Login user
POST /api/user/logout       - Logout user
```

### Cart Endpoints

```
POST /api/cart/add          - Add item to cart (requires auth token)
POST /api/cart/update       - Update cart item quantity (requires auth token)
POST /api/cart/get          - Get user's cart (requires auth token)
```

### Order Endpoints

```
POST /api/order/place       - Place COD order (requires auth token)
POST /api/order/userorders  - Get user's orders (requires auth token)
POST /api/order/list        - Get all orders (admin only)
POST /api/order/status      - Update order status (admin only)
```

---

## 🔐 Admin Panel Setup

The admin interface is a separate React/Vite project in the `admin/` folder. It only uses the
backend for authentication and order‑management APIs – product CRUD is disabled and
all catalog data lives in the frontend repo.

1. **Install dependencies and start:**

   ```bash
   cd admin
   npm install      # first time only
   npm run dev      # starts on http://localhost:5173 (or another port if taken)
   ```

2. **Admin user:**
   - The backend accepts login credentials from environment variables `ADMIN_EMAIL` and
     `ADMIN_PASSWORD` defined in the backend `.env`. Example:
     ```dotenv
     ADMIN_EMAIL=admin@example.com
     ADMIN_PASSWORD=secret123
     ```
   - Use the admin panel login page to authenticate; a token is saved to `localStorage`.
   - You don't need to "create" the admin user in the database – the values are checked
     directly against the vars. For testing you can register a normal user via
     `/api/user/register` (or the frontend signup form) then log in as that user.

3. **Products:**
   - The admin UI still contains links for adding/listing products, but they only display an
     explanatory message. The real product list is edited by modifying
     `frontend/src/data/products.json` and redeploying the frontend.

4. **Orders:**
   - After logging in you can view all orders and change their status via the
     `/api/order/list` and `/api/order/status` endpoints.

---

## 🛠️ Troubleshooting

### Issue: "Port 4000 already in use"

**Solution:**

```bash
# Find the process using port 4000
netstat -ano | findstr :4000

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

### Issue: "Cannot connect to MongoDB"

**Check:**

- Is MongoDB service running?

  ```bash
  # Windows
  Get-Service MongoDB | Start-Service

  # Mac
  brew services start mongodb-community
  ```

- **Most common cause:** an invalid or empty `MONGODB_URI` value in your `.env`.
  The server will try to resolve the host portion of the URI and, if it is
  just the word `mongodb` (or left blank), you’ll see an error like:
  `querySrv ENOTFOUND _mongodb._tcp.mongodb`. Make sure the URI begins with
  `mongodb://` (for a local instance) or `mongodb+srv://` (for Atlas) and
  includes a host name or cluster address. Example:

  ```dotenv
  MONGODB_URI=mongodb://localhost:27017
  # or for Atlas
  MONGODB_URI=mongodb+srv://user:pass@cluster0.mongodb.net
  ```

- Database name is appended automatically (`/e-commerce` is added in the
  connection code).

### Issue: "dotenv not found" or dependency errors

**Solution:**

```bash
# Clear node_modules and reinstall
rm -r node_modules
npm install
```

### Issue: JWT validation errors in API calls

**Check:**

- Token is being sent in request headers: `{ headers: { token: 'your_token' } }`
- Token is valid and not expired
- JWT_SECRET in .env is the same used for token generation

---

## 🔗 Frontend & Backend Connection

### Configure Frontend to Use Local Backend

The frontend already has the correct configuration in `frontend/.env`:

```dotenv
VITE_BACKEND_URL=http://localhost:4000
```

Make sure:

1. Backend is running on port 4000
2. Frontend `.env` has correct backend URL
3. CORS is enabled in backend (it already is in `server.js`)

---

## 🧪 Testing the Add to Cart Feature

1. **Start both frontend and backend:**

   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run server

   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

2. **Test the flow:**
   - Open frontend in browser (http://localhost:5173)
   - Click on a product to view details
   - Select a size
   - Click "ADD TO CART"
   - Expected: Toast notification "Added to cart" should appear
   - Check: Cart item count should increase in navbar
   - Verify: Item appears in cart page

3. **Common Issues:**
   - No size selected → Should show error "Select a size for the product"
   - Backend not running → Items won't sync to backend, but local cart works
   - Token invalid → Backend cart sync will fail (user not logged in has no token, which is OK for local cart)

---

## 📊 Monitoring Backend

### View Logs

Keep the server terminal open to see:

- Incoming request logs
- Database connection status
- Any error messages

### Detailed Logging

To add more detailed logs, modify `server.js`:

```javascript
// Add after cors middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});
```

---

## ✅ Quick Start Command (All-in-One)

For a quick setup after first installation:

```powershell
# Terminal 1: Start Backend
cd backend
npm run server

# Terminal 2: Start Frontend (in a new terminal)
cd frontend
npm run dev
```

Then open `http://localhost:5173` in your browser.

---

## 📝 Notes

- **Currently Disabled:** Razorpay payment gateway (only COD is active)
- **Product Data:** Now managed via frontend JSON (`frontend/src/data/products.json`)
- **Email Service:** Requires valid Gmail credentials in `.env` for order confirmations
- **Database:** Creates `e-commerce` database automatically on first connection

---

## 🆘 Need Help?

Check the console logs in both backend and frontend terminals for error messages.
Common issues are usually related to:

1. MongoDB not running
2. Port conflicts
3. Missing/incorrect environment variables
4. Dependencies not installed

---

Good luck with your development! 🚀
