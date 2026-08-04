/* ============================================================
   optimize-meta.js - 批量优化所有 HTML 页面的 meta 标签
   添加：Open Graph、Twitter Card、SEO description、favicon
   ============================================================ */

const fs = require('fs');
const path = require('path');

const rootDir = 'c:/Users/Huawei/Downloads/rollingquate';

// 页面元数据配置
const pageMeta = {
    'index.html': {
        title: 'RollingQuate 创作信息公示平台 - 首页',
        desc: 'RollingQuate 创作信息公示平台，滚动天空饭制同人爱好者创作社群。发布团队动态、创作专栏、专题汇总等内容。'
    },
    'info.html': {
        title: '信息发布 - RollingQuate 创作信息公示平台',
        desc: 'RollingQuate 团队信息发布栏目，包含团队公告、重要通知等。'
    },
    'team-news.html': {
        title: '团队新闻 - RollingQuate 创作信息公示平台',
        desc: 'RollingQuate 团队新闻动态，记录团队发展历程与重要事件。'
    },
    'creation-column.html': {
        title: '创作专栏 - RollingQuate 创作信息公示平台',
        desc: 'RollingQuate 创作专栏，展示团队高质量滚动的天空饭制关卡作品。'
    },
    'member-interaction.html': {
        title: '社员互动 - RollingQuate 创作信息公示平台',
        desc: 'RollingQuate 社员互动栏目，社群内部交流分享。'
    },
    'special-topics.html': {
        title: '专题汇总 - RollingQuate 创作信息公示平台',
        desc: 'RollingQuate 专题汇总，整理团队创作主题与系列内容。'
    },
    'app.html': {
        title: '应用天地 - RollingQuate 创作信息公示平台',
        desc: 'RollingQuate 应用天地，提供团队开发的 APK 应用下载。'
    },
    'about.html': {
        title: '团队概况 - RollingQuate 创作信息公示平台',
        desc: 'RollingQuate 团队概况，介绍团队发展历程与创作方向。'
    },
    'join.html': {
        title: '入队申请指引 - RollingQuate 创作信息公示平台',
        desc: 'RollingQuate 入队申请指引，了解团队招募信息。'
    },
    '404.html': {
        title: '页面未找到 - RollingQuate 创作信息公示平台',
        desc: '您访问的页面不存在。'
    }
};

// 文章详情页（articles/ 目录下）
const articlePages = fs.readdirSync(path.join(rootDir, 'articles'))
    .filter(f => f.endsWith('.html'))
    .reduce((acc, f) => {
        acc['articles/' + f] = {
            title: '文章详情 - RollingQuate 创作信息公示平台',
            desc: 'RollingQuate 创作信息公示平台文章详情页面。'
        };
        return acc;
    }, {});

Object.assign(pageMeta, articlePages);

// 生成 meta 标签 HTML
function generateMetaTags(title, desc) {
    return `    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <meta name="description" content="${desc}">
    <meta name="keywords" content="RollingQuate,滚动的天空,饭制,同人,关卡创作,游戏">
    <meta name="author" content="FALLEN">
    <meta name="robots" content="index, follow">

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${desc}">
    <meta property="og:site_name" content="RollingQuate 创作信息公示平台">
    <meta property="og:locale" content="zh_CN">

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary">
    <meta name="twitter:title" content="${title}">
    <meta name="twitter:description" content="${desc}">

    <!-- Favicon -->
    <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'></text></svg>">`;
}

// 处理所有 HTML 文件
let updatedCount = 0;
for (const [file, meta] of Object.entries(pageMeta)) {
    const filePath = path.join(rootDir, file);
    if (!fs.existsSync(filePath)) {
        console.log('SKIP (not found):', file);
        continue;
    }

    let html = fs.readFileSync(filePath, 'utf8');

    // 替换 <head> 内的 meta 标签
    const headStart = html.indexOf('<head>');
    const headEnd = html.indexOf('</head>');

    if (headStart === -1 || headEnd === -1) {
        console.log('SKIP (no head):', file);
        continue;
    }

    const beforeHead = html.substring(0, headStart + 6);
    const afterHead = html.substring(headEnd);

    const newMeta = generateMetaTags(meta.title, meta.desc);
    const newHTML = beforeHead + '\n' + newMeta + '\n' + afterHead;

    fs.writeFileSync(filePath, newHTML, 'utf8');
    updatedCount++;
    console.log('OK:', file);
}

console.log(`\n✓ 已更新 ${updatedCount} 个 HTML 文件的 meta 标签。`);
