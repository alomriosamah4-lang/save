Param(
    [string]$GradleVersion = '8.4',
    [string]$ProjectRoot = (Get-Location).Path
)

$ErrorActionPreference = 'Stop'

$url = "https://services.gradle.org/distributions/gradle-$GradleVersion-bin.zip"
$tmp = Join-Path $env:TEMP "gradle-$GradleVersion-bin.zip"
$extractDir = Join-Path $env:TEMP "gradle-$GradleVersion-extract"
$dest = Join-Path $ProjectRoot "android\gradle\wrapper"

Write-Host "Downloading Gradle $GradleVersion to $tmp"
if (-Not (Test-Path $tmp)) {
    Invoke-WebRequest -Uri $url -OutFile $tmp -UseBasicParsing
} else {
    Write-Host "Zip already exists at $tmp, skipping download"
}

if (Test-Path $extractDir) { Remove-Item -Recurse -Force $extractDir }
New-Item -ItemType Directory -Force -Path $extractDir | Out-Null

Write-Host "Extracting distribution"
Add-Type -AssemblyName System.IO.Compression.FileSystem
[System.IO.Compression.ZipFile]::ExtractToDirectory($tmp, $extractDir)

$srcJar = Get-ChildItem -Path $extractDir -Recurse -Filter 'gradle-wrapper.jar' | Select-Object -First 1
if (-Not $srcJar) { throw "gradle-wrapper.jar not found in extracted archive" }

if (-Not (Test-Path $dest)) { New-Item -ItemType Directory -Force -Path $dest | Out-Null }

$dstJar = Join-Path $dest 'gradle-wrapper.jar'
Copy-Item -Path $srcJar.FullName -Destination $dstJar -Force

Write-Host "Writing gradle-wrapper.properties to $dest"
$props = @"
distributionBase=GRADLE_USER_HOME
distributionPath=wrapper/dists
distributionUrl=https\://services.gradle.org/distributions/gradle-$GradleVersion-bin.zip
zipStoreBase=GRADLE_USER_HOME
zipStorePath=wrapper/dists
"@

$propsPath = Join-Path $dest 'gradle-wrapper.properties'
$props | Out-File -FilePath $propsPath -Encoding ascii

Write-Host "Created $dstJar and $propsPath"
Param(
    [string]$Version = "8.4"
)
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $MyInvocation.MyCommand.Definition
$projRoot = Resolve-Path "$root\.." | Select-Object -ExpandProperty Path
$androidDir = Join-Path $projRoot 'android'
$destDir = Join-Path $androidDir 'gradle\wrapper'
if (-not (Test-Path $destDir)) { New-Item -ItemType Directory -Path $destDir -Force | Out-Null }
$url = "https://services.gradle.org/distributions/gradle-$Version-bin.zip"
$tmp = Join-Path $env:TEMP "gradle-$Version-bin.zip"
Write-Host "Downloading $url to $tmp"
Invoke-WebRequest -Uri $url -OutFile $tmp -UseBasicParsing
$extractDir = Join-Path $env:TEMP "gradle-$Version-extract"
if (Test-Path $extractDir) { Remove-Item $extractDir -Recurse -Force }
Add-Type -AssemblyName System.IO.Compression.FileSystem
[System.IO.Compression.ZipFile]::ExtractToDirectory($tmp, $extractDir)
$srcJar = Join-Path $extractDir "gradle-$Version\lib\gradle-wrapper.jar"
if (-not (Test-Path $srcJar)) { Write-Error "gradle-wrapper.jar not found in extracted distribution" }
Copy-Item -Path $srcJar -Destination (Join-Path $destDir 'gradle-wrapper.jar') -Force
$props = @(
    'distributionBase=GRADLE_USER_HOME',
    'distributionPath=wrapper/dists',
    "distributionUrl=https://services.gradle.org/distributions/gradle-$Version-bin.zip",
    'zipStoreBase=GRADLE_USER_HOME',
    'zipStorePath=wrapper/dists'
)
$props | Out-File -FilePath (Join-Path $destDir 'gradle-wrapper.properties') -Encoding ascii
Write-Host "Created: " (Join-Path $destDir 'gradle-wrapper.jar')
Write-Host "Created: " (Join-Path $destDir 'gradle-wrapper.properties')
