import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import sharp from "sharp";

function getSha256(filePath) {
  const fileBuffer = fs.readFileSync(filePath);
  return crypto.createHash("sha256").update(fileBuffer).digest("hex");
}

async function main() {
  const rootDir = process.cwd();
  const sourcePath = path.join(rootDir, "public", "brand", "logo.png");
  const outputDir = path.join(rootDir, "public", "email");
  const outputPath = path.join(outputDir, "meddy-logo.png");
  const assetsMdPath = path.join(outputDir, "ASSETS.md");

  if (!fs.existsSync(sourcePath)) {
    throw new Error(`Source file not found at ${sourcePath}`);
  }

  const sourceShaBefore = getSha256(sourcePath);
  console.log(`Source SHA-256 (before): ${sourceShaBefore}`);

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // 1. Trim transparent padding
  // 2. Resize with Lanczos3 to 112px wide (2x of 56px display width) maintaining natural aspect ratio
  // 3. Composite onto opaque white (#FFFFFF) background to prevent dark mode inverse artifacts
  // 4. Output optimized 8-bit palette PNG under 20KB
  const trimmed = sharp(sourcePath).trim();
  const trimmedMetadata = await trimmed.metadata();

  console.log(`Trimmed dimensions: ${trimmedMetadata.width}x${trimmedMetadata.height}`);

  const targetWidth = 112; // 2x display size (56px)
  const targetHeight = Math.round((targetWidth / trimmedMetadata.width) * trimmedMetadata.height);

  const resizedBuffer = await sharp(sourcePath)
    .trim()
    .resize(targetWidth, targetHeight, {
      kernel: sharp.kernel.lanczos3,
      fit: "contain",
    })
    .toBuffer();

  // Create an opaque white background canvas of exactly targetWidth x targetHeight
  await sharp({
    create: {
      width: targetWidth,
      height: targetHeight,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    },
  })
    .composite([
      {
        input: resizedBuffer,
        blend: "over",
      },
    ])
    .png({
      palette: true,
      colors: 256,
      compressionLevel: 9,
      quality: 100,
    })
    .toFile(outputPath);

  const sourceShaAfter = getSha256(sourcePath);
  if (sourceShaBefore !== sourceShaAfter) {
    throw new Error(
      `CRITICAL SECURITY VIOLATION: Source logo at ${sourcePath} was modified! Before: ${sourceShaBefore}, After: ${sourceShaAfter}`
    );
  }

  const outputSha = getSha256(outputPath);
  const outputStats = fs.statSync(outputPath);
  const outputMeta = await sharp(outputPath).metadata();

  console.log(`Email logo generated at: ${outputPath}`);
  console.log(`Dimensions: ${outputMeta.width}x${outputMeta.height}`);
  console.log(`File size: ${(outputStats.size / 1024).toFixed(2)} KB (${outputStats.size} bytes)`);
  console.log(`Output SHA-256: ${outputSha}`);

  if (outputStats.size > 20 * 1024) {
    throw new Error(`Email logo exceeds 20 KB limit! Current size: ${outputStats.size} bytes`);
  }

  const assetsMdContent = `# MEDDY Branded Email Assets Registry

This file records the canonical metadata and checksums for the production email logo asset.

## Asset Specification

- **Source File:** \`public/brand/logo.png\`
- **Source SHA-256:** \`${sourceShaBefore}\`
- **Output File:** \`public/email/meddy-logo.png\`
- **Output SHA-256:** \`${outputSha}\`
- **Display Dimensions:** 56px width × ${Math.round(targetHeight / 2)}px height
- **Asset Dimensions (2x Retina):** ${outputMeta.width}px width × ${outputMeta.height}px height
- **Background:** Opaque pure white (\`#FFFFFF\`)
- **Format:** 8-bit Palette PNG, optimized
- **File Size:** ${(outputStats.size / 1024).toFixed(2)} KB (${outputStats.size} bytes) (Strictly under 20 KB limit)
- **Regeneration Command:** \`node scripts/build-email-assets.mjs\`

## Integrity Guarantee
The source logo is treated as strictly read-only. Checksums are verified before and after generation.
`;

  fs.writeFileSync(assetsMdPath, assetsMdContent, "utf8");
  console.log(`Assets documentation written to: ${assetsMdPath}`);
}

main().catch((err) => {
  console.error("Asset build failed:", err);
  process.exit(1);
});

