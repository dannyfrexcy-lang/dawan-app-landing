#!/bin/bash

echo "🔨 Building Dhawan APK..."
echo ""

# Step 1: Build web app
echo "📦 Step 1: Building web app..."
npm run build
if [ $? -ne 0 ]; then
  echo "❌ Web build failed"
  exit 1
fi
echo "✅ Web build complete"
echo ""

# Step 2: Sync to Android
echo "📱 Step 2: Syncing to Android..."
npx cap sync android
if [ $? -ne 0 ]; then
  echo "❌ Capacitor sync failed"
  exit 1
fi
echo "✅ Capacitor sync complete"
echo ""

# Step 3: Build APK
echo "🔨 Step 3: Building APK..."
cd android
./gradlew assembleRelease
if [ $? -ne 0 ]; then
  echo "❌ APK build failed"
  exit 1
fi
cd ..
echo "✅ APK build complete"
echo ""

# Step 4: Locate APK
APK_PATH="android/app/build/outputs/apk/release/app-release.apk"
if [ -f "$APK_PATH" ]; then
  echo "✅ APK ready at: $APK_PATH"
  echo ""
  echo "📲 To install on device:"
  echo "   adb install -r $APK_PATH"
else
  echo "❌ APK not found at expected location"
  exit 1
fi
