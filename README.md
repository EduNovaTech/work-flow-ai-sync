
# WorkWise - AI Powered Meeting Assistant

WorkWise is an AI-powered meeting assistant that helps teams extract value from their meetings through automated summaries, task extraction, and smart reminders.

## Features

- **AI Meeting Summaries**: Upload or record meetings and get smart, concise summaries powered by AI
- **Task Extraction**: AI automatically identifies and extracts tasks and due dates from meetings and notes
- **Smart Reminders**: Get timely reminders for upcoming tasks via email or Slack integration
- **Team Dashboard**: View all your tasks, files, and meeting summaries in one organized workspace

## Prerequisites

- Node.js (version 14 or higher)
- MongoDB Atlas account
- npm or yarn package manager

## Setup Instructions

### 1. MongoDB Atlas Setup

1. **Create MongoDB Atlas Account**
   - Go to [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up for a free account or log in to your existing account

2. **Create a New Cluster**
   - Click "Build a Database" or "Create"
   - Choose "M0 Sandbox" (free tier)
   - Select your preferred cloud provider and region
   - Click "Create Cluster"

3. **Create Database User**
   - Go to "Database Access" in the left sidebar
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Enter a username and secure password
   - Set "Database User Privileges" to "Read and write to any database"
   - Click "Add User"

4. **Configure Network Access**
   - Go to "Network Access" in the left sidebar
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (or add your specific IP)
   - Click "Confirm"

5. **Get Connection String**
   - Go back to "Database" in the left sidebar
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string (it should look like: `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`)

### 2. Environment Configuration

1. **Create Environment File**
   Create a `.env` file in the project root directory:
   ```
   MONGODB_URI=mongodb+srv://your_username:your_password@cluster0.xxxxx.mongodb.net/workwise?retryWrites=true&w=majority
   PORT=5000
   ```

2. **Replace Placeholders**
   - Replace `your_username` with the database user you created
   - Replace `your_password` with the password you set
   - Replace `cluster0.xxxxx.mongodb.net` with your actual cluster URL
   - Make sure to include `/workwise` as the database name

### 3. Install Dependencies

```bash
# Install all required dependencies
npm install
```

### 4. Start the Application

**Option 1: Start Backend and Frontend Separately**

```bash
# Terminal 1 - Start the backend server
node src/server/server.js

# Terminal 2 - Start the frontend development server
npm run dev
```

**Option 2: Start Backend with Environment Variables (if no .env file)**

```bash
# Windows (Command Prompt)
set MONGODB_URI=mongodb+srv://your_username:your_password@cluster0.xxxxx.mongodb.net/workwise?retryWrites=true&w=majority && node src/server/server.js

# Windows (PowerShell)
$env:MONGODB_URI="mongodb+srv://your_username:your_password@cluster0.xxxxx.mongodb.net/workwise?retryWrites=true&w=majority"; node src/server/server.js

# macOS/Linux
MONGODB_URI="mongodb+srv://your_username:your_password@cluster0.xxxxx.mongodb.net/workwise?retryWrites=true&w=majority" node src/server/server.js
```

### 5. Verify Setup

1. **Backend Verification**
   - Open [http://localhost:5000/api/meetings](http://localhost:5000/api/meetings)
   - You should see an empty array `[]` if everything is working

2. **Frontend Verification**
   - Open [http://localhost:5173](http://localhost:5173) (or the port shown in your terminal)
   - You should see the WorkWise dashboard

## Project Structure

```
src/
├── server/
│   ├── server.js          # Express server with API endpoints
│   └── mongodb.js         # MongoDB connection configuration
├── services/
│   └── mongoService.ts    # Frontend API service functions
├── components/
│   └── MeetingDashboard.tsx # Main dashboard component
└── pages/
    └── Index.tsx          # Main page component
```

## API Endpoints

- `GET /api/meetings` - Fetch all meetings
- `POST /api/meetings` - Create a new meeting with AI summary
- `GET /api/tasks` - Fetch all tasks
- `POST /api/tasks` - Create a new task
- `PATCH /api/tasks/:id` - Update a task
- `POST /api/reminders` - Set up email/Slack reminders

## Troubleshooting

### MongoDB Connection Issues

1. **Check Connection String**
   - Ensure username and password are correct
   - Verify the cluster URL is accurate
   - Make sure the database name is included (`/workwise`)

2. **Network Issues**
   - Verify your IP address is whitelisted in MongoDB Atlas
   - Check if your firewall is blocking the connection
   - Try "Allow Access from Anywhere" in Network Access settings

3. **Authentication Issues**
   - Ensure the database user has proper permissions
   - Verify the username and password are correct
   - Check if the user is enabled

### Common Error Messages

- `ENOTFOUND`: DNS resolution issue - check your connection string
- `Authentication failed`: Wrong username/password
- `IP not whitelisted`: Add your IP to Network Access in MongoDB Atlas

### Development Tips

- Use MongoDB Compass to visualize your data: [Download here](https://www.mongodb.com/try/download/compass)
- Check the browser's Network tab for API call details
- Monitor the backend console for detailed error messages

## Extending the Application

- Add authentication for user management
- Integrate with OpenAI API for better AI summaries
- Implement real-time collaborative features
- Add file upload capabilities for meeting recordings
