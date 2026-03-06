## تصميم واجهات تطبيق "خزنتي" — مواصفات تصميمية وتدفقات المستخدم التفصيلية

هذا المستند يجمع متطلبات واجهة المستخدم (UI) وتدفقات تجربة المستخدم (UX) المستخلصة من `USER_FLOW.md` ويعرض عقود التنفيذ اللازمة للفريق (visual, interaction, security). الهدف أن يكون المرجع العملي عند تنفيذ شاشات `Splash`, `Onboarding`, `SecuritySetup` والشاشات الفرعية المرتبطة بالأمان.

---

1) مصادر وأنظمة التصميم
- استخدم `src/styles/theme.ts` كمصدر وحيد للألوان والأنماط.
- عناصر مهمة:
  - `Colors.dark.background` — خلفية التطبيق.
  - `Colors.dark.surface` — بطاقات/لوحات.
  - `Colors.dark.glass` — خلفيات زجاجية للحقول والبطاقات الحساسة.
  - `Colors.dark.border` — حدود رفيعة.
  - `Colors.dark.accent` — ألوان التفاعل (استخدم كقيمة لتدرج أو لون ثابت).

2) الطباعة
- عناوين رئيسية: 28px, weight 700.
- عناوين شاشات: 22px, weight 600.
- نص الجسم: 16px, weight 400.
- خطوط مقترحة: `Inter` أو `Noto Sans Arabic` مع دعم RTL.

3) المكونات الأساسية (API / Props contract)
- `PrimaryButton` (`src/components/PrimaryButton.tsx`)
  - props: `title: string`, `onPress?: () => void`, `disabled?: boolean`, `loading?: boolean`, `style?: ViewStyle`.
  - visuals: height ≈ 52, borderRadius 12–16, gradient أو `accent` color، states: default/loading/disabled.

- `TextField` (`src/components/TextField.tsx`)
  - props: `value`, `onChangeText`, `placeholder`, `secureTextEntry`, `keyboardType`.
  - visuals: glass background, borderRadius 10–14، placeholder light color، error message support.

- `SecureCard` (used in `SecuritySetup`)
  - content: Icon, Title, Description, optional Action.
  - visuals: surface background, selectable state (border highlight + check icon), accessible touch target.

4) شاشات ومخططات التدفق
- Root Navigation (see `src/navigation/RootNavigator.tsx`):
  - Stack: `Splash` → `Onboarding` → `SecuritySetup` → `VaultList`.
  - `VaultList` يحوي تبويبات: Photos / Videos / Files / Documents / Audio / Locked Apps / Settings.

- `Splash` (`src/screens/Splash.tsx`)
  - عناصر: Logo (Image), App Name, Tagline (small), Start Button.
  - سلوك: إذا كان هناك native splash أو `nativeSelfTest()`، قد نعرض loader ثم نُظهر زر `بدء الاستخدام`.
  - Acceptance: الزر يؤدي إلى `Onboarding`.

- `Onboarding` (`src/screens/Onboarding.tsx`)
  - Carousel (FlatList horizontal) بصفحات 2–4، كل صفحة: Illustration, Title, Short copy.
  - Navigation: swipe, pagination dots, buttons `Next`/`Skip`، وزر نهائي `ابدأ الآن` الذي ينتقل إلى `SecuritySetup`.

- `SecuritySetup` (`src/screens/SecuritySetup.tsx`)
  - يعرض قائمة الخيارات: PIN (4/6)، Password، Pattern، Fingerprint، Face ID.
  - عند اختيار عنصر: انتقل إلى شاشة الإعداد المخصصة (`SetupPin`, `SetupPassword`, `SetupPattern`, `SetupBiometric`).
  - الزر `متابعة` يجب أن يفتح الشاشة الملائمة أو يطالب بالإدخال/التأكيد، وليس العودة إلى `Onboarding`.

- شاشات الإعداد التفصيلية (placeholders يجب تنفيذها)
  - `SetupPin`: إدخال PIN ثم تأكيده، عرض أخطاء الطول وعدم التطابق، عدد محاولات محدود (configurable).
  - `SetupPassword`: إدخال كلمة المرور، عرض مؤشر قوة (strength meter)، تأكيد.
  - `SetupPattern`: واجهة رسم نمط وتأكيد.
  - `SetupBiometric`: واجهة تفعيل البصمة/الوجه مع fallback إلى PIN/Password.

5) سياسات الأمان في الواجهات
- جميع عمليات التحقق والاشتقاق (Argon2) والتخزين الآمن تتم في native — واجهة JS تمرر القيم عبر العقد المعرفة في `API_CONTRACTS.md`.
- لا تعرض أو تسجل أي قيمة حساسة في الـ logs.
- عند فشل أي عملية native (Keystore غير متاح، خطأ تشفير)، اعرض رسالة خطأ واضحة للمستخدم مع خطوات مقترحة.

6) الأذونات والـ Privacy
- اطلب الأذونات عند الحاجة فقط (explain why) — Permissions screen موصوف في `USER_FLOW.md`.
- أذونات مهمة: Files/SAF, Photos, Biometric, Camera (للكاميرا السرية).

7) RTL ودعم العربية
- افتراض افتراضي: التطبيق يعمل باللغة العربية ويدعم RTL. تحقق من اتجاه النصوص ومحاذاة العناصر (icons, padding, margins) عند تمكين RTL.

8) الحركات والانتقالات
- استخدم حركات بسيطة: fade وslide عند الانتقال بين الشاشات الأساسية. يمكن استخدام `Animated` أو `LayoutAnimation` كمكتبات افتراضية.

9) نقاط التحقق (Acceptance)
- Splash: يظهر الشعار والزر `بدء الاستخدام` وعند الضغط ينتقل إلى `Onboarding`.
- Onboarding: Carousel يعمل بالـ swipe والأزرار، والزر النهائي ينتقل لـ`SecuritySetup`.
- SecuritySetup: اختيار طريقة أمنية يفتح شاشة الإعداد الملائمة ويتم تخزينها بنجاح في native.
- لا توجد معلومات حساسة تظهر في سجلات التطبيق.

10) اختبارات مقترحة
- Unit tests: components (`PrimaryButton`, `TextField`, `SecureCard`).
- Integration/UI tests: تدفق `Splash` → `Onboarding` → `SecuritySetup`، وتدفق إعداد PIN/password.
- Security tests: التأكد من أن `nativeSelfTest()` يُفعل قبل السماح بالدخول، وأن كلمات السر لا تظهر في الذاكرة كـ plain text بعد إتمام الإعداد.

11) ملاحظات تنفيذية
- إذا أردتم تدرج في الزر الأساسي فسنضيف `react-native-linear-gradient` أو نستخدم صورة خلفية؛ البديل البسيط هو لون ثابت مع ظل.
- التأكد من أن كل شاشة تُطابق متطلبات Performance (lazy loading للـ VaultList وthumbnails مشفّرة stream).

12) مراجع
- USER_FLOW: `docs/USER_FLOW.md`
- SECURITY_MODEL: `docs/SECURITY_MODEL.md`
- API contracts: `docs/API_CONTRACTS.md`

---

هذا الملف الآن مفصّل ليغطي متطلبات التصميم، التفاعلات، ونقاط القبول المطلوبة من تجربة المستخدم والقيود الأمنية. أستطيع الآن البدء بتطبيق شاشات skeleton والاختبارات إن رغبت.
