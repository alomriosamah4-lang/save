# SETUP_NATIVE

This file explains how to fetch and build native dependencies (`libsodium`, `argon2`) for the Secure Vault App.

Prerequisites
- Android NDK (version specified in `android/app/build.gradle`)
- CMake
- Git

Steps
1. From project root, add vendor submodules (recommended):

```bash
mkdir -p android/app/src/main/cpp/vendor
cd android/app/src/main/cpp/vendor
# Add libsodium and argon2 as submodules (or clone them)
git clone https://github.com/jedisct1/libsodium.git libsodium
git clone https://github.com/P-H-C/phc-winner-argon2.git argon2
```

2. Build (from project root):

```bash
cd android
./gradlew assembleDebug
```

Notes
- The CMakeLists will detect `vendor/libsodium` and `vendor/argon2` and link them.
- After first build, verify the native library `libcrypto_bridge.so` exists under `app/build/intermediates/cmake`.
- If building on CI, ensure the NDK and CMake are installed and available.

Windows (PowerShell) helper
---------------------------
Run the provided PowerShell helper to clone the native dependencies automatically:

```powershell
.
\scripts\fetch-native-deps.ps1
```

CI notes
--------
- For CI, prefer adding the native deps as pinned submodules or use your CI to `git clone` with a specific commit SHA to ensure reproducible builds.

Security
- Do not commit vendor native libraries directly into the repo unless reviewed.
- Prefer pinned commit SHAs for submodules in CI.
