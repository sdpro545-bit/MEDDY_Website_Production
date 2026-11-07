const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const crypto = require('crypto');

const FONTS_PATH = path.resolve('public/fonts/Manrope.ttf');
let fontBase64 = '';
if (fs.existsSync(FONTS_PATH)) {
  fontBase64 = fs.readFileSync(FONTS_PATH).toString('base64');
}

const LOGO_LIGHT_PATH = path.resolve('public/brand/logo.png');
const LOGO_DARK_PATH = path.resolve('public/brand/logo-footer.png');
const PLACEMENTS_DIR = path.resolve('tools/branding/placements');
const OUTPUT_DIR = path.resolve('public/images');
const QA_DIR = path.resolve('qa/image-branding');

fs.mkdirSync(QA_DIR, { recursive: true });

function getFontDef() {
  if (!fontBase64) return '';
  return `
    @font-face {
      font-family: 'Manrope';
      src: url('data:font/truetype;charset=utf-8;base64,${fontBase64}') format('truetype');
      font-weight: 800;
      font-style: normal;
    }
  `;
}

// 1. White Embroidered Chest Patch Generator
async function createChestPatch(w, h) {
  const logoBuf = await sharp(LOGO_LIGHT_PATH).resize(Math.round(w * 0.38)).toBuffer();
  const logoBase64 = logoBuf.toString('base64');

  const svg = `
  <svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <style>
        ${getFontDef()}
        .bold-text { font-family: 'Manrope', sans-serif; font-weight: 800; fill: #292D32; }
        .sub-text { font-family: 'Manrope', sans-serif; font-weight: 600; fill: #0CA3DC; }
      </style>
      <filter id="shadow" x="-5%" y="-5%" width="110%" height="110%">
        <feDropShadow dx="0" dy="1" stdDeviation="1" flood-color="#000" flood-opacity="0.35"/>
      </filter>
    </defs>
    <!-- White woven fabric patch base -->
    <rect x="2" y="2" width="${w - 4}" height="${h - 4}" rx="6" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="1.5" filter="url(#shadow)"/>
    <!-- Simulated perimeter stitching border -->
    <rect x="4" y="4" width="${w - 8}" height="${h - 8}" rx="4" fill="none" stroke="#CBD5E1" stroke-width="1" stroke-dasharray="3,2"/>
    
    <!-- Logo Emblem -->
    <image href="data:image/png;base64,${logoBase64}" x="8" y="${Math.round((h - (w * 0.38 * 1.15)) / 2)}" width="${Math.round(w * 0.38)}" height="${Math.round(w * 0.38 * 1.15)}" />
    
    <!-- Official Typography -->
    <text x="${Math.round(w * 0.44)}" y="${Math.round(h * 0.44)}" font-size="${Math.max(10, Math.round(h * 0.28))}" class="bold-text" letter-spacing="0.5">MEDDY GLOBAL</text>
    <text x="${Math.round(w * 0.44)}" y="${Math.round(h * 0.74)}" font-size="${Math.max(8, Math.round(h * 0.22))}" class="sub-text" letter-spacing="0.8">SOLUTIONS LTD</text>
  </svg>
  `;
  return Buffer.from(svg);
}

// 2. Large Rear Corporate Back Patch
async function createRearPatch(w, h) {
  const logoBuf = await sharp(LOGO_LIGHT_PATH).resize(Math.round(w * 0.26)).toBuffer();
  const logoBase64 = logoBuf.toString('base64');

  const svg = `
  <svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <style>
        ${getFontDef()}
        .main-text { font-family: 'Manrope', sans-serif; font-weight: 800; fill: #292D32; }
      </style>
      <filter id="back-shadow" x="-5%" y="-5%" width="110%" height="110%">
        <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000" flood-opacity="0.4"/>
      </filter>
    </defs>
    <rect x="2" y="2" width="${w - 4}" height="${h - 4}" rx="8" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="2" filter="url(#back-shadow)"/>
    <rect x="5" y="5" width="${w - 10}" height="${h - 10}" rx="6" fill="none" stroke="#CBD5E1" stroke-width="1.5" stroke-dasharray="4,2.5"/>
    
    <!-- Centred Logo -->
    <image href="data:image/png;base64,${logoBase64}" x="${Math.round((w - (w * 0.26)) / 2)}" y="6" width="${Math.round(w * 0.26)}" height="${Math.round(w * 0.26 * 1.15)}" />
    
    <!-- Full Name in charcoal capitals underneath -->
    <text x="50%" y="${Math.round(h * 0.88)}" text-anchor="middle" font-size="${Math.max(10, Math.round(h * 0.19))}" class="main-text" letter-spacing="1">MEDDY GLOBAL SOLUTIONS LTD</text>
  </svg>
  `;
  return Buffer.from(svg);
}

