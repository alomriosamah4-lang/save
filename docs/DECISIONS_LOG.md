# DECISIONS_LOG

## 2026-03-05: Decision - Native security approach
- Choose NDK + JNI for Argon2id and AEAD (libsodium) to ensure side-channel resistant and performant crypto.
- Use Android Keystore to wrap Master Keys; keep Key Envelope in SQLCipher.
- React Native communicates with Kotlin native module; no crypto in JS.

Rationale: Performance and security requirements demand native implementations for core crypto.
