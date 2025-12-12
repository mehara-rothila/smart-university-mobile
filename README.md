# Smart University Mobile App

A React Native mobile application built with Expo that connects to the Smart University Spring Boot backend.

## Features (Phase 1 - Auth Complete ✅)

### Completed
- ✅ User Authentication (Login, Signup, Logout)
- ✅ Password Reset with OTP (Email-based)
- ✅ JWT Token Management with Secure Storage
- ✅ Auto-logout on 401 (Token Expiry)
- ✅ Modern UI with Custom Components
- ✅ Bottom Tab Navigation
- ✅ User Profile Display

### Coming Soon (Phase 2 & 3)
- 📅 Events Module (Browse, Register, Comments)
- 🏆 Achievements Showcase (Like, Comment, Share)
- 🔍 Lost & Found
- 📚 Books Exchange
- 🔔 Real-time Notifications (WebSocket)
- 🌤️ Weather Widget
- 🤖 AI Chatbot Integration
- 📊 Dashboard with Statistics

## Tech Stack

- **Framework:** Expo (React Native)
- **Navigation:** React Navigation 6 (Stack + Bottom Tabs)
- **State Management:** React Context API
- **API Client:** Axios with interceptors
- **Secure Storage:** Expo SecureStore (for JWT tokens)
- **Data Fetching:** React Query (to be implemented)
- **Styling:** StyleSheet (React Native)

## Prerequisites