// 3. Helmet Emblem (Spherical curve with ABS gloss highlight)
async function createHelmetLogo(w, h) {
  const logoBuf = await sharp(LOGO_LIGHT_PATH).resize(w, h, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).toBuffer();
  const logoBase64 = logoBuf.toString('base64');

  const svg = `
  <svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <!-- Subtle curved gloss gradient matching ABS shell -->
      <linearGradient id="gloss" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.35"/>
        <stop offset="50%" stop-color="#ffffff" stop-opacity="0"/>
        <stop offset="100%" stop-color="#000000" stop-opacity="0.2"/>
      </linearGradient>
    </defs>
    <image href="data:image/png;base64,${logoBase64}" x="0" y="0" width="${w}" height="${h}" />
    <rect x="0" y="0" width="${w}" height="${h}" fill="url(#gloss)" style="mix-blend-mode: overlay;"/>
  </svg>
  `;
  return Buffer.from(svg);
}

// 4. Industrial Stainless Steel / Anodized Equipment Nameplate
async function createIndustrialPlacard(w, h, text, isDark = false) {
  const logoSrc = isDark ? LOGO_DARK_PATH : LOGO_LIGHT_PATH;
  const logoBuf = await sharp(logoSrc).resize(Math.round(h * 0.75)).toBuffer();
  const logoBase64 = logoBuf.toString('base64');

  const bgGrad = isDark
    ? 'linear-gradient(135deg, #101E2B 0%, #06121F 100%)'
    : 'linear-gradient(135deg, #F1F5F9 0%, #E2E8F0 100%)';
  const textColor = isDark ? '#FFFFFF' : '#0F172A';
  const subColor = isDark ? '#0CA3DC' : '#0284C7';
  const rivetColor = isDark ? '#334155' : '#94A3B8';

  const svg = `
  <svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <style>
        ${getFontDef()}
        .brand-title { font-family: 'Manrope', sans-serif; font-weight: 800; fill: ${textColor}; }
        .brand-sub { font-family: 'Manrope', sans-serif; font-weight: 600; fill: ${subColor}; }
      </style>
      <filter id="plate-shadow" x="-3%" y="-5%" width="106%" height="115%">
        <feDropShadow dx="0" dy="2" stdDeviation="2.5" flood-color="#000" flood-opacity="0.45"/>
      </filter>
    </defs>
    
    <!-- Metal chassis plate with bevel and shadow -->
    <rect x="2" y="2" width="${w - 4}" height="${h - 4}" rx="6" fill="${isDark ? '#06121F' : '#E2E8F0'}" stroke="${isDark ? '#0CA3DC' : '#CBD5E1'}" stroke-width="1.5" filter="url(#plate-shadow)"/>
    <rect x="5" y="5" width="${w - 10}" height="${h - 10}" rx="4" fill="none" stroke="${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)'}" stroke-width="1"/>
    
    <!-- Precision corner hex-bolts -->
    <circle cx="12" cy="12" r="3" fill="${rivetColor}"/>
    <circle cx="${w - 12}" cy="12" r="3" fill="${rivetColor}"/>
    <circle cx="12" cy="${h - 12}" r="3" fill="${rivetColor}"/>
    <circle cx="${w - 12}" cy="${h - 12}" r="3" fill="${rivetColor}"/>
    
    <!-- Official Logo Emblem -->
    <image href="data:image/png;base64,${logoBase64}" x="18" y="${Math.round((h - (h * 0.75 * 1.15)) / 2)}" width="${Math.round(h * 0.75)}" height="${Math.round(h * 0.75 * 1.15)}" />
    
    <!-- Crisp Vector Lettering -->
    <text x="${Math.round(h * 0.75) + 30}" y="${Math.round(h * 0.44)}" font-size="${Math.max(12, Math.round(h * 0.25))}" class="brand-title" letter-spacing="0.8">MEDDY GLOBAL SOLUTIONS LTD</text>
    <text x="${Math.round(h * 0.75) + 30}" y="${Math.round(h * 0.72)}" font-size="${Math.max(9, Math.round(h * 0.17))}" class="brand-sub" letter-spacing="1.2">ENGINEERING &amp; ROTATING EQUIPMENT SERVICES</text>
  </svg>
  `;
  return Buffer.from(svg);
}

