package com.securevault

import androidx.test.ext.junit.runners.AndroidJUnit4
import androidx.test.platform.app.InstrumentationRegistry
import org.junit.Assert.assertTrue
import org.junit.Test
import org.junit.runner.RunWith

/**
 * Instrumentation test that runs the native `selfTest()` and fails if it returns false.
 * This allows CI to run `connectedAndroidTest` and validate native crypto integration.
 */
@RunWith(AndroidJUnit4::class)
class NativeSelfTest {

    @Test
    fun nativeSelfTestRuns() {
        val appContext = InstrumentationRegistry.getInstrumentation().targetContext
        // Ensure JNI is initialized first
        NativeCrypto.jniInit()
        val ok = NativeCrypto.selfTest()
        assertTrue("Native self-test failed", ok)
    }
}
