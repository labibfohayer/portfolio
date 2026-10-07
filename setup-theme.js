const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf-8');
    
    // Replace specific strings
    content = content.replace(/rgba\(6,\s*182,\s*212,/g, 'rgba(var(--theme-rgb),');
    content = content.replace(/#06b6d4/ig, 'rgb(var(--theme-rgb))');
    
    fs.writeFileSync(filePath, content, 'utf-8');
}

function walkDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walkDir(fullPath);
        } else {
            if (fullPath.endsWith('.tsx') || fullPath.endsWith('.css') || fullPath.endsWith('.ts')) {
                replaceInFile(fullPath);
            }
        }
    }
}

walkDir('C:/Users/assdi/.gemini/antigravity/scratch/portfolio/src');
console.log('Done replacing hardcoded hex/rgba!');
