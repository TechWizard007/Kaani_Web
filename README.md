# Fisheries Learning Hub - Admin & Student Portal

A comprehensive web application for managing and accessing fisheries and agriculture learning materials with role-based access control.

## Features

### Student Features
- Browse and search learning modules
- View module details and content
- Download PDF materials
- Take interactive quizzes
- View quiz results and scores

### Admin Features
- Upload modules (PDF, text, videos)
- Manage modules (edit, delete)
- Create and manage quizzes
- View analytics dashboard
- Manage users

## Tech Stack

- **Frontend**: React 18, TailwindCSS, React Router
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer

## Project Structure

```
fisheries-learning-hub/
├── frontend/          # React application
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── context/      # React context (Auth)
│   │   └── App.js        # Main app component
│   └── package.json
├── backend/           # Node.js API
│   ├── models/        # MongoDB models
│   ├── routes/        # API routes
│   ├── middleware/    # Auth middleware
│   ├── uploads/       # Uploaded files
│   └── server.js      # Express server
└── package.json       # Root package.json
```

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Setup Steps

1. **Install root dependencies:**
   ```bash
   npm install
   ```

2. **Install all dependencies (frontend + backend):**
   ```bash
   npm run install-all
   ```

3. **Set up backend environment:**
   ```bash
   cd backend
   cp .env.example .env
   ```
   
   Edit `.env` and set:
   - `MONGODB_URI` - Your MongoDB connection string
   - `JWT_SECRET` - A secure random string for JWT signing
   - `PORT` - Backend server port (default: 5000)

4. **Set up frontend environment:**
   ```bash
   cd frontend
   ```
   
   Create `.env` file:
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```

5. **Start MongoDB:**
   Make sure MongoDB is running on your system.

6. **Run the application:**
   
   From the root directory:
   ```bash
   npm run dev
   ```
   
   This will start both frontend (port 3000) and backend (port 5000) concurrently.

   Or run separately:
   ```bash
   # Terminal 1 - Backend
   npm run server
   
   # Terminal 2 - Frontend
   npm run client
   ```

## Usage

### Creating an Admin Account

1. Start the application
2. Go to `/login`
3. Click "Sign up" to create a new account
4. For admin access, you'll need to manually update the user role in MongoDB:
   ```javascript
   db.users.updateOne(
     { email: "your-email@example.com" },
     { $set: { role: "admin" } }
   )
   ```

### Admin Workflow

1. Login as admin
2. Navigate to Admin Dashboard (`/admin`)
3. Upload modules via "Upload Module"
4. Create quizzes via "Create Quiz"
5. Manage content via "Manage Modules" and "Manage Quizzes"

### Student Workflow

1. Register/Login as student
2. Browse modules at `/modules`
3. View module details and download materials
4. Take quizzes associated with modules
5. View quiz results

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Modules
- `GET /api/modules` - Get all modules
- `GET /api/modules/:id` - Get single module
- `POST /api/modules` - Create module (admin only)
- `PUT /api/modules/:id` - Update module (admin only)
- `DELETE /api/modules/:id` - Delete module (admin only)

### Quizzes
- `GET /api/quizzes` - Get all quizzes
- `GET /api/quizzes/:id` - Get single quiz
- `GET /api/quizzes/module/:moduleId` - Get quizzes for module
- `POST /api/quizzes` - Create quiz (admin only)
- `PUT /api/quizzes/:id` - Update quiz (admin only)
- `DELETE /api/quizzes/:id` - Delete quiz (admin only)
- `POST /api/quizzes/:id/submit` - Submit quiz answers

### Users
- `GET /api/users` - Get all users (admin only)
- `DELETE /api/users/:id` - Delete user (admin only)

## Design Theme

The application uses an aqua-teal color scheme inspired by the original HTML design:
- Primary Green: `#1f4d2b`, `#164e27`
- Light Green: `#dff6ea`, `#c9efd9`
- Accent Colors: Primary green, teal, and aqua shades

## File Upload

- Supported formats: PDF, MP4, MOV, AVI
- Maximum file size: 10MB
- Files are stored in `backend/uploads/`
- Files are served statically at `/uploads/:filename`

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control (admin/student)
- Protected API routes
- File upload validation

## Development

### Adding New Features

1. Backend: Add routes in `backend/routes/`
2. Frontend: Add pages in `frontend/src/pages/`
3. Update models if needed in `backend/models/`

### Styling

The app uses TailwindCSS. Custom colors and utilities are defined in:
- `frontend/tailwind.config.js`
- `frontend/src/index.css`

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check connection string in `.env`
- Verify network/firewall settings

### File Upload Issues
- Check `backend/uploads/` directory exists
- Verify file size limits
- Check file type restrictions

### Authentication Issues
- Verify JWT_SECRET is set
- Check token expiration
- Clear browser localStorage if needed

## License

This project is part of KaAni Web - Empowering sustainable agriculture and fisheries.

## Support

For issues or questions, please contact the development team.

