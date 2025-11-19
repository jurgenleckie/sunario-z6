# Sunario Weather Forecast - Expo React Native App

This is the Expo/React Native version of the Sunario weather forecast app.

## Setup Instructions

1. Install Expo CLI globally (if you haven't already):
\`\`\`bash
npm install -g expo-cli
\`\`\`

2. Create a new Expo project:
\`\`\`bash
expo init sunario-app --template blank-typescript
cd sunario-app
\`\`\`

3. Install required dependencies:
\`\`\`bash
npx expo install expo-location expo-constants expo-font
npm install nativewind
npm install --save-dev tailwindcss@3.3.2
npm install react-navigation @react-navigation/native @react-navigation/bottom-tabs
npx expo install react-native-screens react-native-safe-area-context
npm install @react-native-async-storage/async-storage
npm install react-native-svg
\`\`\`

4. Copy all files from this expo-app folder into your new Expo project, replacing existing files

5. Run the app:
\`\`\`bash
npx expo start
\`\`\`

## Project Structure

\`\`\`
sunario-app/
├── app/                    # App screens
│   ├── index.tsx          # No shifts screen
│   ├── location.tsx       # Location permission screen
│   ├── shift.tsx          # Shift detail screen
│   └── settings.tsx       # Settings screen
├── components/            # Reusable components
│   ├── TabButton.tsx     # Tab navigation button
│   └── IOSPicker.tsx     # iOS-style picker
├── services/             # API and data services
│   └── weather.ts        # Weather API integration
├── utils/                # Utility functions
│   └── shiftDetection.ts # Shift detection logic
├── types/                # TypeScript types
│   └── index.ts          # Shared types
├── app.json              # Expo configuration
├── package.json          # Dependencies
└── tailwind.config.js    # NativeWind configuration
\`\`\`

## Features

- Location-based weather forecasting
- Temperature shift detection (rise/drop)
- Customizable settings (minimum shift, look ahead days, etc.)
- iOS-style UI with smooth animations
- Pull-to-refresh functionality
- Persistent settings using AsyncStorage

## API Integration

The app uses OpenWeatherMap API by default. To use a different provider:
1. Edit `services/weather.ts`
2. Replace the API calls with your preferred weather service
3. Update the data mapping in the `fetchWeatherData` function
