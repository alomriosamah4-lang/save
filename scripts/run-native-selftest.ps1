<#
Runs the nativeSelfTest Gradle task or connectedAndroidTest using either the
Gradle wrapper (`gradlew`) if present, or the system `gradle` command.

Usage:
  From project root:
    powershell -ExecutionPolicy Bypass -File .\scripts\run-native-selftest.ps1

This script helps when the Gradle wrapper is missing. If neither `gradlew`
nor `gradle` is available, it prints instructions to create the wrapper or
run from Android Studio.
#>
param()

function Run-Command($exe, $args) {
    Write-Host "Running: $exe $args"
    $proc = Start-Process -FilePath $exe -ArgumentList $args -NoNewWindow -Wait -PassThru
    return $proc.ExitCode
}

$cwd = Split-Path -Path $MyInvocation.MyCommand.Definition -Parent
Set-Location $cwd

# find project android directory
$androidDir = Join-Path $cwd 'android'
if (-not (Test-Path $androidDir)) { $androidDir = Join-Path $cwd 'android' }

Push-Location $androidDir
try {
    $gradlewPath = Join-Path $androidDir 'gradlew'
    $gradlewBat = Join-Path $androidDir 'gradlew.bat'

    if (Test-Path $gradlewPath -or Test-Path $gradlewBat) {
        $exe = Test-Path $gradlewBat ? $gradlewBat : $gradlewPath
        $exit = Run-Command $exe 'nativeSelfTest'
        exit $exit
    }

    # try system gradle
    $gradleCmd = Get-Command gradle -ErrorAction SilentlyContinue
    if ($null -ne $gradleCmd) {
        $exit = Run-Command 'gradle' ':app:nativeSelfTest'
        exit $exit
    }

    Write-Host "Gradle wrapper not found and 'gradle' is not on PATH." -ForegroundColor Yellow
    Write-Host "Options:"
    Write-Host "  1) Install Gradle and rerun this script."
    Write-Host "  2) In Android Studio open the project and select 'Gradle > Tasks > verification > connectedAndroidTest' to run instrumentation tests."
    Write-Host "  3) Generate wrapper (if you have Gradle): run 'gradle wrapper' in the project root to create 'gradlew'."
    exit 2
} finally {
    Pop-Location
}
