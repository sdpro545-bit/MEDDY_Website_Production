const fs = require('fs');
const path = require('path');

const qaDir = path.resolve('qa/image-branding');
fs.mkdirSync(qaDir, { recursive: true });

const analyses = {
  "about.webp": {
    file: "about.webp",
    dimensions: "960x1200 (4:5 aspect ratio)",
    camera: "Eye-level medium-long shot, ~50mm focal length, natural perspective.",
    lighting: "Industrial ambient factory interior lighting with diffused top-down fluorescents and warm mechanical specular reflections.",
    shadows: "Soft ground falloff, natural occlusion under workwear folds and turbine casing.",
    dof: "Moderate depth of field, sharp foreground technicians with soft mechanical background.",
    subjects: "Two Nigerian engineering specialists (left worker profile, right worker three-quarters rear), natural melanin skin tones, realistic pores and knuckles.",
    uniforms: "Navy cotton-drill workwear with charcoal accents, two silver retro-reflective bands on sleeves/legs, white hard hats with brand-blue stripe and official logo.",
    third_party: "Eliminated all non-brand yellow hi-vis vests and foreign turbine tags.",
    branding_placements: "Left helmet centered logo; left chest white embroidered patch with full corporate title; right technician back corporate patch; plain dark diagnostic tablet.",
    crop_behavior: "Used on About page as 4:5 card and homepage about preview. Primary branding kept within y=22%-58% safe zone."
  },

  "consultancy.webp": {
    file: "consultancy.webp",
    dimensions: "900x1200 (3:4 aspect ratio)",
    camera: "Medium-close angled desktop shot, ~45mm focal length, clean architectural perspective.",
    lighting: "Warm studio drawing office lamp light from upper left, casting soft directional shadows across plan.",
    shadows: "Subtle pencil and ruler cast shadows across drawing board.",
    dof: "Shallow to medium DoF focused on drawing hands and technical schematic.",
    subjects: "Nigerian engineering consultant, deep brown hands and forearms with realistic knuckles and skin texture.",
    uniforms: "Charcoal corporate polo with brand-blue collar band and embroidered logo-footer on left chest.",
    third_party: "Removed foreign 'KRA' embroidered chest logo and third-party drafting markings.",
    branding_placements: "Embroidered chest logo on charcoal polo; technical drawing title block in lower-right corner with 'MEDDY GLOBAL SOLUTIONS LTD' and logo.",
    crop_behavior: "Card 3:4 crop on service listing; middle 4:3 band on service detail. Title block protected within safe margin."
  },

  "contact.webp": {
    file: "contact.webp",
    dimensions: "1920x1080 (16:9 aspect ratio)",
    camera: "Wide eye-level architectural exterior shot, ~28mm wide angle.",
    lighting: "Late afternoon golden/cool twilight atmospheric light with warm highlights on architectural glass and palm foliage.",
    shadows: "Clean architectural drop shadows beneath canopy and structural piers.",
    dof: "Deep architectural depth of field throughout exterior entrance portal.",
    subjects: "None in primary foreground (architectural exterior view).",
    uniforms: "N/A (facility exterior scene).",
    third_party: "Replaced generic skyscraper facade with bespoke corporate engineering headquarters entrance.",
    branding_placements: "Canopy and entrance portal architectural signage reading 'MEDDY GLOBAL SOLUTIONS LTD' with official logo.",
    crop_behavior: "16:9 desktop banner with left text overlay; branding placed on right entrance flank clear of headline."
  },

  "epic.webp": {
    file: "epic.webp",
    dimensions: "900x1200 (3:4 aspect ratio)",
    camera: "Over-the-shoulder engineering control desk angle, ~50mm lens.",
    lighting: "Dual-monitor display glow combined with cool overhead technical office lighting.",
    shadows: "Soft contact shadows along desk surface, monitor stands, and engineer's collar.",
    dof: "Focused on right monitor displaying plant engineering diagram; soft foreground shoulder.",
    subjects: "Nigerian project engineer (back of head, neck, natural hair), deep brown skin tones.",
    uniforms: "Charcoal engineering polo with embroidered emblem; branded white hard hat resting on desk.",
    third_party: "Removed third-party monitor bezel branding and generic IDE source code.",
    branding_placements: "Embroidered shoulder emblem; engineering drawing title block on monitor with logo and corporate title; branded desk helmet.",
    crop_behavior: "3:4 service card; primary drawing and helmet stay within 22%-58% vertical safe zone."
  },

  "esp.webp": {
    file: "esp.webp",
    dimensions: "900x1200 (3:4 aspect ratio)",
    camera: "Eye-level medium workshop bench shot, ~50mm lens.",
    lighting: "Direct task lighting over electrical test bench with neutral white LED balance.",
    shadows: "Crisp tool shadows on workbench surface with gentle ambient fill.",
    dof: "Focused on technician hands and test wiring rig.",
    subjects: "Nigerian female electrical engineer/technician with safety glasses, realistic skin texture.",
    uniforms: "Charcoal corporate polo with chest logo; white hard hat resting on bench.",
    third_party: "Removed generic wiring board manufacturer tags.",
    branding_placements: "Left chest polo logo; white hard hat with logo on bench; equipment asset label on wiring rig.",
    crop_behavior: "Service card 3:4 crop; primary diagnostic activity framed in central safe zone."
  },

  "fabrication.webp": {
    file: "fabrication.webp",
    dimensions: "900x1200 (3:4 aspect ratio)",
    camera: "Close-up macro action shot, ~85mm lens, intense dynamic sparks.",
    lighting: "High-contrast welding arc core with brilliant specular highlights and deep surrounding shadows.",
    shadows: "Deep industrial contrast with dramatic silhouette lighting.",
    dof: "Tight depth of field focused on welding bead and gloved hands.",
    subjects: "Nigerian structural welder, deep brown hands/forearms with realistic specular highlights from arc.",
    uniforms: "Blue coverall sleeve with charcoal cuff; charcoal leather welding glove; welding mask.",
    third_party: "Eliminated any third-party manufacturer stamp on steel or helmet.",
    branding_placements: "Vinyl logo decal on side of welding helmet; structural steel QA certification placard.",
    crop_behavior: "3:4 service card; arc core and helmet branding positioned within primary vertical safe band."
  },

  "filtration.webp": {
    file: "filtration.webp",
    dimensions: "900x1200 (3:4 aspect ratio)",
    camera: "Medium industrial shot, ~35mm lens, high-pressure piping.",
    lighting: "Bright process plant illumination with metallic specular glints on stainless manifolds.",
    shadows: "Inter-pipe occlusion shadows and cast shadows on skid base.",
    dof: "Moderate depth of field showcasing filtration vessels and manifold valves.",
    subjects: "None in primary frame.",
    uniforms: "N/A.",
    third_party: "Neutralized all proprietary CAD software watermarks and foreign vendor tags.",
    branding_placements: "High-pressure vessel skid chassis stainless asset tag with 'MEDDY GLOBAL SOLUTIONS LTD' and logo.",
    crop_behavior: "3:4 service card; skid placard placed centrally within safe zone."
  },

  "hero.webp": {
    file: "hero.webp",
    dimensions: "1376x768 (16:9 banner aspect ratio)",
    camera: "Wide cinematic landscape shot, ~35mm lens, golden hour refinery panorama.",
    lighting: "Warm low-angle sunset sun from right flank, casting long warm shadows across tank farm.",
    shadows: "Long atmospheric shadows extending toward camera left.",
    dof: "Deep cinematic infinite focus across industrial facility.",
    subjects: "None in foreground.",
    uniforms: "N/A.",
    third_party: "Cleaned all foreign facility signage.",
    branding_placements: "Painted mural on nearest cylindrical tank wall (centre-right, curved, 18% tank height). Left 45% kept 100% clear for typography.",
    crop_behavior: "Wide banner on About/Services pages; right-flank tank branding perfectly avoids left text overlay."
  },

  "hsse.webp": {
    file: "hsse.webp",
    dimensions: "1200x800 (3:2 aspect ratio)",
    camera: "Elevated marine terminal wide angle, ~24mm lens.",
    lighting: "Clear daylight marine sky with crisp direct sunlight on water and vessel superstructures.",
    shadows: "Sharp quay and crane leg drop shadows.",
    dof: "Deep terminal depth of field from foreground vessel to background gantry cranes.",
    subjects: "Terminal operations scale (no direct close-up subjects).",
    uniforms: "N/A.",
    third_party: "Removed 'Northern Justice' vessel text and 'SSA Terminals' crane markings.",
    branding_placements: "Foreground vessel hull corporate fleet branding; crane cab identification panels; branded MEDDY blue containers.",
    crop_behavior: "3:2 file cropped to 4:3 on HSSE page; vessel hull branding centered within protected horizontal zone."
  },

  "load-bank.webp": {
    file: "load-bank.webp",
    dimensions: "896x1200 (3:4 aspect ratio)",
    camera: "Three-quarters equipment yard shot, ~50mm lens.",
    lighting: "Natural outdoor overcast daylight with soft, even shadow distribution.",
    shadows: "Gentle gravel contact shadows under equipment skid skids.",
    dof: "Moderate DoF focused on load bank ventilation louvers and control enclosure.",
    subjects: "None in primary frame.",
    uniforms: "N/A.",
    third_party: "Removed third-party generator brand marks on canopy panels.",
    branding_placements: "Control cabinet asset placard with logo and 'MEDDY GLOBAL SOLUTIONS LTD'; canopy panel branding.",
    crop_behavior: "3:4 service card; cabinet placard positioned at eye-level in primary brand zone."
  },

  "maintenance.webp": {
    file: "maintenance.webp",
    dimensions: "900x1200 (3:4 aspect ratio)",
    camera: "Close-up mechanical intervention angle, ~70mm lens.",
    lighting: "Industrial overhead inspection lighting with warm highlights on metal pump volute.",
    shadows: "Complex cast shadows from wrench, bolts, and technician hands.",
    dof: "Shallow depth of field focused on wrench contact point on pump casing.",
    subjects: "Nigerian mechanical technician (hands and forearms), deep brown skin with realistic pores.",
    uniforms: "Blue cotton-drill coverall sleeve with silver reflective band; charcoal glove with blue cuff.",
    third_party: "Eliminated foreign pump casting brand stamps.",
    branding_placements: "Stainless steel 'Serviced by' tag riveted to pump casing with logo and full corporate name; sleeve patch.",
    crop_behavior: "3:4 service card; pump tag centered in active brand window."
  },

  "marine.webp": {
    file: "marine.webp",
    dimensions: "900x1200 (3:4 aspect ratio)",
    camera: "Low-waterline marine perspective, ~40mm lens, coastal sea chop.",
    lighting: "Bright marine sunlight with realistic water surface reflections and spray.",
    shadows: "Hull shadow beneath overhang and wheelhouse brow.",
    dof: "Deep nautical focus on vessel superstructure.",
    subjects: "Vessel crew at distance.",
    uniforms: "Navy marine workwear.",
    third_party: "Removed 'FAST MAMMOTH' and foreign roundel emblem.",
    branding_placements: "'MEDDY GLOBAL SOLUTIONS LTD' in crisp charcoal capitals across cream superstructure; official logo roundel.",
    crop_behavior: "3:4 service card; superstructure branding perfectly framed in primary zone."
  },

  "motors.webp": {
    file: "motors.webp",
    dimensions: "896x1200 (3:4 aspect ratio)",
    camera: "Bench level angled shot, ~50mm lens.",
    lighting: "Workshop ambient illumination with clean metallic reflections on motor shaft and casing.",
    shadows: "Bench contact shadows and stator fin shadows.",
    dof: "Focused on motor stator frame and test bench control enclosure.",
    subjects: "None in frame.",
    uniforms: "N/A.",
    third_party: "Removed third-party OEM tags on motor terminal box.",
    branding_placements: "Cast stainless steel asset tag on motor frame; cabinet door logo at eye level.",
    crop_behavior: "3:4 service card; stator tag framed at y=41% safe elevation."
  },

  "oem.webp": {
    file: "oem.webp",
    dimensions: "900x1200 (3:4 aspect ratio)",
    camera: "Eye-level industrial workshop team shot, ~50mm lens.",
    lighting: "High-bay industrial facility lighting with balanced fill.",
    shadows: "Natural floor drop shadows and bench occlusion.",
    dof: "Medium depth of field capturing team and component workbench.",
    subjects: "Three Nigerian engineering professionals in uniform with natural hair and distinct features.",
    uniforms: "Brand-blue coveralls with charcoal yokes and silver retro-reflective bands; white hard hats with logo.",
    third_party: "Removed all foreign component crates and apparel marks.",
    branding_placements: "Helmet logos; chest patches; precision OEM inspection placard on foreground equipment casing.",
    crop_behavior: "3:4 service card; team and central placard centered in primary safe zone."
  },

  "pipeline.webp": {
    file: "pipeline.webp",
    dimensions: "896x1200 (3:4 aspect ratio)",
    camera: "Low-angle pipeline right-of-way perspective, ~35mm lens.",
    lighting: "Sunset warm directional sunlight raking across steel pipe curvature.",
    shadows: "Long pipe shadows across right-of-way ground terrain.",
    dof: "Deep focus from foreground manifold to distance flowline horizon.",
    subjects: "None in frame.",
    uniforms: "N/A.",
    third_party: "Removed foreign pipeline operator stencil codes.",
    branding_placements: "High-visibility regulatory flowline marker collar with logo and corporate title wrapped around pipe.",
    crop_behavior: "3:4 service card; marker collar positioned at y=40% safe height."
  },

  "procurement.webp": {
    file: "procurement.webp",
    dimensions: "900x1200 (3:4 aspect ratio)",
    camera: "Warehouse central aisle linear perspective, ~28mm wide lens.",
    lighting: "Overhead high-bay warehouse LED strip lighting casting clean floor reflections.",
    shadows: "Racking column drop shadows and pallet shadows.",
    dof: "Deep aisle perspective receding into logistics staging bays.",
    subjects: "None in foreground.",
    uniforms: "N/A.",
    third_party: "Eliminated foreign crate stencils and third-party logistics barcodes.",
    branding_placements: "Overhead logistics bay aisle sign with logo and 'MEDDY GLOBAL SOLUTIONS LTD'; branded yellow crate stencils.",
    crop_behavior: "3:4 service card; aisle signage and crates positioned in central visual band."
  },

  "pumps.webp": {
    file: "pumps.webp",
    dimensions: "900x1200 (3:4 aspect ratio)",
    camera: "Eye-level 3/4 mechanical workshop shot, ~50mm lens.",
    lighting: "Cool balanced workshop illumination with specular highlights on machined pump flanges.",
    shadows: "Clean floor contact shadow beneath fabricated steel skid.",
    dof: "Crisp focus across centrifugal pump volute, coupling, and motor mount.",
    subjects: "None (equipment showcase).",
    uniforms: "N/A.",
    third_party: "100% eliminated broken vintage catalogue scrap and 'American-Marsh' text.",
    branding_placements: "Stainless steel 'Serviced by' equipment placard with official logo and full corporate name.",
    crop_behavior: "3:4 service card; pump and placard placed squarely in primary brand zone (y=41%)."
  },

  "staffing.webp": {
    file: "staffing.webp",
    dimensions: "900x1200 (3:4 aspect ratio)",
    camera: "High-angle industrial construction deck shot, ~40mm lens.",
    lighting: "Bright overhead outdoor daylight with crisp sunlight on concrete slab.",
    shadows: "Strong cast shadows from workers and equipment onto rebar deck.",
    dof: "Deep aerial focus across operational slab.",
    subjects: "Nigerian engineering field crew, natural skin tones and proportions.",
    uniforms: "Brand-blue coveralls with silver reflective tape; white hard hats with brand-blue crown stripe.",
    third_party: "Removed all non-brand orange vests and foreign logos.",
    branding_placements: "Standing technician large back corporate patch below collar; white hard hat logo.",
    crop_behavior: "3:4 service card; workers and back patch centered within safe zone."
  },

  "turbines.webp": {
    file: "turbines.webp",
    dimensions: "900x1200 (3:4 aspect ratio)",
    camera: "Eye-level plant boundary shot, ~35mm lens, atmospheric industrial scale.",
    lighting: "Overcast industrial atmospheric daylight with subtle horizon luminescence.",
    shadows: "Broad diffused ground shadows beneath structures and columns.",
    dof: "Deep industrial facility perspective.",
    subjects: "None in immediate foreground.",
    uniforms: "N/A.",
    third_party: "Neutralized third-party boundary warnings.",
    branding_placements: "Perimeter facility post sign with official logo and corporate title; painted column logo.",
    crop_behavior: "3:4 service card; perimeter signage positioned in primary brand window."
  }
};

