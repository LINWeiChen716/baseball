$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $PSScriptRoot
$requiredFiles = @('index.html','article.html','AGENTS.md','assets/style.css','assets/content.js','assets/app.js','templates/lesson.js','README.md','SUBMISSION.md')
foreach ($file in $requiredFiles) {
    if (-not (Test-Path -LiteralPath (Join-Path $projectRoot $file))) { throw "Missing file: $file" }
}
$raw = Get-Content -LiteralPath (Join-Path $projectRoot 'assets/content.js') -Raw -Encoding UTF8
$json = $raw -replace '^\s*window\.LESSONS\s*=\s*', '' -replace ';\s*$', ''
$lessons = $json | ConvertFrom-Json
if ($lessons.Count -eq 0) { throw 'No lessons' }
$ids = @{}
$categories = @(
    (-join ([char[]]@(0x89C0,0x8CFD,0x5165,0x9580)))
    (-join ([char[]]@(0x5834,0x4E0A,0x4F4D,0x7F6E)))
    (-join ([char[]]@(0x6578,0x64DA,0x7B46,0x8A18)))
)
foreach ($lesson in $lessons) {
    if ($lesson.id -notmatch '^[a-z]+(-[a-z]+)*$' -or $ids.ContainsKey($lesson.id)) { throw "Invalid or duplicate id: $($lesson.id)" }
    $ids[$lesson.id] = $true
    foreach ($field in @('title','category','summary','example','takeaway')) {
        if ([string]::IsNullOrWhiteSpace($lesson.$field)) { throw "Missing $field in $($lesson.id)" }
    }
    if ($lesson.category -notin $categories) { throw "Invalid category: $($lesson.id)" }
    if ($lesson.minutes -lt 1 -or $lesson.minutes -ne [math]::Floor($lesson.minutes)) { throw "Invalid minutes: $($lesson.id)" }
    if (@($lesson.sections).Count -lt 3) { throw "Too few sections: $($lesson.id)" }
    foreach ($section in $lesson.sections) {
        if (-not $section.heading -or -not $section.text) { throw "Empty section: $($lesson.id)" }
    }
    $quiz = $lesson.quiz
    if (-not $quiz.question -or -not $quiz.explanation -or @($quiz.options).Count -lt 2 -or $null -eq $quiz.answer -or $quiz.answer -lt 0 -or $quiz.answer -ge $quiz.options.Count -or $quiz.answer -ne [math]::Floor($quiz.answer)) { throw "Invalid quiz: $($lesson.id)" }
    if (@($lesson.sources).Count -lt 1) { throw "Missing source: $($lesson.id)" }
    foreach ($source in $lesson.sources) {
        if (-not $source.label -or $source.url -notmatch '^https://' -or $source.checked -notmatch '^\d{4}-\d{2}-\d{2}$') { throw "Invalid source: $($lesson.id)" }
    }
}
foreach ($id in @('first-game','batting-average')) {
    if (-not $ids.ContainsKey($id)) { throw "Missing homepage target: $id" }
}
foreach ($html in @('index.html','article.html')) {
    $text = Get-Content -LiteralPath (Join-Path $projectRoot $html) -Raw -Encoding UTF8
    foreach ($match in [regex]::Matches($text, '(?:src|href)="([^"#?]+)')) {
        $link = $match.Groups[1].Value
        if ($link -match '^https?:') { continue }
        if (-not (Test-Path -LiteralPath (Join-Path $projectRoot $link))) { throw "Broken local reference in ${html}: $link" }
    }
}
Write-Output "PASS: $($lessons.Count) lessons, unique IDs, required fields, quizzes, sources and local page references."
