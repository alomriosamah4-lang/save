package com.securevault

import android.content.Context
import android.security.keystore.KeyGenParameterSpec
import android.security.keystore.KeyProperties
import java.security.KeyStore
import javax.crypto.KeyGenerator

object KeystoreManager {

    private const val KEY_ALIAS_PREFIX = "sv_master_"
    private const val DB_KEY_ALIAS = "sv_db_key"
    private const val PREFS_NAME = "sv_keystore_prefs"

    private fun prefs(context: Context) = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)

    private fun ensureKeystoreKey(context: Context, alias: String, userAuthRequired: Boolean = false) {
        val keyStore = KeyStore.getInstance("AndroidKeyStore")
        keyStore.load(null)
        if (!keyStore.containsAlias(alias)) {
            val keyGenerator = KeyGenerator.getInstance(KeyProperties.KEY_ALGORITHM_AES, "AndroidKeyStore")
            val specBuilder = KeyGenParameterSpec.Builder(
                alias,
                KeyProperties.PURPOSE_ENCRYPT or KeyProperties.PURPOSE_DECRYPT
            ).setBlockModes(KeyProperties.BLOCK_MODE_GCM)
                .setEncryptionPaddings(KeyProperties.ENCRYPTION_PADDING_NONE)
                .setKeySize(256)
            if (userAuthRequired) {
                specBuilder.setUserAuthenticationRequired(true)
            }
            keyGenerator.init(specBuilder.build())
            keyGenerator.generateKey()
        }
    }

    fun wrapWithAlias(context: Context, alias: String, data: ByteArray): ByteArray {
        ensureKeystoreKey(context, alias)
        val keyStore = KeyStore.getInstance("AndroidKeyStore")
        keyStore.load(null)
        val secretKey = keyStore.getKey(alias, null) as javax.crypto.SecretKey
        val cipher = javax.crypto.Cipher.getInstance("AES/GCM/NoPadding")
        cipher.init(javax.crypto.Cipher.ENCRYPT_MODE, secretKey)
        val iv = cipher.iv
        val cipherText = cipher.doFinal(data)
        val out = ByteArray(iv.size + cipherText.size)
        System.arraycopy(iv, 0, out, 0, iv.size)
        System.arraycopy(cipherText, 0, out, iv.size, cipherText.size)
        return out
    }

    fun unwrapWithAlias(context: Context, alias: String, wrapped: ByteArray): ByteArray {
        val keyStore = KeyStore.getInstance("AndroidKeyStore")
        keyStore.load(null)
        val secretKey = keyStore.getKey(alias, null) as javax.crypto.SecretKey
        val ivLen = 12
        if (wrapped.size <= ivLen) throw IllegalArgumentException("invalid wrapped key")
        val iv = wrapped.copyOfRange(0, ivLen)
        val cipherText = wrapped.copyOfRange(ivLen, wrapped.size)
        val cipher = javax.crypto.Cipher.getInstance("AES/GCM/NoPadding")
        val spec = javax.crypto.spec.GCMParameterSpec(128, iv)
        cipher.init(javax.crypto.Cipher.DECRYPT_MODE, secretKey, spec)
        return cipher.doFinal(cipherText)
    }

    // Vault-specific wrapping
    fun wrapMasterKey(context: Context, vaultId: String, masterKey: ByteArray, userAuthRequired: Boolean = false): ByteArray {
        val alias = KEY_ALIAS_PREFIX + vaultId
        ensureKeystoreKey(context, alias, userAuthRequired)
        return wrapWithAlias(context, alias, masterKey)
    }

    fun unwrapMasterKey(context: Context, vaultId: String, wrapped: ByteArray): ByteArray {
        val alias = KEY_ALIAS_PREFIX + vaultId
        return unwrapWithAlias(context, alias, wrapped)
    }

    // DB passphrase management: wrapped under a dedicated alias
    fun getOrCreateDbPassphrase(context: Context): ByteArray {
        val stored = prefs(context).getString("db_wrapped", null)
        if (stored != null) {
            val wrapped = android.util.Base64.decode(stored, android.util.Base64.NO_WRAP)
            return unwrapWithAlias(context, DB_KEY_ALIAS, wrapped)
        }
        // generate a strong random passphrase
        val pass = NativeCrypto.generateMasterKey() // 32 bytes random
        val wrapped = wrapWithAlias(context, DB_KEY_ALIAS, pass)
        val b64 = android.util.Base64.encodeToString(wrapped, android.util.Base64.NO_WRAP)
        prefs(context).edit().putString("db_wrapped", b64).apply()
        return pass
    }
