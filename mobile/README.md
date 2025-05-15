# Pregnancy Q&A Mobile App

This is a React Native mobile application for the Pregnancy Q&A platform, providing pregnancy-related information and AI-powered Q&A capabilities.

## Features

- Browse pregnancy topics and resources
- Chat with AI assistant about pregnancy questions
- Save helpful responses for future reference
- Clean, user-friendly interface optimized for mobile

## Prerequisites

- Node.js (v14 or newer)
- npm or yarn
- Expo CLI
- iOS Simulator (for Mac users) or Android Emulator

## Getting Started

1. Install dependencies:
```bash
cd mobile
npm install
```

2. Start the development server:
```bash
npm start
```

3. Use the Expo client on your phone or an emulator to run the app:
   - Scan the QR code with the Expo Go app (Android) or the Camera app (iOS)
   - Press 'a' to open in an Android emulator
   - Press 'i' to open in an iOS simulator

## Project Structure

- `App.js` - Main application file and navigation setup
- `src/screens/` - Main screen components
- `src/services/` - API services for data fetching
- `src/utils/` - Helper functions
- `src/styles.js` - Shared styles

## Backend API Integration

By default, the app attempts to connect to a local backend API at http://localhost:5000/api. In production, you would update the API_URL in `src/services/api.js` to point to your hosted API.

The app includes fallback mock data for offline development or when the API is unavailable.

## Building for Production

To create a standalone app for distribution:

```bash
expo build:android  # For Android
expo build:ios      # For iOS
```

Follow the Expo documentation for detailed instructions on building and publishing your app.

## Notes

This app is designed to complement the existing web application, providing a native mobile experience while utilizing the same backend API.