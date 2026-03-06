# نشر المشروع إلى GitHub وCI لبناء APK

هذا الدليل يشرح طريقة رفع المشروع إلى GitHub بحيث يقوم GitHub Actions ببناء APK متعدد-الـABI تلقائيًا.

ملاحظات مهمة قبل البدء:
- المشروع حاليًا يحتوي على واجهة جاهزة وstubs للويب. لكن التشفير الحقيقي يتم داخل native (NDK) ويتطلب libsodium وargon2.
- أضفت workflow لـ GitHub Actions (`.github/workflows/android-native-build.yml`) الذي يُثبت Android SDK/NDK وCMake ويشغّل `./gradlew assembleDebug` على Ubuntu runner.

خطوات سريعة (على جهازك):

1. ثبّت `git` وتهيئ هويتك (مرة واحدة):
```powershell
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
```

2. تهيئة المستودع ودفعه إلى GitHub:
```powershell
cd "D:\programming\React projects\safe folder"
git init
git add .
git commit -m "Initial commit: project scaffold and CI"
# أنشئ repo على GitHub ثم استبدل URL بالـ remote الخاص بك
git remote add origin https://github.com/youruser/yourrepo.git
git branch -M main
git push -u origin main
```

3. راقب GitHub Actions:
- افتح صفحة المشروع على GitHub → Actions → اختَر workflow `Android Native Build (multi-ABI)`.
- عند نجاحه، ستجد artifact باسم `android-debug-apks` يحتوي على APKs جاهزة للاختبار.

ماذا أفعل أنا تلقائيًا بعد الدفع؟
- أراقب أول تشغيل الـ workflow، أقرأ سجلات الأخطاء إن ظهرت، وأصلح إعدادات البناء أو CMake أو الاعتماديات إن لزم.

ملاحظات إضافية:
- إذا أردت تجنّب بناء NDK على Windows محليًا، استخدم CI لفحص البنية ثم نزّل APK للاختبار على جهاز فعلي.
- لبناء للإنتاج ستحتاج إلى: مراجعة أمنيّة للـ NDK، إعداد signingConfig (keystore)، وتمكين ProGuard/R8 وقواعد الحماية.
