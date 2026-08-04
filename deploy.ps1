# ============================================================
# deploy.ps1 - GitHub Pages 部署准备脚本
# 自动排除本地管理工具文件，生成可上传的部署文件夹
# 使用方法：右键 -> 使用 PowerShell 运行
# ============================================================

$ErrorActionPreference = "Stop"

# 配置
$SourceDir = $PSScriptRoot
$DeployDir = Join-Path $SourceDir "deploy"
$ExcludeFiles = @(
    "admin-generator.html",
    "build-admin.js",
    "optimize-meta.js",
    "deploy.ps1",
    "js\admin-core.js",
    "js\admin-articles.js",
    "js\admin-apps.js",
    "js\admin-banner.js"
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "RollingQuate GitHub Pages 部署准备" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 清理旧的 deploy 文件夹
if (Test-Path $DeployDir) {
    Write-Host "清理旧的部署文件夹..." -ForegroundColor Yellow
    Remove-Item $DeployDir -Recurse -Force
}

# 创建 deploy 文件夹
Write-Host "创建部署文件夹：$DeployDir" -ForegroundColor Green
New-Item -ItemType Directory -Path $DeployDir -Force | Out-Null

# 复制文件（排除管理工具）
Write-Host "复制网站文件（排除管理工具）..." -ForegroundColor Green
$AllFiles = Get-ChildItem -Path $SourceDir -Recurse -File

foreach ($file in $AllFiles) {
    $RelativePath = $file.FullName.Substring($SourceDir.Length + 1)

    # 检查是否在排除列表中
    $ShouldExclude = $false
    foreach ($exclude in $ExcludeFiles) {
        if ($RelativePath -eq $exclude -or $RelativePath -like "$exclude\*") {
            $ShouldExclude = $true
            break
        }
    }

    # 排除 deploy 文件夹本身
    if ($RelativePath -like "deploy\*") {
        $ShouldExclude = $true
    }

    if (-not $ShouldExclude) {
        $DestPath = Join-Path $DeployDir $RelativePath
        $DestDir = Split-Path $DestPath -Parent

        if (-not (Test-Path $DestDir)) {
            New-Item -ItemType Directory -Path $DestDir -Force | Out-Null
        }

        Copy-Item $file.FullName $DestPath -Force
    }
}

# 统计
$FileCount = (Get-ChildItem -Path $DeployDir -Recurse -File).Count
$TotalSize = (Get-ChildItem -Path $DeployDir -Recurse -File | Measure-Object -Property Length -Sum).Sum / 1MB

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "部署准备完成！" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "文件数量：$FileCount" -ForegroundColor White
Write-Host "总大小：$([math]::Round($TotalSize, 2)) MB" -ForegroundColor White
Write-Host "部署文件夹：$DeployDir" -ForegroundColor White
Write-Host ""
Write-Host "下一步操作：" -ForegroundColor Yellow
Write-Host "1. 打开 $DeployDir" -ForegroundColor White
Write-Host "2. 将所有文件上传到 GitHub 仓库" -ForegroundColor White
Write-Host "3. 在仓库 Settings -> Pages 中启用 GitHub Pages" -ForegroundColor White
Write-Host "4. 访问 https://你的用户名.github.io/仓库名/" -ForegroundColor White
Write-Host ""
Write-Host "按任意键退出..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
