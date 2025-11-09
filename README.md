# Wishlist.AI

A Christmas wishlist management app built with React Native and Expo.

## Features

- 🎄 Christmas-themed gift wishlists
- 👥 Friends and group wishlists  
- 🤖 AI-powered gift suggestions
- 📱 Cross-platform mobile app
- 🔐 Google Sign-In authentication

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- iOS Simulator (for iOS development)
- Android Studio/Emulator (for Android development)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd Wishlist.AI

# Install dependencies
npm install

# Start the development server
npm start
```

### Development Build (Required for Google Sign-In)

**Important**: Google Sign-In authentication requires using an Expo Development Client, not Expo Go.

```bash
# For iOS
npm run ios

# For Android  
npm run android
```

This will build and install the development client on your device/simulator.

## Available Scripts

- `npm start` - Start Expo development server
- `npm run ios` - Run on iOS with Dev Client
- `npm run android` - Run on Android with Dev Client
- `npm run web` - Run on web browser
- `npm run typecheck` - Run TypeScript type checking
- `npm run lint` - Run ESLint with zero warnings
- `npm run doctor` - Run Expo project health check
- `npm run depcheck` - Check for unused dependencies
- `npm run prune` - Dedupe and clean dependencies

## Code Quality

This project includes comprehensive tooling for code quality:

- **TypeScript**: Strict type checking enabled
- **ESLint**: React Native best practices enforcement
- **Prettier**: Consistent code formatting
- **CI/CD**: Automated checks on GitHub Actions

## Project Structure

```
├── screens/          # Screen components
├── components/       # Reusable UI components  
├── services/         # Business logic and API services
├── contexts/         # React contexts
├── assets/           # Images and static assets
└── firebase.js       # Firebase configuration
```

## Authentication

Google Sign-In is configured and requires:
1. A Development Client build (not Expo Go)
2. Proper Google Cloud Console setup
3. Environment variables for OAuth credentials

## Deployment

### EAS Build

```bash
# Build for production
npx eas build --platform ios
npx eas build --platform android
```

### EAS Submit

```bash
# Submit to app stores
npx eas submit --platform ios
npx eas submit --platform android
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting: `npm run lint && npm run typecheck`
5. Submit a pull request

## License

© 2025 Christmas Wishlist App
