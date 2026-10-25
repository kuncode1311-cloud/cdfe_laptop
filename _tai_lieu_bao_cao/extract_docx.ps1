Add-Type -AssemblyName System.IO.Compression.FileSystem
$docxPath = "E:\Desktop\trikun\chuyende_FRONTREND\LAPTOP_NEW\_tai_lieu_bao_cao\501240045_LeMinhTri.docx"
$zip = [System.IO.Compression.ZipFile]::OpenRead($docxPath)
$entry = $zip.GetEntry("word/document.xml")
$stream = $entry.Open()
$reader = New-Object System.IO.StreamReader($stream, [System.Text.Encoding]::UTF8)
$xmlContent = $reader.ReadToEnd()
$reader.Close()
$stream.Close()
$zip.Dispose()

$paragraphs = [regex]::Matches($xmlContent, '<w:p[ >].*?</w:p>')
$lines = [System.Collections.Generic.List[string]]::new()

foreach ($p in $paragraphs) {
    $texts = [regex]::Matches($p.Value, '<w:t[^>]*>(.*?)</w:t>')
    $t = ($texts | ForEach-Object { $_.Groups[1].Value }) -join ''
    if (![string]::IsNullOrWhiteSpace($t)) {
        $lines.Add($t)
    }
}

$outPath = "E:\Desktop\trikun\chuyende_FRONTREND\LAPTOP_NEW\_tai_lieu_bao_cao\extracted_report_text.txt"
[System.IO.File]::WriteAllLines($outPath, $lines, [System.Text.Encoding]::UTF8)
Write-Host "Successfully extracted $($lines.Count) lines to $outPath"
