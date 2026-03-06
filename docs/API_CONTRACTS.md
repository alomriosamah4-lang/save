# API_CONTRACTS

## Native Module: `SecurityModule` (Kotlin -> React Native)

Methods (JS-facing):

- `isDeviceSecure(): Promise<boolean>`
  - returns true if device meets baseline security (Keystore available, not rooted)

- `createVault(name: string, password: string, options: {useBiometric: boolean}): Promise<{vaultId: string}>`
  - Creates salt, derives key via Argon2id, creates master key, wraps it into Keystore, stores `wrapped_master_key` in DB.

- `openVault(vaultId: string, passwordOrBiometricToken: string): Promise<{sessionToken: string}>`
  - Unlocks vault for the session; sessionToken is ephemeral and used for file operations.

- `closeVault(sessionToken: string): Promise<void>`
  - Zeroize session keys, revoke token.

- `importStream(sessionToken: string, metadata: object, readerId: string): Promise<{fileId: string}>`
  - Accepts a stream handle/descriptor from JS to import data via streaming encryption into `file_chunks`.

- `getFileStream(sessionToken: string, fileId: string, start?: number): Promise<{streamId: string}>`
  - Exposes a native stream to JS for streaming decrypted data.

- `changePassword(vaultId: string, oldPassword: string, newPassword: string): Promise<void>`

- `enableBiometric(vaultId: string): Promise<void>`

Errors: All methods must return structured errors with codes (e.g., `ERR_INVALID_PASSWORD`, `ERR_VAULT_LOCKED`, `ERR_PERMISSION_DENIED`).

## JS Services
- Services wrap native modules and perform validation with Zod.
- No cryptographic logic in JS.
