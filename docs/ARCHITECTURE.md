# ARCHITECTURE

## هدف
توضيح البنية المعمارية لتطبيق Secure Vault App مع تركيز تفصيلي على طبقات Presentation، Security (Kotlin + NDK)، Data (SQLCipher)، وCrypto Engine. هذا الملف يوجّه تصميم المكوّنات والتكاملات بين Java/Kotlin/NDK وReact Native.

## النطاق
يغطي هذا المستند التصميم العام للتطبيق، تعريف الطبقات، واجهات الربط بين الطبقات، واعتمادية المكونات المستخدمة في مرحلة `Native Security` (Keystore, Argon2id, AEAD).

## الرؤية المعمارية
- Presentation Layer: React Native (TypeScript) مع Hermes لرفع الأداء.
- Bridge Layer: React Native Native Modules (Kotlin) لتوفير واجهات آمنة للوصول إلى ميزات النظام الحساسة.
- Security Layer (Native): Kotlin (Android Keystore, BiometricPrompt) + NDK (Argون2id، libsodium/XChaCha20-Poly1305) لمسؤولية اشتقاق المفاتيح وتطبيق AEAD في native.
- Data Layer: SQLCipher لتخزين الميتاداتا ومؤشرات الملفات بشكل مشفر ضمن Internal App Storage.
- Crypto File Engine: Streaming AEAD مع chunk-based processing لمنع تحميل ملفات كبيرة في الذاكرة وضمان عدم إنشاء plaintext على القرص.

## مكونات النظام ومسؤولياتها
- `app/src/ui` (React Native): شاشات، hooks، وخدمات عرض فقط — لا منطق تشفير.
- `SecurityModule` (Kotlin native module): API لفتح الخزائن، إدارة Wrapped Master Keys، تفعيل BiometricPrompt، والتحقق من حالة الجهاز (root/debug).
- `crypto-ndk` (C/C++ via JNI): تنفيذ Argon2id لاشتقاق المفاتيح، واجهات AEAD (XChaCha20-Poly1305) للتشفير/فك التشفير المتدفق.
- `storage` (Kotlin/Java): تكامل SQLCipher، تنفيذ قواعد بيانات مشفرة، إدارة معاملات DB والنسخ الاحتياطية المشفّرة.

## واجهات الربط (مختصر)
- React Native -> `SecurityModule` (Kotlin) عبر Native Modules.
- `SecurityModule` -> `crypto-ndk` عبر JNI لتشغيل Argon2 وAEAD بكفائة.
- DB/Storage تُستخدم من Kotlin فقط؛ لا وصول مباشر من JavaScript لِـ keys/crypto ops.

## اعتمادات رئيسية
- React Native, Hermes
- AndroidX Biometric
- libsodium (NDK) وargon2 (NDK)
- SQLCipher for Android

## مخاطر وملاحظات توافق
- تنفيذ native crypto خطر إذا لم يُراعَ side-channel mitigations.
- ABI fragmentation: دعم armeabi-v7a, arm64-v8a، x86_64 (اختياري) مع اختبار عبر أجهزة حقيقية.
- قيود أداء Argon2: يجب ضبط `time` و`memory` و`parallelism` حسب قدرات الجهاز.

## حالات الحافة
- أجهزة لا تدعم Keystore أو تدعم نسخة قديمة من Android Keystore.
- حالات فقدان الوصول إلى Keystore بعد factory-reset.
- فشل Biometric أو رفض المستخدم.

## التأثير الأمني
- Master Key لكل خزنة مُغلف (wrapped) ومخزن بشكل آمن داخل Android Keystore.
- الميتاداتا غير حساسة يمكن أن تُخزن مشفرة داخل SQLCipher لكن لا تحتوي على مفاتيح.

## التأثير على الأداء
- عمليات فتح الخزنة تتضمن Argon2id والتي قد تستغرق زمنًا واضحًا؛ استراتيجية التحسين: benchmarking وadaptive params.
- Streaming encryption يقلل استهلاك الذاكرة لكنه يزيد I/O؛ يجب مراقبة أداء التخزين وقياس latency أثناء الاستيراد/عرض الوسائط.

## مراجع
- Android Keystore documentation
- libsodium docs
- Argon2 specification

---
لتنفيذ أي تغيير في طبقة Security، يجب تحديث ملفات التوثيق المرتبطة (SECURITY_MODEL.md, PERMISSION_STRATEGY.md, THREAT_MODEL.md, PERFORMANCE_STRATEGY.md, TESTING_STRATEGY.md) قبل كتابة أي كود جديد.