// 5. Cylindrical Storage Tank Mural
async function createTankMural(w, h) {
  const logoBuf = await sharp(LOGO_DARK_PATH).resize(Math.round(h * 0.55)).toBuffer();
  const logoBase64 = logoBuf.toString('base64');

  const svg = `
  <svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <style>
        ${getFontDef()}
        .tank-text { font-family: 'Manrope', sans-serif; font-weight: 800; fill: #FFFFFF; }
        .tank-sub { font-family: 'Manrope', sans-serif; font-weight: 600; fill: #0CA3DC; }
      </style>
      <filter id="mural-glow" x="-5%" y="-5%" width="110%" height="110%">
        <feDropShadow dx="0" dy="1" stdDeviation="2" flood-color="#06121F" flood-opacity="0.7"/>
      </filter>
    </defs>
    
    <g filter="url(#mural-glow)">
      <!-- Logo Emblem on Tank -->
      <image href="data:image/png;base64,${logoBase64}" x="15" y="${Math.round((h - (h * 0.55 * 1.15)) / 2)}" width="${Math.round(h * 0.55)}" height="${Math.round(h * 0.55 * 1.15)}" />
      
      <!-- Stenciled Typography matching tank curvature -->
      <text x="${Math.round(h * 0.55) + 28}" y="${Math.round(h * 0.46)}" font-size="${Math.max(14, Math.round(h * 0.27))}" class="tank-text" letter-spacing="1">MEDDY GLOBAL</text>
      <text x="${Math.round(h * 0.55) + 28}" y="${Math.round(h * 0.76)}" font-size="${Math.max(10, Math.round(h * 0.19))}" class="tank-sub" letter-spacing="1.5">SOLUTIONS LTD</text>
    </g>
  </svg>
  `;
  return Buffer.from(svg);
}

// 6. Marine Superstructure Lettering
async function createMarineSuperstructure(w, h) {
  const logoBuf = await sharp(LOGO_LIGHT_PATH).resize(Math.round(h * 0.75)).toBuffer();
  const logoBase64 = logoBuf.toString('base64');

  const svg = `
  <svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <style>
        ${getFontDef()}
        .marine-name { font-family: 'Manrope', sans-serif; font-weight: 800; fill: #292D32; }
      </style>
    </defs>
    <!-- White roundel for logo -->
    <circle cx="${Math.round(h * 0.45)}" cy="${Math.round(h * 0.5)}" r="${Math.round(h * 0.4)}" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1.5"/>
    <image href="data:image/png;base64,${logoBase64}" x="${Math.round(h * 0.15)}" y="${Math.round(h * 0.15)}" width="${Math.round(h * 0.6)}" height="${Math.round(h * 0.69)}" />
    
    <!-- Superstructure Name -->
    <text x="${Math.round(h * 0.95) + 15}" y="${Math.round(h * 0.6)}" font-size="${Math.max(13, Math.round(h * 0.29))}" class="marine-name" letter-spacing="1">MEDDY GLOBAL SOLUTIONS LTD</text>
  </svg>
  `;
  return Buffer.from(svg);
}

