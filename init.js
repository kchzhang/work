const fs = require('fs');
const path = require('path');

function generateIndexHtml(dirPath) {
    // 读取目录内容
    const items = fs.readdirSync(dirPath, { withFileTypes: true });

    // 生成HTML内容
    let html = `<!DOCTYPE html>\n`;
    html += `<html lang="zh-CN">\n`;
    html += `<head>\n`;
    html += `    <meta charset="UTF-8">\n`;
    html += `    <title>${path.basename(dirPath)} 目录</title>\n`;
    html += `</head>\n`;
    html += `<body>\n`;
    html += `    <h1>${path.basename(dirPath)} 目录</h1>\n`;
    html += `    <p>当前目录路径: <a href="./${path.basename(dirPath)}"><code>./${path.basename(dirPath)}</code></a></p>\n`;
    html += `    <h2>目录内容</h2>\n`;
    html += `    <ul>\n`;

    for (const item of items) {
        const itemPath = path.join(dirPath, item.name);
        const relativePath = path.relative(dirPath, itemPath);
        const linkPath = item.isDirectory() ? `${relativePath}/index.html` : relativePath;

        html += `        <li><a href="${linkPath}"><code>${relativePath}</code></a></li>\n`;
    }

    html += `    </ul>\n`;
    html += `</body>\n`;
    html += `</html>\n`;

    // 写入index.html文件
    fs.writeFileSync(path.join(dirPath, 'index.html'), html, 'utf-8');
}

function generateIndexesRecursively(dirPath) {
    // 生成当前目录的index.html
    generateIndexHtml(dirPath);

    // 递归生成子目录的index.html
    const items = fs.readdirSync(dirPath, { withFileTypes: true });
    for (const item of items) {
        if (item.isDirectory()) {
            const subDirPath = path.join(dirPath, item.name);
            generateIndexesRecursively(subDirPath);
        }
    }
}

// 指定要生成index.html的根目录
const rootDir = './dist'; // 请替换为你实际的目录路径

// 确保根目录存在
if (!fs.existsSync(rootDir)) {
    console.error(`目录 ${rootDir} 不存在`);
    process.exit(1);
}

// 生成index.html文件
generateIndexesRecursively(rootDir);

console.log('所有目录的index.html文件已生成');