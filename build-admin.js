/* ============================================================
   build-admin.js - 构建脚本
   将 js/admin-core.js + admin-articles.js + admin-apps.js + admin-banner.js
   合并到 admin-generator.html 的 <script> 标签中
   修改模块后运行：node build-admin.js
   ============================================================ */

const fs = require('fs');
const path = require('path');

const rootDir = 'c:/Users/Huawei/Downloads/rollingquate';

// 读取 HTML 模板
const htmlPath = path.join(rootDir, 'admin-generator.html');
let html = fs.readFileSync(htmlPath, 'utf8');

// 读取所有 JS 模块
const modules = [
    'js/admin-core.js',
    'js/admin-articles.js',
    'js/admin-apps.js',
    'js/admin-banner.js'
];

let mergedJS = '';
for (const mod of modules) {
    const modPath = path.join(rootDir, mod);
    if (!fs.existsSync(modPath)) {
        console.warn('WARN: Module not found: ' + mod);
        continue;
    }
    const content = fs.readFileSync(modPath, 'utf8');
    mergedJS += '\n/* ===== ' + mod + ' ===== */\n' + content + '\n';
}

// 添加启动代码
mergedJS += '\n/* ===== 启动 ===== */\n';
mergedJS += '(function init() {\n';
mergedJS += '    if (!checkBrowser()) return;\n';
mergedJS += '    initLogin();\n';
mergedJS += '    initDirPicker();\n';
mergedJS += '    initArticleForm();\n';
mergedJS += '    initArticleRefresh();\n';
mergedJS += '    initAppForm();\n';
mergedJS += '    initAppRefresh();\n';
mergedJS += '    initBannerUpload();\n';
mergedJS += '    setDefaultDate("fDate");\n';
mergedJS += '})();\n';

// 替换 HTML 中的 <script> 标签
const scriptStart = html.indexOf('<script>');
const scriptEnd = html.indexOf('</script>', scriptStart);

if (scriptStart === -1 || scriptEnd === -1) {
    console.error('ERROR: Could not find <script> tags in admin-generator.html');
    process.exit(1);
}

const beforeScript = html.substring(0, scriptStart);
const afterScript = html.substring(scriptEnd + 9);

const newHTML = beforeScript + '<script>\n' + mergedJS + '</script>\n' + afterScript;

fs.writeFileSync(htmlPath, newHTML, 'utf8');
console.log('✓ admin-generator.html 已更新，所有模块已合并。');
console.log('  合并了 ' + modules.length + ' 个模块：');
modules.forEach(m => console.log('    - ' + m));
console.log('  总 JS 大小：' + mergedJS.length + ' bytes');
