Param(
    [string]$VendorDir = "android/app/src/main/cpp/vendor"
)

Write-Host "Fetching native dependencies into $VendorDir"

if (-not (Test-Path $VendorDir)) {
    New-Item -ItemType Directory -Path $VendorDir -Force | Out-Null
}

Push-Location $VendorDir
if (-not (Test-Path libsodium)) {
    Write-Host "Cloning libsodium..."
    git clone https://github.com/jedisct1/libsodium.git libsodium
} else {
    Write-Host "libsodium already exists"
}

if (-not (Test-Path argon2)) {
    Write-Host "Cloning argon2..."
    git clone https://github.com/P-H-C/phc-winner-argon2.git argon2
} else {
    Write-Host "argon2 already exists"
}

Pop-Location

Write-Host "Done. Now run: cd android && ./gradlew assembleDebug"