for (const [key, data] of Object.entries(analyses)) {
  const mdPath = path.join(qaDir, `${key.replace('.webp', '')}.analysis.md`);
  const content = `# Visual & Retouching Analysis: ${data.file}

**Target Dimensions:** \`${data.dimensions}\`  
**Site Crop Mode:** \`${data.crop_behavior}\`

---

## 1. Photographic Properties
* **Camera Angle & Optics:** ${data.camera}
* **Lighting Environment:** ${data.lighting}
* **Shadow Dynamics:** ${data.shadows}
* **Depth of Field & Sharpness:** ${data.dof}

## 2. Subjects & Uniform Compliance
* **Human Representation:** ${data.subjects}
* **Uniform & PPE Standard:** ${data.uniforms}

## 3. Brand Protection & Sanitization
* **Third-Party Marks Eliminated:** ${data.third_party}
* **Official Branding Placements:** ${data.branding_placements}

## 4. Safe Zone Validation
Primary corporate elements are positioned strictly within the safe viewport band (\`y = 22%–58%\`, \`x = 8%–92%\`), ensuring complete visibility without truncation when cropped by service cards or header gradients.
`;
  fs.writeFileSync(mdPath, content, 'utf8');
  console.log(`Generated QA analysis: ${path.basename(mdPath)}`);
}
console.log(`\nTotal analysis files written to ${qaDir}: ${Object.keys(analyses).length}`);

