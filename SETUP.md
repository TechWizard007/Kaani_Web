# Setup Guide - Fisheries Learning Hub

## Quick Start

### 1. Copy Assets

Copy the logo and background image to the frontend public folder:
```bash
# From project root
cp "logo (2).png" frontend/public/
cp bg.png frontend/public/
```

### 2. Install Dependencies

```bash
# Install root dependencies
npm install

# Install all dependencies (frontend + backend)
npm run install-all
```

### 3. Configure Environment Variables

#### Backend (.env)
```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/fisheries-learning-hub
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
```

#### Frontend (.env)
```bash
cd frontend
```

Create `frontend/.env`:
```
REACT_APP_API_URL=http://localhost:5000/api
```

### 4. Start MongoDB

Make sure MongoDB is running on your system:
- **Windows**: Start MongoDB service or run `mongod`
- **Mac**: `brew services start mongodb-community`
- **Linux**: `sudo systemctl start mongod`

Or use MongoDB Atlas (cloud) and update `MONGODB_URI` in `.env`

### 5. Create Admin User

**Option 1: Using the script (Recommended)**
```bash
cd backend
node scripts/createAdmin.js admin@example.com yourpassword "Admin Name"
```

**Option 2: Manual MongoDB**
```javascript
// Connect to MongoDB and run:
db.users.insertOne({
  name: "Admin User",
  email: "admin@example.com",
  password: "$2a$10$...", // Use bcrypt to hash password
  role: "admin"
})
```

**Option 3: Register then update**
1. Register normally at `/login`
2. Update role in MongoDB:
```javascript
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "admin" } }
)
```

### 6. Run the Application

**Development (both servers):**
```bash
npm run dev
```

**Or run separately:**
```bash
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend  
npm run client
```

### 7. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **Login**: http://localhost:3000/login

## Project Structure

```
fisheries-learning-hub/
├── frontend/              # React frontend
│   ├── public/           # Static files
│   └── src/
│       ├── components/   # Reusable components
│       ├── pages/        # Page components
│       ├── context/      # React Context (Auth)
│       └── App.js
├── backend/              # Node.js backend
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── middleware/      # Auth middleware
│   ├── uploads/        # Uploaded files
│   └── server.js
└── package.json
```

## Features Overview

### Student Features
- ✅ Browse modules
- ✅ View module details
- ✅ Download PDFs
- ✅ Take quizzes
- ✅ View quiz results

### Admin Features
- ✅ Upload modules (PDF/video/text)
- ✅ Manage modules
- ✅ Create quizzes
- ✅ Manage quizzes
- ✅ View dashboard with stats
- ✅ Manage users

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check connection string in `.env`
- Try: `mongodb://127.0.0.1:27017/fisheries-learning-hub`

### Port Already in Use
- Change `PORT` in `backend/.env`
- Update `REACT_APP_API_URL` in `frontend/.env`

### File Upload Issues
- Ensure `backend/uploads/` directory exists
- Check file size (max 10MB)
- Verify file types (PDF, MP4, MOV, AVI)

### Authentication Issues
- Clear browser localStorage
- Check JWT_SECRET is set
- Verify token in browser DevTools

## Next Steps

1. **Create your first module:**
   - Login as admin
   - Go to Admin Dashboard
   - Click "Upload Module"
   - Fill in details and upload PDF/video

2. **Create a quiz:**
   - Go to "Create Quiz"
   - Select a module
   - Add questions and choices
   - Mark correct answers

3. **Test as student:**
   - Logout and register as student
   - Browse modules
   - Take quizzes

## Production Deployment

### Backend
- Set `NODE_ENV=production`
- Use strong `JWT_SECRET`
- Configure MongoDB Atlas or production DB
- Set up file storage (S3, Cloudinary, etc.)

### Frontend
- Build: `cd frontend && npm run build`
- Serve `build/` folder
- Update API URL for production

## Support

For issues or questions, refer to the main README.md or contact the development team.

