# 📦 ChurchLink Intercom - Installation & Build Guide

This guide will help you build and install ChurchLink Intercom as a **Windows Desktop App (.exe)** and an **Android App (.apk)**.

---

## 🚀 Automatic Builds (GitHub Actions)

This project is configured to build automatically every time you push code to GitHub.

1. Push your code to your GitHub repository.
2. Go to the **Actions** tab in your repository.
3. Once the "Build EXE and APK" workflow finishes, click on the run.
4. Scroll down to **Artifacts** to download your ready-to-use `.exe` and `.apk` files!

---

## 🖥️ Windows Desktop App (.exe)

The Windows app will act as both the client AND the server. When you open it, it automatically starts the intercom server on your local network.

### Prerequisites
1. Install [Node.js](https://nodejs.org/) (Recommended: LTS version).
2. Download the source code (Export to ZIP or GitHub).

### Steps to Build
1. Open your terminal (Command Prompt or PowerShell) in the project folder.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build and package the application:
   ```bash
   npm run electron:build
   ```
4. Once finished, find the installer in the `/release` folder.
   - Run `ChurchLink Intercom Setup.exe` to install it on any Windows PC.

---

## 📱 Android App (.apk)

The Android app is a client that connects to your local Windows server over WiFi.

### Prerequisites
1. [Android Studio](https://developer.android.com/studio) installed.
2. Capactior CLI installed (`npm install -g @capacitor/cli`).

### Steps to Build
1. Open terminal in the project folder.
2. Build the web project:
   ```bash
   npm run build
   ```
3. Sync Capacitor with the Android project:
   ```bash
   npx cap add android
   npx cap copy
   npx cap open android
   ```
4. Android Studio will open the project.
5. In Android Studio:
   - Go to **Build > Build Bundle(s) / APK(s) > Build APK(s)**.
   - Once compiled, a notification will show a "locate" link to find your `.apk` file.
6. Transfer the `.apk` to your phone and install it.

---

## 📡 Local LAN Setup (Critical)

1. **Server PC**: Open your Windows app. It will show a list of IP addresses (e.g., `192.168.1.15`).
2. **Android Phones**: 
   - Ensure the phone is on the **SAME WiFi** as the server PC.
   - Enter the server's IP address when prompted (or if you configured auto-discovery).
3. **Firewall**: Ensure the Windows app is allowed through your Firewall so other devices can "talk" to it.

---

## 🛠️ Performance Tips
- Use a dedicated WiFi router for the church technical team to ensure zero lag.
- If audio is choppy, decrease the distance from the router.
- Always use the **"JCTGBTG"** system password to login.
