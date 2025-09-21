# Quickstart: Google Analytics Integration Testing

## Prerequisites
- Google Analytics 4 property set up with measurement ID
- Development environment with React app running
- Access to GA real-time reports for verification

## Test Scenarios

### 1. Page View Tracking
**Steps**:
1. Navigate to the application homepage
2. Check GA real-time reports for page view event
3. Navigate to different routes (if applicable)
4. Verify each route change triggers a page view

**Expected**: Page views appear in GA real-time dashboard

### 2. Search Event Tracking
**Steps**:
1. Enter a search term in the search bar
2. Submit the search
3. Check GA real-time events for 'search' event
4. Verify event parameters include the search term

**Expected**: Custom event 'search' with search_term parameter

### 3. Model Selection Tracking
**Steps**:
1. Browse to a model listing page
2. Click on a model card
3. Check GA events for 'model_select' event
4. Verify model_id parameter is included

**Expected**: Custom event 'model_select' with model_id parameter

### 4. Theme Toggle Tracking
**Steps**:
1. Click the theme toggle button
2. Check GA events for 'theme_toggle' event
3. Verify theme parameter ('light' or 'dark')

**Expected**: Custom event 'theme_toggle' with theme parameter

### 5. Ad Blocker Handling
**Steps**:
1. Enable ad blocker extension
2. Perform various interactions (search, clicks)
3. Verify application continues to function normally
4. Check browser console for any GA-related errors

**Expected**: No application errors, graceful degradation

## Development Testing
- Use GA debug mode in development
- Check browser network tab for GA requests
- Verify events in GA debug console
- Test with GA blocked (simulate ad blocker)

## Validation Checklist
- [ ] Page views tracked automatically
- [ ] All custom events fire correctly
- [ ] Parameters included in events
- [ ] No personal data sent
- [ ] App works with GA blocked
- [ ] Performance impact minimal