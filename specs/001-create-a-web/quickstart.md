# Quick Start Guide: AI Models Web App

## Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- OpenRouter API key (optional for development)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd free-models
   ```

2. **Install dependencies**
   ```bash
   # Backend dependencies
   cd backend
   npm install

   # Frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Environment setup**
   ```bash
   # Create .env file in backend directory
   echo "OPENROUTER_API_KEY=your_api_key_here" > backend/.env
   ```

## Running the Application

1. **Start the backend server**
   ```bash
   cd backend
   npm start
   ```
   Server will run on http://localhost:3001

2. **Start the frontend development server**
   ```bash
   cd frontend
   npm start
   ```
   Application will open at http://localhost:3000

## Testing the Application

### Manual Testing Steps

1. **Verify initial load**
   - Open http://localhost:3000
   - Wait for models to load
   - Confirm list displays AI models

2. **Test search functionality**
   - Type in search box (e.g., "GPT")
   - Verify list filters in real-time
   - Check that filtering happens without new API calls

3. **Test model details**
   - Click on any model in the list
   - Verify bottom sheet opens
   - Check that all model details are displayed
   - Close bottom sheet and verify it closes properly

4. **Test error handling**
   - Disconnect internet or use invalid API key
   - Verify error message displays
   - Test retry functionality if implemented

### Expected Behavior

- **Loading state**: Spinner or skeleton while fetching models
- **Search**: Instant filtering, case-insensitive, fuzzy matching
- **Bottom sheet**: Smooth animation, full details, close on outside click
- **Responsive**: Works on mobile, tablet, and desktop
- **Performance**: Fast initial load (<2s), smooth interactions

## Development

### Project Structure
```
free-models/
├── backend/          # Node.js/Express server
│   ├── src/
│   │   ├── routes/
│   │   └── services/
│   └── tests/
├── frontend/         # React application
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── services/
│   └── tests/
└── specs/           # Documentation
```

### Key Files
- `backend/src/routes/models.js` - API endpoint for models
- `frontend/src/App.js` - Main React application
- `frontend/src/components/ModelList.js` - Models list component
- `frontend/src/components/ModelDetails.js` - Bottom sheet component

## Troubleshooting

### Common Issues

1. **API Key Issues**
   - Ensure OPENROUTER_API_KEY is set in backend/.env
   - Check API key validity

2. **Port Conflicts**
   - Backend runs on 3001, frontend on 3000
   - Change ports in package.json if needed

3. **CORS Errors**
   - Backend should have CORS enabled for development
   - Check browser console for CORS-related errors

4. **Build Errors**
   - Ensure all dependencies are installed
   - Clear node_modules and reinstall if issues persist

### Performance Tips

- Use browser dev tools to monitor network requests
- Check React dev tools for component re-renders
- Monitor bundle size with build analyzer
- Test on slow connections using browser throttling