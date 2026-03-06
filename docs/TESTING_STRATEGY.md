# TESTING_STRATEGY

## Goal
تحديد حالات الاختبار المطلوبة للمرحلة Native Security.

## Tests Required
- Unit tests (Kotlin): Keystore interactions, wrapping/unwrapping logic (mock Keystore)
- Integration tests (NDK): Argon2 derivation, AEAD encrypt/decrypt roundtrips
- Memory profiling: Ensure no persistent plaintext in memory after operations
- Stress tests: Import 10GB dataset (simulated chunks) to validate stability
- Rotation tests: Change password and verify accessible files
- Kill process test: Verify no plaintext or unlocked keys remain after abrupt kill
- Permission denied flows: User denies SAF permissions

## Automation
- Use Gradle instrumentation tests for native parts; attach to CI pipeline.
