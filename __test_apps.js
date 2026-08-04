/* 精确模拟浏览器中 readAppsData 的行为 */

// 模拟 2 个应用的 apps-data.js 内容
const text = `/* RollingQuate 应用天地清单（JS 内嵌版，由 admin-generator 自动维护） */
window.RQ_APPS = [
  {
    "id": "app-001",
    "name": "OldApp",
    "version": "1.0",
    "description": "旧应用",
    "icon": "",
    "apk": "apps/app-001.apk",
    "size": "4.0 MB",
    "date": "2026-08-03",
    "author": "FALLEN"
  },
  {
    "id": "app-002",
    "name": "NewApp",
    "version": "2.0",
    "description": "新应用",
    "icon": "",
    "apk": "apps/app-002.apk",
    "size": "10.0 MB",
    "date": "2026-08-04",
    "author": "FALLEN"
  }
];
`;

console.log('=== 测试旧正则方法 ===');
var match = text.match(/window\.RQ_APPS\s*=\s*(\[[\s\S]*?\]);\s*$/m);
if (match) {
    console.log('匹配长度:', match[1].length);
    console.log('匹配内容末尾 50 字符:');
    console.log('...' + match[1].substring(match[1].length - 50));
    try {
        var apps = JSON.parse(match[1]);
        console.log('解析结果: ' + apps.length + ' 个应用');
        apps.forEach(function(a) { console.log('  - ' + a.name); });
    } catch(e) {
        console.log('JSON 解析失败: ' + e.message);
        // 尝试找出问题
        console.log('前 100 字符: ' + match[1].substring(0, 100));
        console.log('后 100 字符: ' + match[1].substring(match[1].length - 100));
    }
} else {
    console.log('正则完全没有匹配！');
}

console.log('\n=== 测试括号计数法 ===');
var idx = text.indexOf("window.RQ_APPS");
var eqIdx = text.indexOf("=", idx);
var startIdx = text.indexOf("[", eqIdx);
var depth = 0;
var endIdx = -1;
for (var i = startIdx; i < text.length; i++) {
    if (text[i] === "[") depth++;
    else if (text[i] === "]") {
        depth--;
        if (depth === 0) { endIdx = i; break; }
    }
}
var jsonStr = text.substring(startIdx, endIdx + 1);
try {
    var apps = JSON.parse(jsonStr);
    console.log('解析结果: ' + apps.length + ' 个应用');
    apps.forEach(function(a) { console.log('  - ' + a.name); });
} catch(e) {
    console.log('JSON 解析失败: ' + e.message);
}
