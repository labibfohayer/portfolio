const fs = require('fs');
let content = fs.readFileSync('src/components/Projects.tsx', 'utf-8');

// Replace the hardcoded array with an import
content = content.replace(
  /const projects = \[[\s\S]*?\n  }\n\];/g,
  `import siteData from "@/data.json";\n\nconst projects = siteData.projects;`
);

fs.writeFileSync('src/components/Projects.tsx', content, 'utf-8');
console.log('Replaced hardcoded projects with dynamic data.json import.');
