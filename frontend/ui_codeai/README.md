# CodeGuardian Frontend

A modern React-based frontend for the CodeGuardian AI-powered code review platform.

## 🚀 Features

- **Dashboard**: Overview of code reviews, metrics, and insights
- **Repository Discovery**: Connect and analyze GitHub repositories
- **AI Code Review**: Get instant code reviews powered by Google Gemini AI
- **Metrics & Analytics**: Track developer activity and commit statistics
- **Modern UI**: Built with React and Tailwind CSS v4

## 📋 Prerequisites

- Node.js 16+ and npm
- Backend services running (see main project README)

## 🛠️ Installation

```bash
# Navigate to the frontend directory
cd frontend/ui_codeai

# Install dependencies
npm install
```

## 🏃 Running the Application

```bash
# Start the development server
npm run dev
```

The frontend will be available at `http://localhost:5173`

## 📁 Project Structure

```
ui_codeai/
├── src/
│   ├── components/          # React components
│   │   ├── Dashboard.jsx    # Dashboard overview
│   │   ├── RepoDiscovery.jsx  # GitHub repository integration
│   │   ├── CodeReview.jsx   # AI code review interface
│   │   └── Metrics.jsx      # Analytics and metrics
│   ├── services/            # API service files
│   │   ├── api.js           # Base API configuration
│   │   ├── repoService.js   # Repository operations
│   │   ├── aiReviewService.js  # AI review operations
│   │   ├── metricsService.js   # Metrics operations
│   │   ├── notificationService.js  # Notifications
│   │   └── insightService.js      # Insights aggregation
│   ├── App.jsx              # Main app component
│   ├── App.css              # Custom styles
│   ├── index.css            # Global styles
│   └── main.jsx             # Application entry point
├── public/                  # Static assets
├── package.json             # Dependencies
└── vite.config.js           # Vite configuration
```

## 🔧 Configuration

### API Endpoints

The frontend connects to these backend services:

- **Repo Service**: `http://localhost:5001/api`
- **AI Review Service**: `http://localhost:5002/api`
- **Metrics Service**: `http://localhost:5003/api`
- **Notification Service**: `http://localhost:5004/notify`
- **Insight Service**: `http://localhost:5005/api`

Update these URLs in `src/services/api.js` if your backend services run on different ports.

### Backend Setup Required

To see real data (instead of demo data), you need to:

1. **Start all backend services**:
   ```bash
   # In separate terminals, start each service
   cd repo-service && npm start
   cd ai-review-service && npm start
   cd metrics-service && npm start
   cd notification-service && npm start
   cd insight-service && npm start
   ```

2. **Configure MySQL database** for metrics service:
   - Create a MySQL database
   - Update `.env` in metrics-service:
     ```
     DB_HOST=localhost
     DB_USER=your_user
     DB_PASSWORD=your_password
     DB_NAME=codeguardian_metrics
     ```
   - Run the schema from `metrics-service/db/schema.sql`

3. **Set up environment variables**:
   - Each service needs its own `.env` file with appropriate API keys
   - See the main project README for details

**Note**: If backend services aren't configured, the frontend will display demo data automatically.

## 📝 Usage

### Dashboard Tab
- View overview of reviews and metrics
- See top developers by commit activity
- Monitor recent AI insights

### Repos Tab
1. Enter a GitHub username
2. Click "Search" to fetch repositories
3. Click "View Commits" on any repository
4. Click "Review Code" on any commit to get AI analysis

### Code Review Tab
1. Paste your code or use the sample code button
2. Click "Review Code"
3. Get instant feedback on security issues, bugs, and improvements

### Metrics Tab
- View developer activity statistics
- See commit counts per developer
- Track overall project metrics

## 🎨 Technologies

- **React 19**: UI framework
- **Tailwind CSS v4**: Utility-first styling
- **Vite**: Build tool and development server
- **ESLint**: Code quality

## 🚢 Building for Production

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 📄 License

This project is part of the CodeGuardian platform.