// 7. Architectural Entrance Sign for Contact
async function createArchitecturalSign(w, h) {
  const logoBuf = await sharp(LOGO_DARK_PATH).resize(Math.round(h * 0.6)).toBuffer();
  const logoBase64 = logoBuf.toString('base64');

  const svg = `
  <svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <style>
        ${getFontDef()}
        .portal-title { font-family: 'Manrope', sans-serif; font-weight: 800; fill: #FFFFFF; }
        .portal-sub { font-family: 'Manrope', sans-serif; font-weight: 600; fill: #0CA3DC; }
      </style>
      <filter id="portal-shadow" x="-2%" y="-5%" width="104%" height="115%">
        <feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="#000" flood-opacity="0.6"/>
      </filter>
    </defs>
    <!-- Dark corporate canopy fascia panel -->
    <rect x="2" y="2" width="${w - 4}" height="${h - 4}" rx="8" fill="#0B1B2B" stroke="#0EA5E0" stroke-width="2" filter="url(#portal-shadow)"/>
    
    <image href="data:image/png;base64,${logoBase64}" x="24" y="${Math.round((h - (h * 0.6 * 1.15)) / 2)}" width="${Math.round(h * 0.6)}" height="${Math.round(h * 0.6 * 1.15)}" />
    
    <text x="${Math.round(h * 0.6) + 40}" y="${Math.round(h * 0.45)}" font-size="${Math.max(16, Math.round(h * 0.28))}" class="portal-title" letter-spacing="1">MEDDY GLOBAL SOLUTIONS LTD</text>
    <text x="${Math.round(h * 0.6) + 40}" y="${Math.round(h * 0.74)}" font-size="${Math.max(11, Math.round(h * 0.17))}" class="portal-sub" letter-spacing="1.5">ENGINEERING HEADQUARTERS &amp; OPERATIONS</text>
  </svg>
  `;
  return Buffer.from(svg);
}

