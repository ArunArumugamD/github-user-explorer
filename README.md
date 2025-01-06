# GitHub User Explorer

A full-stack application built with Node.js, Express, TypeScript, MySQL, and React that allows users to explore GitHub profiles, repositories, and connections.

## Features

- Search GitHub users by username
- View user repositories and profile information
- View repository details
- Explore user followers
- Navigate through user connections
- Data caching to minimize GitHub API calls

## Tech Stack

### Backend
- Node.js
- Express.js
- TypeScript
- MySQL
- TypeORM

### Frontend
- React (with Hooks)
- TypeScript
- CSS (No frameworks used)

## Prerequisites

- Node.js (v14 or higher)
- MySQL
- Git

## Installation & Setup

1. Clone the repository
```bash
git clone <repository-url>
cd github-user-explorer
```

2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file and fill in your MySQL credentials
# Example .env content:
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password
DB_NAME=github_explorer
PORT=3001

# Start the backend server
npm start
```

3. Frontend Setup
```bash
# Open new terminal and navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create .env file for GitHub token
# Example .env content:
REACT_APP_GITHUB_TOKEN=your_github_token

# Start the frontend application
npm start
```

## GitHub Token Setup

1. Go to GitHub.com → Settings → Developer Settings → Personal Access Tokens → Tokens (classic)
2. Generate new token
3. Select scopes: `read:user` and `public_repo`
4. Copy token and add it to frontend/.env file

## Running the Application

1. Make sure MySQL server is running

2. Start backend server:
```bash
cd backend
npm start
```

3. Start frontend application in a new terminal:
```bash
cd frontend
npm start
```

4. Open http://localhost:3000 in your browser

## Application Flow

1. Enter a GitHub username in the search box
2. View user's profile and repositories
3. Click on a repository to see its details
4. Click on followers count to see user's followers
5. Click on a follower to view their profile
6. Use back buttons to navigate between views

## Database Schema

The application uses MySQL with the following main table:

```sql
CREATE TABLE users (
  username VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255),
  avatar_url VARCHAR(255),
  bio TEXT,
  location VARCHAR(255),
  blog VARCHAR(255),
  public_repos INT DEFAULT 0,
  public_gists INT DEFAULT 0,
  followers INT DEFAULT 0,
  following INT DEFAULT 0,
  following_users TEXT,
  follower_users TEXT,
  friend_users TEXT,
  created_at DATETIME,
  updated_at DATETIME,
  is_deleted BOOLEAN DEFAULT false
);
```

## Note for Reviewers

- The application uses GitHub's API, so the GitHub token is required for proper functionality
- The backend runs on port 3001 and frontend on port 3000
- Make sure both MySQL and Node.js are installed and running before starting the application