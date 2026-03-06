# PERFORMANCE_STRATEGY

## Goal
تحديد مقاربة لضبط أداء Argon2id وعمليات التشفير المتدفّق لتوازن بين الأمان وسلاسة الاستخدام.

## Argon2 Tuning Plan
- إجراء benchmarking على نماذج أجهزة (low/med/high) لتحديد قيم `time`, `memory`, `parallelism` لكل فئة.
- التخزين المؤقت (caching) للمحددات بحسب الجهاز عند التثبيت.

## Streaming
- استخدام chunk-size (مثلاً 1MiB) للتشفير المتدفق.
- الحد من الأعباء على الذاكرة: عدم تحميل كافة الملف في RAM.

## IO
- قياس latency أثناء استيراد ملفات متعددة بالتوازي.
- استخدام threading native للـ IO والتشفير.

## Monitoring
- إضافة telemetry (اختياري وخاضع للخصوصية) لقياس أوقات الفتح والاستيراد.
