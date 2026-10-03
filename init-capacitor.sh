#!/bin/bash

echo "🚀 Initializing Capacitor for Dhawan..."
echo ""

# Step 1: Add Android platform
echo "📱 Adding Android platform..."
npx cap add android
if [ $? -ne 0 ]; then
  echo "❌ Failed to add Android platform"
  exit 1
fi
echo "✅ Android platform added"
echo ""

# Step 2: Build web app
echo "📦 Building web app..."
npm run build
if [ $? -ne 0 ]; then
  echo "❌ Web build failed"
  exit 1
fi
echo "✅ Web build complete"
echo ""

# Step 3: Sync to Android
echo "🔄 Syncing to Android..."
npx cap sync android
if [ $? -ne 0 ]; then
  echo "❌ Capacitor sync failed"
  exit 1
fi
echo "✅ Capacitor sync complete"
echo ""

echo "✅ Capacitor initialized successfully!"
echo ""
echo "Next steps:"
echo "1. Install Android Studio from https://developer.android.com/studio"
echo "2. Set up Android SDK and emulator"
echo "3. Run: npm run build:apk"
echo ""