// Master processor
async function processAll() {
  console.log('=== RUNNING MASTER BRANDING COMPOSITING ENGINE ===');
  const configs = fs.readdirSync(PLACEMENTS_DIR).filter(f => f.endsWith('.json'));

  for (const confFile of configs) {
    const confPath = path.join(PLACEMENTS_DIR, confFile);
    const conf = JSON.parse(fs.readFileSync(confPath, 'utf8'));
    const imgName = conf.image;
    const baseImgPath = path.join(OUTPUT_DIR, imgName);

    if (!fs.existsSync(baseImgPath)) {
      console.warn(`Base image not found: ${baseImgPath}, skipping.`);
      continue;
    }

    console.log(`\nProcessing: ${imgName} (${conf.dimensions.width}x${conf.dimensions.height})`);
    const inputBuffer = fs.readFileSync(baseImgPath);
    const meta = await sharp(inputBuffer).metadata();

    const compositeList = [];

    for (const el of conf.elements) {
      const { width, height } = el.position;
      let overlayBuf = null;

      if (el.type === 'chest_patch') {
        overlayBuf = await createChestPatch(width, height);
      } else if (el.type === 'rear_patch') {
        overlayBuf = await createRearPatch(width, height);
      } else if (el.type === 'helmet_logo' || el.type === 'vinyl_decal' || el.type === 'desk_helmet') {
        overlayBuf = await createHelmetLogo(width, height);
      } else if (el.type === 'equipment_nameplate' || el.type === 'drawing_title_block' || el.type === 'overhead_sign' || el.type === 'perimeter_sign') {
        const isDark = el.variant === 'logo-footer.png';
        overlayBuf = await createIndustrialPlacard(width, height, el.text, isDark);
      } else if (el.type === 'tank_mural' || el.type === 'pipe_marker') {
        overlayBuf = await createTankMural(width, height);
      } else if (el.type === 'hull_marking') {
        overlayBuf = await createMarineSuperstructure(width, height);
      } else if (el.type === 'architectural_sign') {
        overlayBuf = await createArchitecturalSign(width, height);
      } else if (el.type === 'polo_embroidery') {
        const logoSrc = el.variant === 'logo-footer.png' ? LOGO_DARK_PATH : LOGO_LIGHT_PATH;
        overlayBuf = await sharp(logoSrc).resize(width, height, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).toBuffer();
      }

      if (overlayBuf) {
        compositeList.push({
          input: overlayBuf,
          left: Math.max(0, Math.min(meta.width - width, Math.round(el.position.x))),
          top: Math.max(0, Math.min(meta.height - height, Math.round(el.position.y))),
          blend: el.blend_mode || 'over'
        });
        console.log(`  + Composited [${el.type}] at (${el.position.x}, ${el.position.y}) size ${width}x${height}`);
      }
    }

    if (compositeList.length > 0) {
      const finalBuffer = await sharp(inputBuffer)
        .composite(compositeList)
        .webp({ quality: 84, effort: 6 })
        .toBuffer();

      // Write final file
      fs.writeFileSync(baseImgPath, finalBuffer);
      const newStat = fs.statSync(baseImgPath);
      console.log(`  -> Saved ${imgName} (${(newStat.size / 1024).toFixed(1)} KB)`);

      // Duplicate load-bank to loadBank if needed
      if (imgName === 'load-bank.webp') {
        const dupPath = path.join(OUTPUT_DIR, 'loadBank.webp');
        fs.copyFileSync(baseImgPath, dupPath);
        console.log(`  -> Synced duplicate to loadBank.webp`);
      }

      // Generate QA Comparison Sheet
      const origPath = path.resolve('assets-original/images', imgName);
      if (fs.existsSync(origPath)) {
        const origBuf = fs.readFileSync(origPath);
        const origMeta = await sharp(origBuf).metadata();
        const sideW = Math.min(meta.width, 600);
        const sideH = Math.round(meta.height * (sideW / meta.width));

        const sideOrig = await sharp(origBuf).resize(sideW, sideH).toBuffer();
        const sideFinal = await sharp(finalBuffer).resize(sideW, sideH).toBuffer();

        const compSheet = await sharp({
          create: {
            width: sideW * 2 + 30,
            height: sideH + 50,
            channels: 4,
            background: { r: 6, g: 18, b: 31, alpha: 1 }
          }
        })
        .composite([
          { input: sideOrig, left: 10, top: 40 },
          { input: sideFinal, left: sideW + 20, top: 40 }
        ])
        .webp({ quality: 82 })
        .toBuffer();

        const compFile = path.join(QA_DIR, `${imgName.replace('.webp', '')}-comparison.webp`);
        fs.writeFileSync(compFile, compSheet);
        console.log(`  -> Generated QA comparison: ${path.basename(compFile)}`);
      }

      // Generate 200% zoom crop of primary element
      if (conf.elements.length > 0) {
        const firstEl = conf.elements[0];
        const cropW = Math.min(meta.width, Math.max(100, Math.round(firstEl.position.width * 1.8)));
        const cropH = Math.min(meta.height, Math.max(100, Math.round(firstEl.position.height * 1.8)));
        const cropLeft = Math.max(0, Math.min(meta.width - cropW, Math.round(firstEl.position.x - (cropW - firstEl.position.width) / 2)));
        const cropTop = Math.max(0, Math.min(meta.height - cropH, Math.round(firstEl.position.y - (cropH - firstEl.position.height) / 2)));

        const cropBuf = await sharp(finalBuffer)
          .extract({ left: cropLeft, top: cropTop, width: cropW, height: cropH })
          .resize(cropW * 2, cropH * 2, { kernel: 'lanczos3' })
          .webp({ quality: 88 })
          .toBuffer();

        const cropFile = path.join(QA_DIR, `${imgName.replace('.webp', '')}-crop-200.webp`);
        fs.writeFileSync(cropFile, cropBuf);
        console.log(`  -> Generated 200% zoom crop: ${path.basename(cropFile)}`);
      }
    }
  }
  console.log('\n=== COMPOSITING ENGINE RUN COMPLETE ===');
}

processAll();
