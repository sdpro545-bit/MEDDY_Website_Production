const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const originalsDir = path.resolve('public/images/_originals');
const targetAssetsDir = path.resolve('assets-original/images');
const manifestPath = path.resolve('assets-original/manifest.json');

if (!fs.existsSync(targetAssetsDir)) {
  fs.mkdirSync(targetAssetsDir, { recursive: true });
}

function getSha256(filePath) {
  const buffer = fs.readFileSync(filePath);
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

const manifest = {
  created_at: new Date().toISOString(),
  description: "Untouched original source assets for MEDDY Global Solutions Ltd before brand and subject retouches.",
  files: {}
};

// Copy all pristine originals
const originalFiles = fs.readdirSync(originalsDir);
for (const file of originalFiles) {
  const src = path.join(originalsDir, file);
  const dest = path.join(targetAssetsDir, file);
  fs.copyFileSync(src, dest);
  const sha = getSha256(dest);
  manifest.files[file] = {
    sha256: sha,
    size_bytes: fs.statSync(dest).size,
    source: 'public/images/_originals/' + file
  };
  console.log(`Backed up: ${file} (SHA: ${sha.slice(0, 12)}...)`);
}

// Check marine_temp.jpg
const marineTempSource = path.resolve('../MEDDY_Website_Production/public/images/marine_temp.jpg');
if (fs.existsSync(marineTempSource)) {
  const destMarine = path.join(targetAssetsDir, 'marine_temp.jpg');
  fs.copyFileSync(marineTempSource, destMarine);
  const sha = getSha256(destMarine);
  manifest.files['marine_temp.jpg'] = {
    sha256: sha,
    size_bytes: fs.statSync(destMarine).size,
    source: 'marine_temp.jpg (unreferenced high-res source)'
  };
  console.log(`Moved marine_temp.jpg into assets-original/images/ (SHA: ${sha.slice(0, 12)}...)`);
}

fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
console.log(`\nWrote manifest to: ${manifestPath}`);
console.log(`Total backed-up files: ${Object.keys(manifest.files).length}`);

