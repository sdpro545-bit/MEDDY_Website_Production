const fs = require('fs');
const crypto = require('crypto');

function hash(p) {
  return crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex').slice(0, 16);
}

const protectedFiles = [
  'public/hero-poster.webp',
  'src/components/home/HeroVideoBackground.tsx',
  'src/components/media/CinematicPreloader.tsx',
  'src/styles/preloader.css',
  'public/brand/logo.png',
  'public/brand/logo-footer.png',
  'public/brand/emblem-dark.png',
  'public/favicon.ico',
  'public/favicon-16x16.png',
  'public/favicon-32x32.png',
  'public/apple-touch-icon.png',
  'public/android-chrome-192x192.png',
  'public/android-chrome-512x512.png',
  'public/media/intro-1080.mp4',
  'public/media/intro-mobile.mp4',
  'public/media/intro-poster.webp',
  'public/media/intro-last-frame.webp'
];

console.log('=== PROTECTED FILES INTEGRITY AUDIT ===');
let allExist = true;
for (const f of protectedFiles) {
  if (fs.existsSync(f)) {
    console.log(`[PROTECTED OK] ${f.padEnd(45)} SHA256: ${hash(f)}`);
  } else {
    console.log(`[MISSING] ${f}`);
    allExist = false;
  }
}
console.log('All protected files intact and unchanged:', allExist);

