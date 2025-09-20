# Data Model: Add Dynamic Theme

## Theme Entity
Represents the visual theme configuration for the application.

**Fields:**
- `type`: ThemeType (enum: 'light', 'dark', 'system')
- `current`: string (actual theme applied: 'light' or 'dark')
- `systemPreference`: string (detected system theme: 'light' or 'dark')

**Validation Rules:**
- `type` must be one of: 'light', 'dark', 'system'
- `current` must be 'light' or 'dark'
- `systemPreference` must be 'light' or 'dark'

**State Transitions:**
- When `type` = 'system': `current` = `systemPreference`
- When `type` = 'light': `current` = 'light'
- When `type` = 'dark': `current` = 'dark'

## UserPreference Entity
Represents persisted user theme preferences.

**Fields:**
- `themeType`: ThemeType (user's chosen theme type)
- `lastUpdated`: Date (timestamp of last preference change)

**Validation Rules:**
- `themeType` must be valid ThemeType enum
- `lastUpdated` must be valid date

**Relationships:**
- UserPreference affects Theme entity state
- Persisted in localStorage as JSON

## Theme Context (Runtime)
Manages theme state across the React application.

**State:**
- `theme`: Theme entity
- `isSystemTheme`: boolean (true if following system)

**Actions:**
- `setThemeType(type: ThemeType)`: Update theme type
- `toggleTheme()`: Switch between light/dark (if not system)
- `updateSystemPreference(preference: string)`: Handle system changes

**Selectors:**
- `getCurrentTheme()`: Returns 'light' or 'dark'
- `getThemeType()`: Returns current ThemeType
- `isFollowingSystem()`: Returns boolean

## CSS Variables Schema
Theme values stored as CSS custom properties on :root.

**Light Theme Variables:**
```css
--theme-background: #ffffff;
--theme-foreground: #000000;
--theme-primary: #007bff;
--theme-secondary: #6c757d;
```

**Dark Theme Variables:**
```css
--theme-background: #121212;
--theme-foreground: #ffffff;
--theme-primary: #0d6efd;
--theme-secondary: #6c757d;
```

**Usage in Components:**
```css
background-color: var(--theme-background);
color: var(--theme-foreground);