Before you begin, ensure you have:

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Expo CLI** (will be installed with dependencies)
- **Expo Go App** on your mobile device (for testing)
  - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
  - [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

## Installation

### 1. Clone/Navigate to the Project

```bash
cd smart-university-mobile
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Copy `.env.example` to `.env` and update with your backend URL:

```bash
cp .env.example .env
```

Edit `.env`:

```env
API_URL=https://your-heroku-app.herokuapp.com/api
WS_URL=wss://your-heroku-app.herokuapp.com/ws
```

**Important:** Replace with your actual Heroku backend URL!

### 4. Start the Development Server

```bash
npm start
```

Or use specific platforms:

```bash
npm run android  # For Android
npm run ios      # For iOS (macOS only)
npm run web      # For Web
```

### 5. Test on Your Device

1. Open **Expo Go** app on your mobile device
2. Scan the QR code displayed in the terminal
3. The app will load on your device

## Project Structure

```
smart-university-mobile/
├── App.js                      # Main entry point
├── babel.config.js             # Babel configuration for env variables
├── .env.example                # Environment variables template
├── src/
│   ├── api/                    # API client and endpoints
│   │   ├── client.js           # Axios instance with JWT interceptors
│   │   ├── auth.js             # Auth endpoints
│   │   └── user.js             # User endpoints
│   ├── components/             # Reusable components
│   │   └── common/             # Common UI components
│   │       ├── Button.js
│   │       ├── Input.js
│   │       ├── Card.js
│   │       ├── LoadingSpinner.js
│   │       └── ErrorMessage.js
│   ├── screens/                # App screens
│   │   ├── auth/               # Authentication screens
│   │   │   ├── LoginScreen.js
│   │   │   ├── SignupScreen.js
│   │   │   ├── ForgotPasswordScreen.js
│   │   │   └── OTPVerificationScreen.js
│   │   ├── home/               # Home screen
│   │   │   └── HomeScreen.js
│   │   └── profile/            # Profile screen
│   │       └── ProfileScreen.js
│   ├── navigation/             # Navigation configuration
│   │   ├── AppNavigator.js     # Root navigator
│   │   ├── AuthNavigator.js    # Auth flow navigator
│   │   └── MainTabNavigator.js # Main app tab navigator
│   ├── context/                # React Context
│   │   └── AuthContext.js      # Authentication context
│   ├── hooks/                  # Custom React hooks
│   ├── utils/                  # Utility functions
│   │   ├── storage.js          # SecureStore wrapper
│   │   ├── constants.js        # App constants
│   │   └── helpers.js          # Helper functions
│   └── theme/                  # Styling theme
│       ├── colors.js           # Color palette
│       └── typography.js       # Typography styles
```

## Usage Guide

### Authentication Flow

#### 1. **Login**
- Open the app → Login screen appears
- Enter username/email and password
- Click "Sign In"
- Upon success, you're redirected to Home

#### 2. **Signup**
- Click "Sign Up" link on Login screen
- Fill in all required fields:
  - Username (min 3 characters)
  - Email (valid format)
  - First Name
  - Last Name
  - Password (min 8 chars, letters + numbers)
  - Confirm Password
- Click "Sign Up"
- Account created and auto-logged in

#### 3. **Forgot Password**
- Click "Forgot Password?" on Login screen
- Enter your registered email
- Click "Send OTP"
- Check your email for 6-digit code
- Enter OTP and new password
- Click "Reset Password"
- Return to Login and sign in

#### 4. **Logout**
- From Home or Profile screen
- Click "Logout" button
- Redirected to Login screen
- All secure data cleared

### Navigation

- **Home Tab:** Dashboard with welcome message and stats
- **Profile Tab:** View your account details

## API Integration

### Backend Endpoints Used

- `POST /api/auth/signin` - User login
- `POST /api/auth/signup` - User registration
- `POST /api/auth/forgot-password` - Request OTP
- `POST /api/auth/reset-password` - Reset password with OTP
- `GET /api/user/profile` - Get user profile

### JWT Token Management

- Tokens stored securely using Expo SecureStore
- Auto-attached to all API requests via Axios interceptor
- Auto-logout on 401 (token expiry)
- Token valid for 24 hours

## Development Tips

### Hot Reload
Changes to JS files trigger automatic reload. Press:
- `r` - Reload app
- `m` - Toggle menu
- `Shift + M` - Toggle performance monitor

### Debugging

1. **Shake device** or press `Cmd+D` (iOS) / `Cmd+M` (Android)
2. Select "Debug Remote JS"
3. Chrome DevTools opens for debugging

### Testing on Different Devices

- **iOS Simulator:** Requires macOS with Xcode
- **Android Emulator:** Requires Android Studio
- **Physical Device:** Use Expo Go app (easiest)

## Troubleshooting

### Common Issues

#### 1. "Network Error" on API calls
**Solution:**
- Check `.env` file has correct API_URL
- Verify backend is running and accessible
- Test backend URL in browser/Postman

#### 2. "Module not found" errors
**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
```

#### 3. Metro bundler cache issues
**Solution:**
```bash
npm start -- --reset-cache
```

#### 4. Expo Go not connecting
**Solution:**
- Ensure phone and computer are on same WiFi
- Try disabling firewall temporarily
- Use tunnel mode: `npm start -- --tunnel`

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `API_URL` | Backend API base URL | `https://your-app.herokuapp.com/api` |
| `WS_URL` | WebSocket URL for notifications | `wss://your-app.herokuapp.com/ws` |

## Backend Requirements

Ensure your Spring Boot backend has:
- CORS enabled for Expo URLs
- JWT authentication working
- Password reset OTP system active
- Email service configured (Brevo SMTP)

## Building for Production

### Android APK

```bash
expo build:android
```

### iOS IPA

```bash
expo build:ios
```

### Using EAS Build (Recommended)

```bash
npm install -g eas-cli
eas build --platform android
eas build --platform ios
```

## Next Steps (Phase 2)

1. Implement Events module
2. Add Achievements showcase
3. Build Lost & Found feature
4. Integrate Books exchange
5. Add WebSocket for notifications
6. Implement push notifications

## Contributing

This is a university project. For questions or issues, contact the development team.

## License

MIT License - Smart University Project

---

**Last Updated:** December 2025
**Version:** 1.0.0 (Phase 1 Complete)
