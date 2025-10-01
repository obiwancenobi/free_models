# Free AI Models Explorer

A modern web application that displays and allows exploration of free AI models available through the OpenRouter API.

**🚀 Live Demo**: https://freemodels.riffcompiler.com

**Note**: This project is an experiment demonstrating the use of the [**Spec Kit**](https://github.com/github/spec-kit) and [**Kilo Code**](https://kilocode.ai) frameworks to build a simple fullstack application. It showcases structured development workflows, from specification to deployment, using AI-assisted coding tools.

## Features

- **Single Page Application**: Fast, responsive interface built with React
- **Real-time Search**: Client-side search through AI models without re-requesting the API
- **Model Details**: Click any model to view detailed information in a bottom sheet
- **Material Design**: Clean, modern UI using Material-UI components
- **Free Models Only**: Filters and displays only free-to-use AI models
- **Multi-Layer Caching**: Three-tier data retrieval (Cache → Database → API) for optimal performance and persistence
- **PostgreSQL Integration**: Persistent storage ensuring data survives application restarts
- **Health Monitoring**: Comprehensive health check endpoints for all system components

## Screenshots

### Dark Theme
![Dark Theme Screenshot](screenshots/dark-theme.png)

### Light Theme
![Light Theme Screenshot](screenshots/light-theme.png)

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Material-UI** for components and theming
- **Axios** for API communication
- **Fuse.js** for fuzzy search functionality
- **React Testing Library** for component testing

### Backend
- **Node.js** with Express
- **PostgreSQL** with pg client for persistent data storage
- **Axios** for external API calls
- **node-cache** for in-memory caching (5-minute TTL)
- **CORS** for cross-origin requests
- **Helmet** for security headers
- **Morgan** for request logging
- **dotenv** for environment variable management
- **Jest** and **Supertest** for testing

## Project Structure

```
free-models/
├── backend/                 # Node.js/Express server
│   ├── Dockerfile          # Backend container configuration
│   ├── package.json        # Backend dependencies and scripts
│   ├── README.md           # Backend API documentation
│   ├── .env.example        # Environment variables template
│   ├── .gitignore          # Git ignore patterns
│   ├── src/
│   │   ├── app.js         # Express application setup
│   │   ├── config/         # Configuration modules
│   │   │   └── database.js # Database connection configuration
│   │   ├── middleware/    # Custom middleware
│   │   │   └── cache.js   # Cache middleware
│   │   ├── routes/        # API endpoints
│   │   │   ├── models.js  # Models API routes
│   │   │   ├── cache.js   # Cache management routes
│   │   │   └── health.js  # Health check endpoints
│   │   ├── services/      # Business logic
│   │   │   ├── modelService.js    # OpenRouter API integration with cache-first + DB fallback
│   │   │   ├── cacheService.js    # Cache management service
│   │   │   └── databaseService.js # PostgreSQL database operations
│   │   └── database/      # Database related files
│   │       └── migrations/ # Database schema migrations
│   │           └── 001_create_ai_models.js # Initial schema creation
│   └── tests/             # Backend tests
│       ├── contract/      # API contract tests
│       │   ├── test-cache-invalidate.js
│       │   └── test-cache-stats.js
│       ├── integration/   # Integration tests
│       │   ├── test-cache-hit.js
│       │   ├── test-cache-miss.js
│       │   ├── test-cache-expiration.js
│       │   └── test-cache-performance.js
│       └── unit/          # Unit tests
│           └── test-cacheService.js
├── frontend/               # React application
│   ├── Dockerfile         # Frontend container configuration
│   ├── nginx.conf         # Nginx configuration for production
│   ├── webpack.config.js  # Webpack configuration for optimization
│   ├── package.json       # Frontend dependencies and scripts
│   ├── src/
│   │   ├── App.tsx        # Main application component
│   │   ├── components/    # React components
│   │   │   ├── ModelCard.tsx     # Individual model display
│   │   │   ├── ModelList.tsx     # Models grid with search
│   │   │   ├── ModelDetails.tsx  # Bottom sheet details
│   │   │   └── SearchBar.tsx     # Search input component
│   │   └── services/      # API services
│   │       └── apiService.ts     # Frontend API client
│   └── tests/             # Frontend tests
│       ├── integration/   # Integration tests
│       └── unit/          # Unit tests
├── specs/                 # Documentation and specifications
│   ├── 001-create-a-web/  # Initial web app feature
│   │   ├── plan.md        # Implementation plan
│   │   ├── research.md    # Technical research
│   │   ├── data-model.md  # Data model documentation
│   │   ├── contracts/     # API contracts
│   │   ├── quickstart.md  # Quick start guide
│   │   └── tasks.md       # Task breakdown
│   └── 004-enable-cache-on/  # Backend caching feature
│       ├── plan.md        # Implementation plan
│       ├── research.md    # Technical research
│       ├── data-model.md  # Data model documentation
│       ├── contracts/     # API contracts
│       ├── quickstart.md  # Quick start guide
│       └── tasks.md       # Task breakdown
├── docker-compose.yml     # Multi-container deployment
├── .gitignore            # Git ignore rules
├── screenshots/          # Application screenshots
│   ├── dark-theme.png    # Dark theme screenshot
│   └── light-theme.png   # Light theme screenshot
└── README.md             # This file
├── backend/.env          # Backend environment variables (API keys)
└── frontend/.env         # Frontend environment variables (API URLs)
```

## Prerequisites

- Node.js 18 or higher
- npm or yarn package manager
- OpenRouter API key (optional for development)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd free-models
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Environment setup**
     ```bash
     # Create .env file in backend directory
     cd ../backend
     cat > .env << EOF
     # OpenRouter API Configuration
     OPENROUTER_API_KEY=your_openrouter_api_key_here

     # Server Configuration
     PORT=3001
     NODE_ENV=development

     # CORS Configuration (for development)
     ALLOWED_ORIGINS=http://localhost:3000

     # Database Configuration (PostgreSQL)
     DATABASE_URL=postgresql://username:password@hostname:port/database_name
     DB_SSL=require
     DB_MAX_CONNECTIONS=10
     EOF

    # Create .env file in frontend directory (for local development)
    cd ../frontend
    cat > .env << EOF
    REACT_APP_API_URL=http://localhost:3001
    EOF
    ```

    **Note**: Get your OpenRouter API key from [OpenRouter Dashboard](https://openrouter.ai/keys). In production, set `OPENROUTER_API_KEY` in Coolify's environment variables.

## Running the Application

### Development Mode

1. **Start the backend server**
   ```bash
   cd backend
   npm run dev
   ```
   Server will run on http://localhost:3001

2. **Start the frontend development server**
   ```bash
   cd frontend
   npm start
   ```
   Application will open at http://localhost:3000

### Production Build

1. **Build the frontend**
   ```bash
   cd frontend
   npm run build
   ```

2. **Start the backend in production**
   ```bash
   cd backend
   npm start
   ```

### Docker Deployment

1. **Using Docker Compose (Recommended)**
    ```bash
    # Build and start all services
    docker-compose up --build

    # Or run in background
    docker-compose up -d --build
    ```

2. **Database Setup (New Requirement)**
    ```bash
    # Run database migration to create ai_models table
    cd backend/src/database/migrations
    node 001_create_ai_models.js
    ```

3. **Access the application**
    - Frontend: http://localhost
    - Backend API: http://localhost:3001
    - Health checks:
      - Overall: http://localhost:3001/health
      - Database: http://localhost:3001/health/database
      - Cache: http://localhost:3001/health/cache
      - Models: http://localhost:3001/health/models

3. **Stop the application**
    ```bash
    docker-compose down
    ```

### Coolify Deployment

1. **Prerequisites**
    - Coolify installed on your VPS
    - GitHub repository connected to Coolify
    - Custom domain (optional, but recommended)

2. **Deploy via Coolify Dashboard**
    - Create a new project from your GitHub repository
    - Select "Docker Compose" as the build type
    - Set environment variables:
      - `OPENROUTER_API_KEY`: Your OpenRouter API key
    - Configure custom domain (e.g., `freemodels.riffcompiler.com`)
    - Deploy
    
    3. **Access the application**
    - Frontend: Your configured domain (e.g., `https://freemodels.riffcompiler.com`)
    - Backend API: Proxied through frontend (internal only)
    - Health check: Internal health checks handled by Coolify

4. **Post-Deployment Notes**
    - SSL certificates are auto-provisioned via Let's Encrypt
    - API calls are proxied through Nginx in the frontend container
    - Backend runs on internal port 3001, not exposed externally
    - Monitor logs in Coolify dashboard for any issues

### Manual Docker Build

```bash
# Build backend
cd backend
docker build -t free-models-backend .

# Build frontend
cd ../frontend
docker build -t free-models-frontend .

# Run containers
docker run -p 3001:3001 -e OPENROUTER_API_KEY=your_key free-models-backend
docker run -p 80:80 free-models-frontend
```

## Usage

1. **Browse Models**: The main page displays all available free AI models
2. **Search**: Use the search bar to filter models by name, description, or provider
3. **View Details**: Click on any model card to open a detailed view in a bottom sheet
4. **Close Details**: Click the close button or click outside the bottom sheet to close

## API Endpoints

### Backend API

**Base URL**: `http://localhost:3001` (development) / Proxied through frontend (production)

#### Models
- `GET /api/models`
  - **Description**: Retrieve all free AI models with three-tier data retrieval
  - **Response**: Array of model objects with pricing, capabilities, and metadata
  - **Filtering**: Automatically filters for free models only (pricing.prompt = 0)
  - **Data Flow**: Cache → Database → OpenRouter API (cache-first with persistence)
  - **Performance**: <50ms cache hits, <200ms database hits, <2000ms API fallback

- `GET /api/models/:id`
  - **Description**: Retrieve detailed information for a specific model
  - **Parameters**: `id` (string) - Model identifier
  - **Response**: Single model object with full details
  - **Data Flow**: Same three-tier approach as models list
  - **Performance**: Same performance characteristics as models list

#### Cache Management
- `POST /api/cache/invalidate`
  - **Description**: Invalidate cache entries
  - **Authentication**: Bearer token required
  - **Request Body**: `{ "key": "optional-cache-key" }`
  - **Response**: Success confirmation with invalidated keys

- `GET /api/cache/stats`
  - **Description**: Get cache performance statistics
  - **Authentication**: Bearer token required
  - **Response**: Cache hit ratio, entry count, size information

#### Health Check
- `GET /health`
  - **Description**: Overall application health check
  - **Response**: Application status, uptime, version information

- `GET /health/database`
  - **Description**: Database connectivity health check
  - **Response**: Database connection status, pool information, error details

- `GET /health/cache`
  - **Description**: Cache system health check
  - **Response**: Cache statistics, hit ratio, memory usage

- `GET /health/models`
  - **Description**: Models service health (cache + database + API)
  - **Response**: End-to-end models service status and performance metrics

### External APIs

- **OpenRouter Models API**: `https://openrouter.ai/api/v1/models`
  - Used by backend to fetch model catalog
  - Requires API key authentication
  - Returns comprehensive model information including pricing and capabilities

### Response Format

```json
{
  "data": [
    {
      "id": "gpt-3.5-turbo",
      "name": "GPT-3.5 Turbo",
      "description": "Fast and efficient model by OpenAI",
      "provider": "OpenAI",
      "pricing": {
        "prompt": 0,
        "completion": 0
      },
      "context_length": 4096,
      "supported_features": ["chat", "completion"]
    }
  ]
}
```

## Testing

The application follows Test-Driven Development (TDD) principles with comprehensive test coverage.

### Backend Tests
```bash
cd backend
npm test
```

**Test Structure:**
- **Contract Tests** (`tests/contract/`): API contract validation
- **Integration Tests** (`tests/integration/`): End-to-end API testing
- **Unit Tests**: Service layer testing

### Frontend Tests
```bash
cd frontend
npm test
```

**Test Structure:**
- **Unit Tests** (`tests/unit/`): Component testing with React Testing Library
- **Integration Tests** (`tests/integration/`): User interaction testing
- **Component Tests**: ModelCard, SearchBar, ModelList, ModelDetails

### Test Coverage

**Backend:**
- API endpoint testing with Supertest
- Service layer testing
- Error handling validation
- Contract compliance testing

**Frontend:**
- Component rendering and interactions
- User event simulation
- API integration testing
- Search functionality testing
- Bottom sheet behavior testing

### Running Specific Test Suites

```bash
# Backend contract tests
cd backend && npm test -- tests/contract/

# Frontend unit tests
cd frontend && npm test -- --testPathPattern=unit

# Frontend integration tests
cd frontend && npm test -- --testPathPattern=integration
```

### Test Configuration

- **Jest**: Test runner for both frontend and backend
- **React Testing Library**: Frontend component testing
- **Supertest**: Backend API testing
- **Test Coverage**: Configured for both projects

## Development Guidelines

### Code Style
- Use ESLint for code linting
- Follow React best practices
- Use TypeScript for type safety
- Write tests for all new features

### Git Workflow
- Create feature branches from `main`
- Use descriptive commit messages
- Write tests before implementing features (TDD)
- Ensure all tests pass before merging

### API Design
- RESTful endpoints with Express.js
- JSON responses with consistent error format
- Proper error handling with HTTP status codes
- CORS enabled for development
- Input validation and sanitization
- Security headers with Helmet.js

### Performance Optimizations

**Frontend:**
- Code splitting with React.lazy (future enhancement)
- Bundle analysis with webpack-bundle-analyzer
- Material-UI tree shaking for smaller bundles
- Client-side search with Fuse.js for instant filtering
- Responsive grid layout with CSS Grid

**Backend:**
- Lightweight Express.js server
- Efficient JSON parsing
- Request logging with Morgan
- Security middleware (Helmet, CORS)
- Health check endpoints for monitoring (/, /database, /cache, /models)
- **Multi-layer caching**: Cache-first → Database → API fallback
- **PostgreSQL integration**: Persistent storage with connection pooling
- **Graceful degradation**: Continues working even if database unavailable
- **Performance monitoring**: Response time tracking across all data sources

### Architecture Overview

```
┌─────────────────┐    HTTP     ┌─────────────────┐    API     ┌─────────────────┐
│   React App     │ ──────────► │   Express API   │ ─────────► │   OpenRouter     │
│                 │             │                 │            │   API            │
│ • ModelList     │             │ • /api/models   │            │ • /v1/models     │
│ • SearchBar     │             │ • modelService  │            │                 │
│ • ModelDetails  │             │ • cacheService  │            │                 │
│ • API Service   │             │ • databaseSvc   │            │                 │
└─────────────────┘             └─────────────────┘            └─────────────────┘
                                ↕
                           ┌─────────────────┐
                           │   PostgreSQL    │
                           │   Database      │
                           │   (Persistent)  │
                           └─────────────────┘
```

**Data Flow (Cache-First with Persistence):**
1. React app loads → fetches models from backend
2. **Cache Check** (<50ms): Backend checks in-memory cache first
3. **Cache Hit**: Returns cached data immediately
4. **Cache Miss** → **Database Check** (<200ms): Queries PostgreSQL for stored models
5. **Database Hit**: Updates cache and returns data
6. **Database Miss** → **API Fallback** (<2000ms): Fetches from OpenRouter API
7. **Store & Cache**: Saves fresh data to database and cache for future requests
8. Models filtered for free pricing only
9. Frontend displays models in responsive grid
10. User searches → client-side filtering with Fuse.js
11. User clicks model → bottom sheet opens with details

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write tests for new features
5. Ensure all tests pass
6. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [OpenRouter](https://openrouter.ai/) for providing the AI models API
- [Material-UI](https://mui.com/) for the component library
- [React](https://reactjs.org/) for the frontend framework
- [Express](https://expressjs.com/) for the backend framework

## Support

If you encounter any issues or have questions:

1. Check the troubleshooting section in the quickstart guide
2. Review the API documentation
3. Open an issue on GitHub
4. Contact the development team

## Development Workflow

This project was developed using the **Spec Kit** and **Kilo Code** frameworks, following a structured approach:

### Phases Completed:
1. **Specification** (`/specify` command): Feature requirements and acceptance criteria
2. **Planning** (`/plan` command): Technical architecture and implementation strategy
3. **Task Breakdown** (`/tasks` command): Detailed task list with dependencies
4. **Implementation** (`/implement` command): Phase-by-phase code development
5. **Testing**: TDD approach with comprehensive test coverage

### Key Artifacts:
- **Initial Feature Spec**: `specs/001-create-a-web/spec.md`
- **Cache Feature Spec**: `specs/004-enable-cache-on/spec.md`
- **PostgreSQL Integration**: `specs/006-update-get-ai-model-list-from-existing-openrouter-api-to-postgresql-database/`
  - Complete implementation plan, research, and task breakdown
  - Database schema design and migration scripts
  - API contracts and testing scenarios
- **Implementation Plans**: `specs/*/plan.md`
- **Task Breakdowns**: `specs/*/tasks.md`
- **API Contracts**: `specs/*/contracts/*.md`
- **Research Findings**: `specs/*/research.md`

### Quality Assurance:
- ✅ **AI-Assisted Development**: Built using Kilo Code for efficient, guided implementation
- ✅ **Specification-Driven**: Requirements defined with Spec Kit for clear project structure
- ✅ **Test-Driven Development**: Tests written before implementation
- ✅ **Type Safety**: TypeScript for frontend components
- ✅ **Code Quality**: ESLint configuration
- ✅ **Documentation**: Comprehensive API and component docs
- ✅ **Performance**: Bundle optimization and analysis
- ✅ **Security**: Helmet.js, CORS, input validation
- ✅ **Deployment**: Docker containerization and Coolify deployment ready

## Troubleshooting

### Common Issues

**API Key Issues:**
```bash
# Check if .env file exists
ls -la backend/.env

# Verify API key format
cat backend/.env
```

**Port Conflicts:**
```bash
# Check what's using ports
lsof -i :3000
lsof -i :3001

# Kill process if needed
kill -9 <PID>
```

**CORS Errors:**
- Ensure backend is running on port 3001
- Check CORS configuration in backend/src/app.js
- Verify frontend API calls point to correct backend URL

**Build Errors:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear npm cache
npm cache clean --force
```

### Performance Monitoring

**Frontend Bundle Analysis:**
```bash
cd frontend
npm run build
# Check build/static/js/ for bundle sizes
```

**API Performance:**
- Monitor response times in browser dev tools
- Check backend logs for slow requests
- Use `/health` endpoint for service monitoring

---

**Note**: This application is for educational and demonstration purposes. Make sure to comply with OpenRouter's terms of service when using their API.