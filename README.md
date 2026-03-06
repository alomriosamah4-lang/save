# Secure Vault App — Setup & Troubleshooting

هذا المستودع يحتوي على تطبيق React Native (TypeScript) مع مكوّنات native أندرويد لأمن التخزين.

الهدف هنا هو توثيق خطوات إعداد البيئة وحل مشاكل شائعة مثل خطأ npm المكسور الذي قد يظهر على Windows.

## تعليمات إعداد سريعة

1. ثبّت Node.js (LTS) من https://nodejs.org ويفضل الإصدار 18+. على Windows استخدم المثبّت الرسمي أو `nvm-windows`.
2. ثبّت Java JDK 17 وAndroid SDK/NDK (راجع الوثائق في `/docs/SETUP_NATIVE.md`).
3. في مجلد المشروع ثبّت الحزم:

```powershell
cd "D:\programming\React projects\safe folder"
npm install
```

4. شغّل Metro ثم التطبيق:

```powershell
npm run start
npm run android
```

## خطأ شائع: "Cannot find module 'http-cache-semantics'"

هذا الخطأ يعني أن تثبيت `npm` نفسه (الحزمة العالمية داخل `%AppData%\npm`) تالف. خطوات الإصلاح الموصى بها:

- تنظيف الكاش ثم إعادة محاولة:

```powershell
npm cache clean --force
npm install
```

- إذا لم ينجح: محاولة تفعيل Corepack وإعداد npm حديث:

```powershell
corepack enable
corepack prepare npm@latest --activate
npm -v
```

- إن بقي الخطأ، قم بإعادة تثبيت Node.js (إصلاح أو إزالة/تنصيب جديد). على Windows نزّل مثبت LTS وأعد تشغيل المثبّت.

## فحص تلقائي (تشخيص)

يمكن تشغيل `scripts/check-node-npm.ps1` لتشخيص الإصدارات وحالة npm محليًا.

## ملاحظات متعلقة بالمشروع
- أضفت تبعيات حيوية لـ React Navigation في `package.json` (`react-native-gesture-handler`, `react-native-reanimated`, `react-native-screens`, `react-native-safe-area-context`).
- بالنسبة للأندرويد، الـ Gradle wrapper يُنشأ أو يُولَّد في CI؛ قمت بإضافة سكريبتات مساعدة لكن إذا أردت أدرج `gradle-wrapper.jar` محليًا.

إذا أردت، أستطيع محاولة إصلاح بيئتك محليًا أو توليد تعليمات CI كاملة لإجراء الاختبارات الآلية.
# Secure Vault App - Scaffold

This repo contains an initial scaffold for the Secure Vault App (React Native + TypeScript).

Quick start:

1. Install dependencies

```bash
npm install
```

2. Run Metro

```bash
npm start
```

3. Run Android (Windows)

```bash
npm run android
```

Notes:
- Hermes must be enabled in `android/app/build.gradle` for production builds.
- Android NDK and CMake are required to build native modules (`libsodium`, `argon2`).
- Build steps for native components are documented in `docs/IMPLEMENTATION_NATIVE_SECURITY.md`.

Local native build (Android):

```bash
# From project root
cd android/app
./gradlew assembleDebug
```

Next step: implement native Kotlin security module, SQLCipher integration, and Crypto File Engine.

## Web preview (react-native-web)

You can preview the React Native app in a desktop browser using `react-native-web` + webpack.

After installing dependencies, run:

```bash
npm install
npm run web
```

The dev server will start at `http://localhost:8080` and render the app using `react-native-web`.

Notes:
- This setup is for UI preview and navigation only; native modules (`SecurityModule`) are not available on web and are mocked or will fail if invoked.
- If you prefer a simpler web workflow, consider switching to Expo and running `expo start --web`.

## Native NDK build notes (libsodium / argon2)

This project can optionally build `libsodium` and `argon2` as part of the native CMake step. The Android `CMakeLists.txt` supports downloading/building these libraries at configure time when `BUILD_LIBSODIUM` and `BUILD_ARGON2` are enabled (default in Gradle config).

Prerequisites on build host:
- Android NDK and CMake (installed via Android Studio SDK Manager)
- `git`, `make`, and a POSIX toolset available in PATH (Windows: Git Bash or WSL recommended)

To build the native libs and app locally:

```bash
cd android
./gradlew clean assembleDebug
```

Notes:
- The CMake step may attempt to download and compile third-party libraries; this requires network access and a working build toolchain. On Windows, building C/C++ third-party libraries is easiest within WSL or MSYS2/MinGW environments.
- For CI, prefer building on a Linux runner (GitHub Actions) or configure cached prebuilt binaries for each ABI to speed up builds.
