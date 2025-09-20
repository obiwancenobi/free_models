# Free AI Models Explorer

A modern web application that displays and allows exploration of free AI models available through the OpenRouter API.

## Features

- **Single Page Application**: Fast, responsive interface built with React
- **Real-time Search**: Client-side search through AI models without re-requesting the API
- **Model Details**: Click any model to view detailed information in a bottom sheet
- **Material Design**: Clean, modern UI using Material-UI components
- **Free Models Only**: Filters and displays only free-to-use AI models

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Material-UI** for components and theming
- **Axios** for API communication
- **Fuse.js** for fuzzy search functionality
- **React Testing Library** for component testing

### Backend
- **Node.js** with Express
- **Axios** for external API calls
- **CORS** for cross-origin requests
- **Helmet** for security headers
- **Morgan** for request logging
- **Jest** and **Supertest** for testing

## Project Structure

```
free-models/
├── backend/                 # Node.js/Express server
│   ├── src/
│   │   ├── routes/         # API endpoints
│   │   └── services/       # Business logic
│   └── tests/              # Backend tests
│       ├── contract/       # API contract tests
│       ├── integration/    # Integration tests
│       └── unit/           # Unit tests
├── frontend/                # React application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   └── services/       # API services
│   └── tests/              # Frontend tests
│       ├── integration/    # Integration tests
│       └── unit/           # Unit tests
├── specs/                  # Documentation and specifications
└── README.md               # This file
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
   echo "OPENROUTER_API_KEY=your_api_key_here" > .env
   ```

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

## Usage

1. **Browse Models**: The main page displays all available free AI models
2. **Search**: Use the search bar to filter models by name, description, or provider
3. **View Details**: Click on any model card to open a detailed view in a bottom sheet
4. **Close Details**: Click the close button or click outside the bottom sheet to close

## API Endpoints

### Backend API

- `GET /api/models` - Retrieve all free AI models from OpenRouter

### External APIs

- OpenRouter API: https://openrouter.ai/api/v1/models

## Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

### Integration Tests
```bash
cd frontend
npm run test:integration
```

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
- RESTful endpoints
- JSON responses
- Proper error handling
- CORS enabled for development

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

---

**Note**: This application is for educational and demonstration purposes. Make sure to comply with OpenRouter's terms of service when using their API.