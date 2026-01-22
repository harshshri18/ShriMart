# Database Setup Guide

## Current Database Configuration

- **Database Type**: MongoDB (NoSQL)
- **Database Name**: `meesho`
- **Connection String**: `mongodb://localhost:27017/meesho`
- **Location**: Configured in `backend/.env` file

## Option 1: MongoDB Atlas (Cloud - Recommended)

### Steps:
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for a free account
3. Create a free cluster (M0)
4. Create a database user:
   - Go to "Database Access"
   - Click "Add New Database User"
   - Set username and password
   - Save credentials
5. Whitelist your IP:
   - Go to "Network Access"
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
6. Get connection string:
   - Go to "Database" → "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database password
   - Example: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/meesho`

7. Update `backend/.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/meesho?retryWrites=true&w=majority
   ```

## Option 2: Local MongoDB Installation

### Windows Installation:
1. Download MongoDB Community Server:
   - https://www.mongodb.com/try/download/community
   - Choose Windows version
2. Install MongoDB:
   - Run the installer
   - Choose "Complete" installation
   - Install as a Windows Service (recommended)
3. Start MongoDB:
   - Open Command Prompt as Administrator
   - Run: `net start MongoDB`
   - Or use Services app to start "MongoDB" service

### Verify Installation:
```bash
# Check if MongoDB is running
net start MongoDB

# Test connection
mongosh
```

### Default Connection:
The application will automatically connect to:
- `mongodb://localhost:27017/meesho`

No changes needed in `.env` if using local MongoDB.

## Database Collections

Once connected, MongoDB will automatically create these collections:
- `users` - User accounts
- `products` - Product catalog
- `carts` - Shopping carts
- `orders` - Order history

## Verify Database Connection

1. Check backend server logs:
   - Should see: "MongoDB Connected"
   - If error: Check connection string and MongoDB status

2. Test with MongoDB Compass (GUI):
   - Download: https://www.mongodb.com/try/download/compass
   - Connect using: `mongodb://localhost:27017` (local) or your Atlas connection string
   - You should see the `meesho` database

## Troubleshooting

### Connection Error:
- **Local MongoDB**: Make sure MongoDB service is running
- **Atlas**: Check IP whitelist and connection string
- **Firewall**: Allow MongoDB port 27017 (local) or ensure internet access (Atlas)

### Create Admin User:
After registering a user, make them admin in MongoDB:
```javascript
// In MongoDB shell or Compass
use meesho
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "admin" } }
)
```

