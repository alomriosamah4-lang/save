# THREAT_MODEL

## Summary
قائمة تهديدات رئيسية مع التخفيفات المعتمدة.

| Threat | Likelihood | Impact | Mitigation |
|---|---:|---:|---|
| Device theft | High | High | Keystore-wrapped Master Key + Strong Argon2 parameters + Auto-lock
| Rooted device | Medium | High | Detect root, degrade features, warning to user, avoid storing sensitive keys
| Brute-force password | Medium | High | Argon2id strong params, exponential backoff, rate limiting
| Screenshot / screen recording | Low | Medium | FLAG_SECURE in sensitive activities
| Memory dump | Low | High | Keep keys in native, zeroize memory, use NDK for sensitive ops
| Malicious app access | Low | High | Use internal storage, do not export sensitive data, SAF for import only
