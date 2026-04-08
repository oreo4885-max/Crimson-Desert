param(
  [int]$Zoom = 11,
  [string]$OutputPath = "assets\pywel-main-world-z11.jpg",
  [int]$JpegQuality = 92
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$bounds = @{
  MinLat = 0.35
  MaxLat = 1.05
  MinLng = -1.07
  MaxLng = -0.38
}

$tileSize = 256
$tileBaseUrl = "https://crimsondesert.app/tiles/pywel"

function Get-TileIndex {
  param(
    [double]$Latitude,
    [double]$Longitude,
    [int]$Level
  )

  $scale = [math]::Pow(2, $Level)
  $x = [math]::Floor((($Longitude + 180.0) / 360.0) * $scale)
  $latRad = $Latitude * [math]::PI / 180.0
  $y = [math]::Floor((1.0 - ([math]::Log([math]::Tan($latRad) + (1.0 / [math]::Cos($latRad))) / [math]::PI)) / 2.0 * $scale)

  return @{
    X = [int]$x
    Y = [int]$y
  }
}

function Get-WorldPixel {
  param(
    [double]$Latitude,
    [double]$Longitude,
    [int]$Level
  )

  $scale = [math]::Pow(2, $Level) * $tileSize
  $x = (($Longitude + 180.0) / 360.0) * $scale
  $latRad = $Latitude * [math]::PI / 180.0
  $y = (1.0 - ([math]::Log([math]::Tan($latRad) + (1.0 / [math]::Cos($latRad))) / [math]::PI)) / 2.0 * $scale

  return @{
    X = $x
    Y = $y
  }
}

function Save-Jpeg {
  param(
    [System.Drawing.Bitmap]$Bitmap,
    [string]$Path,
    [int]$Quality
  )

  $encoder = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() |
    Where-Object { $_.MimeType -eq "image/jpeg" } |
    Select-Object -First 1

  $encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
  $qualityValue = [long]([math]::Max(1, [math]::Min(100, $Quality)))
  $encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter(
    [System.Drawing.Imaging.Encoder]::Quality,
    $qualityValue
  )

  try {
    $Bitmap.Save($Path, $encoder, $encoderParams)
  } finally {
    $encoderParams.Dispose()
  }
}

Add-Type -AssemblyName System.Drawing

$outputFullPath = Resolve-Path -Path "." | ForEach-Object { Join-Path $_.Path $OutputPath }
$outputDirectory = Split-Path -Parent $outputFullPath
New-Item -ItemType Directory -Force -Path $outputDirectory | Out-Null

$northWestTile = Get-TileIndex -Latitude $bounds.MaxLat -Longitude $bounds.MinLng -Level $Zoom
$southEastTile = Get-TileIndex -Latitude $bounds.MinLat -Longitude $bounds.MaxLng -Level $Zoom

$tileColumns = $southEastTile.X - $northWestTile.X + 1
$tileRows = $southEastTile.Y - $northWestTile.Y + 1

$stitchedWidth = $tileColumns * $tileSize
$stitchedHeight = $tileRows * $tileSize

$stitchedBitmap = New-Object System.Drawing.Bitmap($stitchedWidth, $stitchedHeight)
$stitchedGraphics = [System.Drawing.Graphics]::FromImage($stitchedBitmap)
$stitchedGraphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
$stitchedGraphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$stitchedGraphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

$webClient = New-Object System.Net.WebClient

try {
  foreach ($tileY in $northWestTile.Y..$southEastTile.Y) {
    foreach ($tileX in $northWestTile.X..$southEastTile.X) {
      $url = "$tileBaseUrl/$Zoom/$tileX/$tileY.jpg"
      $tileBytes = $webClient.DownloadData($url)

      $stream = New-Object System.IO.MemoryStream(,$tileBytes)
      $tileImage = [System.Drawing.Image]::FromStream($stream)

      try {
        $drawX = ($tileX - $northWestTile.X) * $tileSize
        $drawY = ($tileY - $northWestTile.Y) * $tileSize
        $stitchedGraphics.DrawImage($tileImage, $drawX, $drawY, $tileSize, $tileSize)
      } finally {
        $tileImage.Dispose()
        $stream.Dispose()
      }
    }
  }

  $northWestPixel = Get-WorldPixel -Latitude $bounds.MaxLat -Longitude $bounds.MinLng -Level $Zoom
  $southEastPixel = Get-WorldPixel -Latitude $bounds.MinLat -Longitude $bounds.MaxLng -Level $Zoom

  $cropLeft = [int][math]::Floor($northWestPixel.X - ($northWestTile.X * $tileSize))
  $cropTop = [int][math]::Floor($northWestPixel.Y - ($northWestTile.Y * $tileSize))
  $cropRight = [int][math]::Ceiling($southEastPixel.X - ($northWestTile.X * $tileSize))
  $cropBottom = [int][math]::Ceiling($southEastPixel.Y - ($northWestTile.Y * $tileSize))

  $cropWidth = $cropRight - $cropLeft
  $cropHeight = $cropBottom - $cropTop

  $croppedBitmap = New-Object System.Drawing.Bitmap($cropWidth, $cropHeight)
  $croppedGraphics = [System.Drawing.Graphics]::FromImage($croppedBitmap)
  $sourceRectangle = New-Object System.Drawing.Rectangle($cropLeft, $cropTop, $cropWidth, $cropHeight)
  $destinationRectangle = New-Object System.Drawing.Rectangle(0, 0, $cropWidth, $cropHeight)

  try {
    $croppedGraphics.DrawImage($stitchedBitmap, $destinationRectangle, $sourceRectangle, [System.Drawing.GraphicsUnit]::Pixel)
    Save-Jpeg -Bitmap $croppedBitmap -Path $outputFullPath -Quality $JpegQuality
  } finally {
    $croppedGraphics.Dispose()
    $croppedBitmap.Dispose()
  }
} finally {
  $webClient.Dispose()
  $stitchedGraphics.Dispose()
  $stitchedBitmap.Dispose()
}

Write-Output "Saved $outputFullPath"
Write-Output "Zoom=$Zoom"
Write-Output "TileRangeX=$($northWestTile.X)..$($southEastTile.X)"
Write-Output "TileRangeY=$($northWestTile.Y)..$($southEastTile.Y)"
Write-Output "BoundsLat=$($bounds.MinLat)..$($bounds.MaxLat)"
Write-Output "BoundsLng=$($bounds.MinLng)..$($bounds.MaxLng)"
