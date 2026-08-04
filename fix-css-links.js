/* ============================================================
   fix-css-links.js - 修复所有 HTML 页面丢失的 CSS 引用
   optimize-meta.js 替换 <head> 时把 <link rel="stylesheet"> 覆盖了
   ============================================================ */

const fs = require('fs');
const path = require('path');

const rootDir = 'c:/Users/Huawei/Downloads/rollingquate';

// 根目录页面（CSS 路径: css/style.css）
const rootPages = [
    'index.html', 'info.html', 'team-news.html', 'creation-column.html',
    'member-interaction.html', 'special-topics.html', 'app.html',
    'about.html', 'join.html', '404.html'
];

// 文章详情页（CSS 路径: ../css/style.css）
const artDir = path.join(rootDir, 'articles');
const artPages = fs.existsSync(artDir)
    ? fs.readdirSync(artDir).filter(f => f.endsWith('.html'))
    : [];

let fixed = 0;

function fixFile(filePath, cssLink) {
    let html = fs.readFileSync(filePath, 'utf8');
    if (html.includes('rel="stylesheet"')) {
        console.log('SKIP (already has CSS):', path.relative(rootDir, filePath));
        return;
    }
    // 在 </head> 前插入 CSS link
    html = html.replace('</head>', cssLink + '\n</head>');
    fs.writeFileSync(filePath, html, 'utf8');
    fixed++;
    console.log('FIXED:', path.relative(rootDir, filePath));
}

for (const f of rootPages) {
    const p = path.join(rootDir, f);
    if (fs.existsSync(p)) {
        fixFile(p, '    <link rel="stylesheet" href="css/style.css">');
    }
}

for (const f of artPages) {
    const p = path.join(artDir, f);
    fixFile(p, '    <link rel="stylesheet" href="../css/style.css">');
}

console.log(`\n✓ 修复了 ${fixed} 个文件的 CSS 引用。`);
