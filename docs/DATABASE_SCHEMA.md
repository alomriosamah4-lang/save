# DATABASE_SCHEMA

## Goal
تعريف مخطط قاعدة البيانات المشفرة (SQLCipher) والـ tables الأساسية اللازمة لعمل الخزائن وإدارة الملفات.

## Scope
يغطي هذا الملف الجداول، الحقول، الفهارس، وأنواع البيانات المستخدمة مع مراعاة الخصوصية والأداء.

## Tables

1. `vaults`
- `id` TEXT PRIMARY KEY (UUID)
- `name` TEXT
- `salt` BLOB
- `wrapped_master_key` BLOB
- `created_at` INTEGER
- `updated_at` INTEGER
- `quota_bytes` INTEGER

2. `files`
- `id` TEXT PRIMARY KEY (UUID)
- `vault_id` TEXT REFERENCES vaults(id)
- `filename` TEXT
- `mime` TEXT
- `size` INTEGER
- `chunk_count` INTEGER
- `metadata` TEXT -- JSON (indexed)
- `created_at` INTEGER

3. `file_chunks`
- `id` INTEGER PRIMARY KEY AUTOINCREMENT
- `file_id` TEXT REFERENCES files(id)
- `sequence` INTEGER
- `blob` BLOB -- encrypted chunk
- `length` INTEGER

4. `settings`
- `key` TEXT PRIMARY KEY
- `value` TEXT

## Indexes
- index on `files(vault_id)`
- full-text search index on `files(filename)` (optional, encrypted index tradeoffs)

## Notes
- All DB files encrypted by SQLCipher with a DB key derived from Keystore-wrapped master key.
- Minimize queries that expose metadata; consider encrypting sensitive metadata fields.
