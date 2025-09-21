# Data Model: Google Analytics Integration

## Overview
The Google Analytics integration does not require persistent data storage on the application side. All tracking data is sent directly to Google Analytics servers. This document outlines the event structures used for tracking.

## Event Types

### Page View Events
- **Type**: Automatic
- **Trigger**: Route changes via React Router
- **Data**: Page path, title (handled by react-ga4)

### Custom Events
- **Type**: Manual tracking
- **Structure**:
  ```typescript
  interface TrackingEvent {
    action: string;        // e.g., 'search', 'model_select', 'theme_toggle'
    category: string;      // e.g., 'engagement', 'navigation'
    label?: string;        // optional parameter, e.g., search term, model ID
    value?: number;        // optional numeric value
  }
  ```

## Event Categories

### Engagement Events
- **search**: User performs a search
  - Parameters: search_term (string)
- **model_select**: User clicks on a model card
  - Parameters: model_id (string)
- **theme_toggle**: User changes theme
  - Parameters: theme (string: 'light' | 'dark')

### Navigation Events
- **button_click**: General button interactions
  - Parameters: button_name (string)

## Validation Rules
- All events must be sent asynchronously to avoid blocking UI
- Events should not include personal user data
- Event names follow GA4 conventions (snake_case)
- Parameters are limited to relevant contextual data

## Error Handling
- GA failures should not throw errors
- Use console warnings in development for debugging
- Graceful degradation when GA is unavailable