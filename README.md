
# WorkWise - AI Powered Meeting Assistant

WorkWise is an AI-powered meeting assistant that helps teams extract value from their meetings through automated summaries, task extraction, and smart reminders.

## Features

- **AI Meeting Summaries**: Upload or record meetings and get smart, concise summaries powered by AI
- **Task Extraction**: AI automatically identifies and extracts tasks and due dates from meetings and notes
- **Smart Reminders**: Get timely reminders for upcoming tasks via email or Slack integration
- **Team Dashboard**: View all your tasks, files, and meeting summaries in one organized workspace

## Setup Instructions

### 1. MongoDB Setup

1. Create a MongoDB Atlas account or use your existing one at [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster or use an existing one
3. In the MongoDB Atlas dashboard, click on "Connect" for your cluster
4. Choose "Connect your application" and copy the connection string
5. Replace the placeholder in the connection string with your actual username and password

### 2. Configure Environment

Create a `.env` file in the project root with the following content:

```
MONGODB_URI=your_mongodb_connection_string_here
PORT=5000
```

Replace `your_mongodb_connection_string_here` with the connection string you copied from MongoDB Atlas.

### 3. Install Dependencies

```sh
# Install the required dependencies
npm install
```

### 4. Run the Application

```sh
# Start the backend server
node src/server/server.js

# In a separate terminal, start the frontend
npm run dev
```

## Project Structure

- `src/server`: Contains the backend server and MongoDB connection
- `src/services`: API service functions for data fetching
- `src/components`: React components including the MeetingDashboard

## Troubleshooting

- If you see database connection errors, ensure your MongoDB connection string is correct and your network allows the connection
- Make sure both frontend and backend are running simultaneously
- Check console logs for any errors during startup

## Extending the Application

- Add authentication for user management
- Integrate with calendar applications
- Implement real-time collaborative features

