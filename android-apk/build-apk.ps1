$ErrorActionPreference = "Stop"

$sdk = "C:\Users\annu bhai\AppData\Local\Android\Sdk"
$bt = "$sdk\build-tools\35.0.0"
$androidJar = "$sdk\platforms\android-35\android.jar"
$proj = "c:\Users\annu bhai\Desktop\Home Service\android-apk"
$out = "$proj\build"

if (Test-Path $out) { Remove-Item -Recurse -Force $out }
New-Item -ItemType Directory -Force -Path "$out\compiled_res", "$out\gen", "$out\classes", "$out\dex", "$out\apk" | Out-Null

Write-Host "1. Compiling resources with aapt2..."
& "$bt\aapt2.exe" compile --dir "$proj\res" -o "$out\compiled_res\res.zip"
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host "2. Linking resources & generating R.java..."
& "$bt\aapt2.exe" link `
  -o "$out\apk\unsigned.apk" `
  -I "$androidJar" `
  --manifest "$proj\AndroidManifest.xml" `
  --java "$out\gen" `
  -R "$out\compiled_res\res.zip" `
  --auto-add-overlay
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host "3. Compiling Java sources..."
$javaFiles = Get-ChildItem -Recurse -Filter "*.java" "$proj\src", "$out\gen" | ForEach-Object { $_.FullName }
& javac --release 11 -classpath "$androidJar" -d "$out\classes" $javaFiles
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host "4. Converting classes to DEX with d8..."
$classFiles = Get-ChildItem -Recurse -Filter "*.class" "$out\classes" | ForEach-Object { $_.FullName }
& "$bt\d8.bat" --lib "$androidJar" --min-api 24 --output "$out\dex" $classFiles
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host "5. Adding classes.dex to APK..."
Copy-Item "$out\dex\classes.dex" "$out\apk\classes.dex"
Push-Location "$out\apk"
& "$bt\aapt.exe" add "unsigned.apk" "classes.dex" | Out-Null
Pop-Location
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host "6. Aligning APK..."
& "$bt\zipalign.exe" -f -p 4 "$out\apk\unsigned.apk" "$out\apk\aligned.apk"
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host "7. Signing APK..."
$keystore = "$out\debug.keystore"
cmd /c "keytool -genkeypair -keystore `"$keystore`" -alias androiddebugkey -keyalg RSA -keysize 2048 -validity 10000 -storepass android -keypass android -dname `"CN=HomeServePro,O=HomeServe,C=IN`" 2>nul"
$finalApk = "$proj\HomeServePro.apk"
& "$bt\apksigner.bat" sign --ks "$keystore" --ks-pass pass:android --key-pass pass:android --out "$finalApk" "$out\apk\aligned.apk"
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host "8. Verifying APK signature..."
& "$bt\apksigner.bat" verify --verbose "$finalApk"
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Get-Item "$finalApk" | Select-Object FullName, Length
