الهدف
----
تحديد نموذج الأمان لكل "خزنة" (Vault): كيفية اشتقاق المفاتيح، لفّها، وحمايتها عبر Keystore وبصمة المستخدم.

النطاق
----
يغطي هذا الملف: اشتقاق المفاتيح (Argon2id)، إنشاء Master Key لكل خزنة، لفّ المفتاح (Key Wrapping) باستخدام Android Keystore، وسياسات الوصول (Biometric/Password).

المخطط
----
1. المستخدم يدخل Password
2. Argon2id(salt_vault, params) -> Derived Key
3. Derived Key يُستخدم لفتح Wrapped Master Key المخزن داخل Keystore
4. Master Key يُستخدم كـ AEAD key لتشفير/فك تشفير الملفات (XChaCha20-Poly1305)

مفاهيم أساسية
----
- Salt مستقل لكل خزنة
- Master Key مستقل لكل خزنة ومغلف (wrapped) باستخدام Keystore (RSA/ECDH/KeyStore-backed AES)
- Unlock Flow: BiometricPrompt يوافق ثم تُستخدم Derived Key لفتح Wrapped Key

حالات الخطأ والمخاطر
----
- brute-force: مواجهة عبر معامل Argon2id (time, memory, parallelism) + exponential backoff
- حملات side-channel: تنفيذ خوارزميات في native مع ممارسات مقاومة التسريب
- فقدان Keystore (factory reset): يجب دعم استعادة Vault عبر Export/Backup آمن مشفر

سياسات الحماية
----
- لا تخزين أي بيانات حساسة في plain text
- جميع عمليات التشفير/فك على native (NDK أو Keystore) حيثما أمكن
- Biometric ممكن كخيار لفتح الخزنة، لكنه دومًا يتطلب فشل آمِن (fallback إلى PIN/Password)

تأثير على الأداء
----
- Argon2id parameters يجب أن تُحدد بعد benchmarking على مجموعة أجهزة مستهدفة

اعتمادات
----
- Android Keystore
- libsodium / argon2 (NDK)
