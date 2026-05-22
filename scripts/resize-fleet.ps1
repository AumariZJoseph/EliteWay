Add-Type -AssemblyName System.Drawing
$srcDir = Join-Path $PSScriptRoot "..\images"
$outDir = Join-Path $srcDir "fleet-thumb"
New-Item -ItemType Directory -Force -Path $outDir | Out-Null
$files = @("corolla.jpg", "Rav4.jpg", "benz.jpg", "x5.jpg", "hiace.jpg", "range.jpg")
$maxW = 800
$codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" }
$encParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
$encParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, 82)

foreach ($f in $files) {
  $path = Join-Path $srcDir $f
  if (-not (Test-Path $path)) { Write-Host "Skip $f"; continue }
  $img = [System.Drawing.Image]::FromFile($path)
  if ($img.Width -le $maxW) {
    $nw = $img.Width
    $nh = $img.Height
  } else {
    $nw = $maxW
    $nh = [int]($img.Height * ($maxW / $img.Width))
  }
  $bmp = New-Object System.Drawing.Bitmap $nw, $nh
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.DrawImage($img, 0, 0, $nw, $nh)
  $outPath = Join-Path $outDir $f
  $bmp.Save($outPath, $codec, $encParams)
  $g.Dispose()
  $bmp.Dispose()
  $img.Dispose()
  $kb = [math]::Round((Get-Item $outPath).Length / 1KB, 1)
  Write-Host "OK $f -> ${kb} KB"
}
