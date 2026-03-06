@echo off
REM Launcher: prefer running local gradle-wrapper.jar if present, else fallback to system gradle.
setlocal
set SCRIPT_DIR=%~dp0
set WRAPPER_JAR=%SCRIPT_DIR%gradle\wrapper\gradle-wrapper.jar
if exist "%WRAPPER_JAR%" (
	echo Running gradle wrapper jar...
	java -jar "%WRAPPER_JAR%" %*
	exit /b %ERRORLEVEL%
)

REM Fall back to system gradle
where gradle >nul 2>&1
if %ERRORLEVEL%==0 (
	gradle %*
	exit /b %ERRORLEVEL%
)

echo.
echo ERROR: Gradle wrapper not found and 'gradle' is not on PATH.
echo Option A: Install Gradle for Windows (chocolatey/scoop/winget) and re-run:
echo   choco install gradle
echo   or
echo   winget install Gradle.Gradle
echo Option B: Generate the Gradle wrapper on a machine with Gradle by running 'gradle wrapper' in the 'android' directory, then commit the 'gradle/wrapper' directory (contains gradle-wrapper.jar and properties).
echo Option C: Open the project in Android Studio and let it manage the Gradle wrapper for you.
exit /b 1
