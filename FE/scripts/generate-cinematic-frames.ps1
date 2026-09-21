$ErrorActionPreference = 'Stop'

$projectRoot = Split-Path -Parent $PSScriptRoot
$outputDirectory = Join-Path $projectRoot 'public\cinematic\frames'
$manifestPath = Join-Path $projectRoot 'public\cinematic\manifest.json'
$videoDirectory = Join-Path $projectRoot 'public\videos'

New-Item -ItemType Directory -Force -Path $outputDirectory | Out-Null

$inputs = @(
  (Join-Path $videoDirectory '12_1080p_202608250918.mp4'),
  (Join-Path $videoDirectory '23_1080p_202608250948.mp4'),
  (Join-Path $videoDirectory '34_1080p_202608250924.mp4'),
  (Join-Path $videoDirectory '45_1080p_202608250925.mp4')
)

foreach ($inputPath in $inputs) {
  if (-not (Test-Path -LiteralPath $inputPath)) { throw "Missing source video: $inputPath" }
}

$arguments = @('-hide_banner', '-y')
foreach ($inputPath in $inputs) { $arguments += @('-i', $inputPath) }
$arguments += @(
  '-filter_complex',
  '[0:v][1:v][2:v][3:v]concat=n=4:v=1:a=0,fps=24,scale=1600:-2:force_original_aspect_ratio=decrease:flags=lanczos,format=yuv420p[v]',
  '-map', '[v]',
  '-c:v', 'libwebp',
  '-quality', '78',
  '-compression_level', '5',
  (Join-Path $outputDirectory 'frame_%05d.webp')
)

& ffmpeg @arguments
if ($LASTEXITCODE -ne 0) { throw "FFmpeg failed with exit code $LASTEXITCODE" }

$audioArguments = @('-hide_banner', '-y')
foreach ($inputPath in $inputs) { $audioArguments += @('-i', $inputPath) }
$audioArguments += @(
  '-filter_complex', '[0:a][1:a][2:a][3:a]concat=n=4:v=0:a=1[a]',
  '-map', '[a]', '-c:a', 'aac', '-b:a', '128k',
  (Join-Path $projectRoot 'public\cinematic\cinematic-audio.m4a')
)
& ffmpeg @audioArguments
if ($LASTEXITCODE -ne 0) { throw "Audio generation failed with exit code $LASTEXITCODE" }

$frames = Get-ChildItem -LiteralPath $outputDirectory -Filter 'frame_*.webp' |
  Sort-Object Name |
  ForEach-Object { "/cinematic/frames/$($_.Name)" }

@{ frames = @($frames) } |
  ConvertTo-Json -Depth 3 |
  Set-Content -LiteralPath $manifestPath -Encoding utf8

Write-Host "Generated $($frames.Count) WebP frames and updated $manifestPath"
