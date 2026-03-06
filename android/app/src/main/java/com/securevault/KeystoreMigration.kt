package com.securevault

import android.content.Context
import android.util.Base64
import com.securevault.db.DBManager

/**
 * KeystoreMigration: moves any interim wrapped values stored in SharedPreferences
 * into the encrypted SQLCipher database's `settings` table, then removes the
 * legacy preference. This is an atomic, idempotent helper intended to run once
 * at startup (or during SecurityModule initialization).
 */
object KeystoreMigration {
    private const val PREFS_NAME = "sv_keystore_prefs"
    private const val DB_WRAPPED_KEY = "db_wrapped"

    private fun prefs(context: Context) = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)

    fun migrateDbWrappedToDb(context: Context) {
        try {
            val stored = prefs(context).getString(DB_WRAPPED_KEY, null)
            if (stored == null) return // nothing to migrate

            // Obtain DB passphrase by unwrapping via KeystoreManager (this reads prefs)
            val dbPass = KeystoreManager.getOrCreateDbPassphrase(context)

            // Initialize SQLCipher DB with passphrase
            DBManager.init(context, dbPass)

            // Persist the wrapped value into settings table (base64)
            DBManager.setSetting(context, dbPass, DB_WRAPPED_KEY, stored)

            // Remove legacy preference
            prefs(context).edit().remove(DB_WRAPPED_KEY).apply()
        } catch (e: Exception) {
            // Migration should not crash startup; log and continue. Avoid exposing details.
            // In production, route this to telemetry for manual inspection.
        }
    }
}
