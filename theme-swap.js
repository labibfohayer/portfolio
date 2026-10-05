const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf-8');
    
    // Swap black background for deep velvet red
    content = content.replace(/bg-black/g, 'bg-red-950'); 
    content = content.replace(/ring-black/g, 'ring-red-950');
    
    // Swap accents from blue to strong red
    content = content.replace(/blue-500/g, 'red-600');
    content = content.replace(/blue-400/g, 'red-500');
    content = content.replace(/blue-600/g, 'red-700');
    
    // Swap secondary gradients from purple to warm tones to match the red
    content = content.replace(/purple-500/g, 'orange-600');
    content = content.replace(/purple-600/g, 'orange-700');
    
    // Globals.css specific overrides
    if (filePath.endsWith('globals.css')) {
        content = content.replace(/--background: 0 0% 2%;/g, '--background: 355 70% 12%;'); 
    }

    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Updated: ${filePath}`);
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
console.log('Theme swap completed!');
