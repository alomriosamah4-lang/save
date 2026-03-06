# IMPLEMENTATION_NATIVE_SECURITY

This document describes the immediate implementation approach for the Native Security module (Kotlin + NDK).

## Goal
Implement a secure, testable native layer for Argon2id key derivation, Master Key generation/wrapping, and chunked AEAD encryption.

## Current status
- Documentation phase completed and verified (see VERIFICATION_NATIVE_SECURITY.md).
- Skeleton Kotlin `SecurityModule` and `NativeCrypto` created.
- JNI stubs added in `android/app/src/main/cpp` (placeholders). No sensitive crypto is implemented yet.

## Next steps (implementation roadmap)
1. Replace JNI stubs with real integration:
   - Integrate Argon2 C implementation (or use libsodium's Argon2 bindings).
   - Integrate libsodium for XChaCha20-Poly1305 AEAD.
2. Implement secure RNG for salt/master key generation (use OS RNG).
3. Implement Keystore wrapping in Kotlin using Android Keystore; keep wrapped keys persisted in SQLCipher.
4. Implement biometric key protection via AndroidX Biometric and Keystore key access control.
5. Add unit/integration tests for native libs and Gradle instrumentation tests.

## Build notes
- Ensure `android/app/build.gradle` configures `externalNativeBuild` with `cmake` and ABI filters.
-- Add CI matrix to build ABIs: `arm64-v8a`, `armeabi-v7a`, and `x86_64` for emulator tests.

## SQLCipher integration
- Added SQLCipher dependency and initial `DBManager`/`SecureVaultOpenHelper` to create an encrypted DB and tables per `DATABASE_SCHEMA.md`.

## Keystore wrapping
- Implemented `KeystoreManager.wrapMasterKey` and `unwrapMasterKey` using Android Keystore AES-GCM. Wrapped keys initially stored in `SharedPreferences` as interim persistence and will be migrated to SQLCipher.

## Security notes
- Native code must follow constant-time implementations where applicable and avoid exposing secrets via logs.
- Zeroize sensitive buffers immediately after use.

## Files created in this iteration
- `SecurityModule.kt` (Kotlin orchestration)
- `NativeCrypto.kt` (external JNI declarations)
- `crypto_bridge.cpp` (JNI stubs)
- `CMakeLists.txt` for native build

## Verification
This implementation step is initial scaffolding; do not consider production-safe until native libs are fully integrated and tested.
