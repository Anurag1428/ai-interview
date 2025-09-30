# MongoDB Setup Guide

Your backend is ready with MongoDB integration! Choose one of these options:

## 🚀 **Option 1: MongoDB Atlas (Cloud - Recommended)**

### **Why Atlas?**
- ✅ **Free tier** available (512MB storage)
- ✅ **No local installation** needed
- ✅ **Automatic backups**
- ✅ **Global accessibility**
- ✅ **Production ready**

### **Setup Steps:**

1. **Create MongoDB Atlas Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Sign up for free account
   - Create a new project

2. **Create a Cluster**
   - Click "Build a Database"
   - Choose **FREE** shared cluster
   - Select your preferred region
   - Click "Create Cluster"

3. **Setup Database Access**
   - Go to "Database Access" in left sidebar
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Username: `interview-admin`
   - Password: Generate secure password
   - Database User Privileges: "Read and write to any database"
   - Click "Add User"

4. **Setup Network Access**
   - Go to "Network Access" in left sidebar
   - Click "Add IP Address"
   - Choose "Allow Access from Anywhere" (for development)
   - Click "Confirm"

5. **Get Connection String**
   - Go to "Database" in left sidebar
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your actual password

6. **Update Server Configuration**
   ```bash
   # Edit server/.env
   MONGODB_URI=mongodb+srv://interview-admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/ai-interview-assistant
   ```

## 🏠 **Option 2: Local MongoDB**

### **Prerequisites:**
- MongoDB installed locally
- MongoDB Compass (optional GUI)

### **Installation:**

**Windows:**
```bash
# Download from https://www.mongodb.com/try/download/community
# Or use chocolatey
choco install mongodb
```

**macOS:**
```bash
# Using Homebrew
brew tap mongodb/brew
brew install mongodb-community
```

**Linux (Ubuntu):**
```bash
# Import MongoDB public GPG key
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

# Add MongoDB repository
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Install MongoDB
sudo apt-get update
sudo apt-get install -y mongodb-org
```

### **Start MongoDB:**
```bash
# Start MongoDB service
sudo systemctl start mongod  # Linux
brew services start mongodb-community  # macOS
# Windows: MongoDB starts automatically as service
```

### **Configuration:**
```bash
# server/.env (already configured)
MONGODB_URI=mongodb://127.0.0.1:27017/ai-interview-assistant
```

## 🧪 **Testing Your Setup**

### **1. Start the Backend:**
```bash
cd server
npm install
npm run dev
```

### **2. Test Health Endpoint:**
```bash
curl http://localhost:4000/api/health
```

**Expected Response:**
```json
{
  "ok": true,
  "timestamp": "2024-01-15T10:30:00.000Z",
  "database": "connected",
  "version": "1.0.0"
}
```

### **3. Test Database Connection:**
```bash
curl http://localhost:4000/api/candidates
```

**Expected Response:**
```json
{
  "items": [],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 0,
    "pages": 0
  }
}
```

## 🔧 **Frontend Integration**

### **Update Frontend Environment:**
```bash
# Add to your main .env file (not server/.env)
REACT_APP_API_URL=http://localhost:4000/api
REACT_APP_USE_BACKEND=true
```

### **Enable Backend in Frontend:**
The frontend will automatically detect and use the backend API when available.

## 📊 **Database Schema**

### **Candidate Collection:**
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  phone: String,
  resumeText: String,
  interviewStatus: 'not_started' | 'in_progress' | 'completed',
  currentQuestionIndex: Number,
  answers: [{
    questionId: String,
    questionText: String,
    difficulty: String,
    timeLimit: Number,
    userAnswer: String,
    score: Number,
    feedback: String,
    strengths: [String],
    improvements: [String],
    createdAt: Date
  }],
  finalScore: Number,
  summary: String,
  createdAt: Date,
  lastActiveAt: Date
}
```

## 🚀 **Production Deployment**

### **Environment Variables:**
```bash
# Production server/.env
MONGODB_URI=your_production_mongodb_uri
PORT=4000
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.com
```

### **Deployment Options:**
- **Heroku**: Easy deployment with MongoDB Atlas
- **Railway**: Modern deployment platform
- **DigitalOcean**: VPS with Docker
- **AWS/GCP**: Cloud platforms

## 🔍 **Monitoring & Debugging**

### **Check Database Connection:**
```bash
# MongoDB Atlas
# Use MongoDB Compass with your connection string

# Local MongoDB
mongo ai-interview-assistant
db.candidates.find().pretty()
```

### **Common Issues:**

1. **Connection Timeout**
   - Check network access settings in Atlas
   - Verify firewall settings for local MongoDB

2. **Authentication Failed**
   - Double-check username/password
   - Ensure user has correct permissions

3. **Database Not Found**
   - Database is created automatically on first write
   - Check database name in connection string

## 📈 **Performance Tips**

1. **Indexing:**
   ```javascript
   // Add indexes for better query performance
   db.candidates.createIndex({ email: 1 })
   db.candidates.createIndex({ interviewStatus: 1 })
   db.candidates.createIndex({ finalScore: -1 })
   ```

2. **Connection Pooling:**
   - Already configured in the backend
   - Handles multiple concurrent requests

3. **Data Validation:**
   - Mongoose schemas provide validation
   - Frontend validation for better UX

---

**Need Help?** Check the troubleshooting section or create an issue!