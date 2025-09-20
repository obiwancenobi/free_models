# Quickstart: Add Dynamic Theme

## Prerequisites
- Application running on `http://localhost:3000` (frontend)
- Modern browser with CSS custom properties support
- System theme detection capability

## Test Scenarios

### Scenario 1: System Theme Detection
1. **Setup**: Ensure system theme is set to dark mode
2. **Action**: Open the application in browser
3. **Expected**: Application displays in dark theme automatically
4. **Verify**: Check CSS variables on `:root` element show dark theme values

### Scenario 2: Manual Theme Switching
1. **Setup**: Application loaded with any theme
2. **Action**: Click the theme toggle icon in top-right corner
3. **Expected**: Theme switches between light and dark instantly
4. **Verify**: Visual change occurs without page reload

### Scenario 3: Theme Persistence
1. **Setup**: Manually switch to a specific theme
2. **Action**: Refresh the browser page
3. **Expected**: Selected theme persists across reload
4. **Verify**: Theme remains as manually selected, not system default

### Scenario 4: System Theme Change Handling
1. **Setup**: Set theme to "system" mode
2. **Action**: Change system theme preference
3. **Expected**: Application theme updates automatically
4. **Verify**: Theme matches new system preference without manual intervention

### Scenario 5: Icon Button Responsiveness
1. **Setup**: Resize browser window to mobile size
2. **Action**: Check theme toggle button position
3. **Expected**: Button remains accessible and properly positioned
4. **Verify**: Button doesn't overlap other UI elements on small screens

## Manual Testing Checklist
- [ ] Theme switches work on all pages
- [ ] No layout shifts during theme changes
- [ ] Button is keyboard accessible (Tab navigation)
- [ ] Button has proper ARIA labels
- [ ] Theme preference survives browser restart
- [ ] Works in incognito/private browsing mode
- [ ] Performance: Theme switch completes in <50ms

## Automated Test Commands
```bash
# Run theme-related unit tests
npm test -- --testPathPattern=theme

# Run integration tests
npm run test:integration

# Run visual regression tests
npm run test:visual
```

## Troubleshooting
- **Theme not switching**: Check browser console for JavaScript errors
- **Persistence not working**: Verify localStorage is not disabled
- **System theme not detected**: Check browser supports `prefers-color-scheme` media query
- **Button not visible**: Ensure CSS positioning is correct and z-index is high enough