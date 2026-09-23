Add-Type -AssemblyName System.Drawing

$sourcePath = Join-Path $PSScriptRoot '..\public\image\personal\bassam-elshoraa-portrait-2026.png'
$outputPath = Join-Path $PSScriptRoot '..\public\image\personal\bassam-elshoraa-portrait-2026-optimized.jpg'
$image = [System.Drawing.Image]::FromFile($sourcePath)
try {
    $bitmap = New-Object System.Drawing.Bitmap(800, 800)
    try {
        $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
        try {
            $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
            $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
            $graphics.DrawImage($image, 0, 0, 800, 800)
        } finally {
            $graphics.Dispose()
        }
        $codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' } | Select-Object -First 1
        $parameters = New-Object System.Drawing.Imaging.EncoderParameters(1)
        $parameters.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]85)
        $bitmap.Save($outputPath, $codec, $parameters)
        $parameters.Dispose()
    } finally {
        $bitmap.Dispose()
    }
} finally {
    $image.Dispose()
}

Get-Item -LiteralPath $sourcePath, $outputPath | Select-Object Name, Length
