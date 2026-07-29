import fs from 'fs';
import path from 'path';

const walkSync = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {
    const dirFile = path.join(dir, file);
    try {
      filelist = walkSync(dirFile, filelist);
    } catch (err) {
      if (err.code === 'ENOTDIR' || err.code === 'EBADF') filelist = [...filelist, dirFile];
    }
  });
  return filelist;
};

const files = walkSync('./frontend/src');

files.forEach(file => {
  if (file.endsWith('.jsx') || file.endsWith('.js') || file.endsWith('.tsx') || file.endsWith('.ts')) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Replace hardcoded white colors with foreground to respect light/dark mode
    // Using regex to match Tailwind classes: text-white, text-white/50, bg-white/5, border-white/10
    
    // 1. text-white variants
    content = content.replace(/text-white(\/[0-9]+)?/g, 'text-foreground$1');
    
    // 2. bg-white variants (usually with opacity like bg-white/5 for glass effects)
    content = content.replace(/bg-white(\/[0-9]+)?/g, 'bg-foreground$1');
    
    // 3. border-white variants
    content = content.replace(/border-white(\/[0-9]+)?/g, 'border-foreground$1');
    
    // 4. ring-white variants
    content = content.replace(/ring-white(\/[0-9]+)?/g, 'ring-foreground$1');
    
    // Write back
    fs.writeFileSync(file, content, 'utf8');
  }
});

console.log('Refactoring complete.');
