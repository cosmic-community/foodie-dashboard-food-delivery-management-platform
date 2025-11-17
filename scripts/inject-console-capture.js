const fs = require('fs');
const path = require('path');

const buildDir = path.join(process.cwd(), '.next', 'server', 'app');
const scriptTag = '<script src="/dashboard-console-capture.js"></script>';

function injectScript(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    if (content.includes('dashboard-console-capture.js')) {
      return;
    }
    
    if (content.includes('</head>')) {
      content = content.replace('</head>', `${scriptTag}</head>`);
      fs.writeFileSync(filePath, content);
      console.log(`✓ Injected console capture script into ${path.basename(filePath)}`);
    }
  } catch (error) {
    console.error(`Error injecting script into ${filePath}:`, error.message);
  }
}

function walkDir(dir) {
  if (!fs.existsSync(dir)) {
    console.log('Build directory not found. Script injection skipped.');
    return;
  }
  
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      walkDir(filePath);
    } else if (file.endsWith('.html')) {
      injectScript(filePath);
    }
  });
}

console.log('Injecting console capture script into HTML files...');
walkDir(buildDir);
console.log('Console capture script injection complete!');