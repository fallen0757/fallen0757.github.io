/* ============================================================
   deploy.js - GitHub Pages 部署准备脚本
   自动排除本地管理工具文件，生成 deploy/ 文件夹
   使用方法：node deploy.js
   ============================================================ */

const fs = require('fs');
const path = require('path');

const sourceDir = __dirname;
const deployDir = path.join(sourceDir, 'deploy');

// 排除文件/目录列表
const excludePatterns = [
    'admin-generator.html',
    'build-admin.js',
    'optimize-meta.js',
    'fix-css-links.js',
    'deploy.js',
    'deploy.ps1',
    '__test_apps.js',
    '.admin-tools',
    '.github',
    'deploy',
    'js/admin-core.js',
    'js/admin-articles.js',
    'js/admin-apps.js',
    'js/admin-banner.js'
];

function shouldExclude(relPath) {
    for (const pattern of excludePatterns) {
        if (relPath === pattern || relPath.startsWith(pattern + '/') || relPath.startsWith(pattern + '\\')) {
            return true;
        }
    }
    return false;
}

// 清理旧的 deploy 文件夹
if (fs.existsSync(deployDir)) {
    console.log('清理旧的部署文件夹...');
    fs.rmSync(deployDir, { recursive: true, force: true });
}

// 创建 deploy 文件夹
fs.mkdirSync(deployDir, { recursive: true });

// 复制文件
let fileCount = 0;
let totalSize = 0;

function copyDir(src, dest) {
    const entries = fs.readdirSync(src, { withFileTypes: true });
    for (const entry of entries) {
        // 跳过 deploy 文件夹本身（防止递归复制）
        if (entry.name === 'deploy') continue;

        const srcPath = path.join(src, entry.name);
        const relPath = path.relative(sourceDir, srcPath).replace(/\\/g, '/');

        if (shouldExclude(relPath)) continue;

        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            fs.mkdirSync(destPath, { recursive: true });
            copyDir(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
            fileCount++;
            totalSize += fs.statSync(srcPath).size;
            console.log('  ' + relPath);
        }
    }
}

console.log('========================================');
console.log('RollingQuate GitHub Pages 部署准备');
console.log('========================================\n');
console.log('复制网站文件（排除管理工具）...');

copyDir(sourceDir, deployDir);

const sizeMB = (totalSize / 1024 / 1024).toFixed(2);

console.log('\n========================================');
console.log('部署准备完成！');
console.log('========================================');
console.log('文件数量：' + fileCount);
console.log('总大小：' + sizeMB + ' MB');
console.log('部署文件夹：' + deployDir);
console.log('\n下一步操作：');
console.log('1. 打开 deploy 文件夹');
console.log('2. 将所有文件上传到 GitHub 仓库 fallen0757/rollingquate');
console.log('3. 在仓库 Settings -> Pages 中启用 GitHub Pages');
console.log('4. 访问 https://fallen0757.github.io/rollingquate/');
