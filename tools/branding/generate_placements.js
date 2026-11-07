const fs = require('fs');
const path = require('path');

const placements = {
  "about.webp": {
    image: "about.webp",
    dimensions: { width: 960, height: 1200 },
    primary_safe_zone: { y_min: 0.22, y_max: 0.58, x_min: 0.08, x_max: 0.92 },
    elements: [
      {
        id: "helmet_worker_left",
        type: "helmet_logo",
        variant: "logo.png",
        surface: "White glossy ABS helmet",
        position: { x: 380, y: 345, width: 62, height: 71 },
        curvature: "spherical",
        blend_mode: "multiply",
        opacity: 0.95,
        notes: "Centred on front curve of white hard hat above brim."
      },
      {
        id: "patch_chest_left_worker",
        type: "chest_patch",
        variant: "logo.png",
        surface: "Navy cotton-drill coverall, left chest",
        position: { x: 420, y: 495, width: 88, height: 44 },
        text: "MEDDY GLOBAL SOLUTIONS LTD",
        text_color: "#292D32",
        blend_mode: "over",
        opacity: 0.96,
        notes: "Embroidered white patch with stitched border and full corporate name."
      },
      {
        id: "patch_rear_worker_right",
        type: "rear_patch",
        variant: "logo.png",
        surface: "Navy cotton-drill coverall, upper back below collar",
        position: { x: 670, y: 530, width: 140, height: 78 },
        text: "MEDDY GLOBAL SOLUTIONS LTD",
        text_color: "#292D32",
        blend_mode: "over",
        opacity: 0.95,
        notes: "Large back corporate patch centred below collar with full company name."
      }
    ]
  },

  "consultancy.webp": {
    image: "consultancy.webp",
    dimensions: { width: 900, height: 1200 },
    primary_safe_zone: { y_min: 0.22, y_max: 0.58, x_min: 0.08, x_max: 0.92 },
    elements: [
      {
        id: "polo_chest_embroidery",
        type: "polo_embroidery",
        variant: "logo-footer.png",
        surface: "Charcoal polo shirt fabric",
        position: { x: 260, y: 280, width: 68, height: 78 },
        blend_mode: "over",
        opacity: 0.94,
        notes: "Embroidered directly on left chest of charcoal polo with subtle thread texture."
      },
      {
        id: "blueprint_title_block",
        type: "drawing_title_block",
        variant: "logo.png",
        surface: "CAD engineering technical plan / schematic paper",
        position: { x: 520, y: 880, width: 330, height: 120 },
        text: "MEDDY GLOBAL SOLUTIONS LTD",
        text_color: "#1E293B",
        blend_mode: "multiply",
        opacity: 0.96,
        notes: "Technical drawing border title block in lower right quadrant with scale and CAD grid."
      }
    ]
  },

  "contact.webp": {
    image: "contact.webp",
    dimensions: { width: 1920, height: 1080 },
    primary_safe_zone: { y_min: 0.25, y_max: 0.75, x_min: 0.45, x_max: 0.95 },
    elements: [
      {
        id: "facade_canopy_sign",
        type: "architectural_sign",
        variant: "logo-footer.png",
        surface: "Modern corporate glass and composite entrance facade canopy",
        position: { x: 1080, y: 460, width: 620, height: 160 },
        text: "MEDDY GLOBAL SOLUTIONS LTD",
        text_color: "#FFFFFF",
        blend_mode: "over",
        opacity: 0.96,
        notes: "Deep blue illuminated entrance portal signage with precision architectural lettering."
      }
    ]
  },

  "epic.webp": {
    image: "epic.webp",
    dimensions: { width: 900, height: 1200 },
    primary_safe_zone: { y_min: 0.22, y_max: 0.58, x_min: 0.08, x_max: 0.92 },
    elements: [
      {
        id: "polo_back_emblem",
        type: "polo_embroidery",
        variant: "logo-footer.png",
        surface: "Charcoal engineering polo fabric, shoulder/back",
        position: { x: 410, y: 580, width: 64, height: 74 },
        blend_mode: "over",
        opacity: 0.92,
        notes: "Embroidered emblem on visible shoulder of engineer."
      },
      {
        id: "cad_monitor_title_block",
        type: "drawing_title_block",
        variant: "logo.png",
        surface: "Engineering workstation monitor displaying plant PID drawing",
        position: { x: 510, y: 390, width: 260, height: 95 },
        text: "MEDDY GLOBAL SOLUTIONS LTD",
        text_color: "#0F172A",
        blend_mode: "over",
        opacity: 0.96,
        notes: "PID process flow diagram title block replacing source code editor."
      },
      {
        id: "desk_hard_hat",
        type: "desk_helmet",
        variant: "logo.png",
        surface: "White hard hat resting on desk next to keyboard",
        position: { x: 180, y: 790, width: 44, height: 50 },
        blend_mode: "multiply",
        opacity: 0.95,
        notes: "Branded hard hat with blue crown stripe on engineering workstation bench."
      }
    ]
  },

  "esp.webp": {
    image: "esp.webp",
    dimensions: { width: 900, height: 1200 },
    primary_safe_zone: { y_min: 0.22, y_max: 0.58, x_min: 0.08, x_max: 0.92 },
    elements: [
      {
        id: "technician_chest_logo",
        type: "polo_embroidery",
        variant: "logo-footer.png",
        surface: "Charcoal polo shirt fabric, left chest",
        position: { x: 430, y: 440, width: 62, height: 71 },
        blend_mode: "over",
        opacity: 0.94,
        notes: "Embroidered emblem on chest of Nigerian female electrical technician."
      },
      {
        id: "bench_helmet",
        type: "desk_helmet",
        variant: "logo.png",
        surface: "White hard hat on workbench",
        position: { x: 110, y: 720, width: 50, height: 58 },
        blend_mode: "multiply",
        opacity: 0.94,
        notes: "White helmet with blue stripe and official logo placed on the diagnostic table."
      },
      {
        id: "rig_equipment_label",
        type: "equipment_nameplate",
        variant: "logo.png",
        surface: "ESP test rig aluminum frame",
        position: { x: 560, y: 240, width: 280, height: 80 },
        text: "MEDDY GLOBAL SOLUTIONS LTD",
        text_color: "#0F172A",
        blend_mode: "over",
        opacity: 0.95,
        notes: "Anodized aluminum test bench apparatus placard."
      }
    ]
  },

  "fabrication.webp": {
    image: "fabrication.webp",
    dimensions: { width: 900, height: 1200 },
    primary_safe_zone: { y_min: 0.22, y_max: 0.58, x_min: 0.08, x_max: 0.92 },
    elements: [
      {
        id: "welding_helmet_decal",
        type: "vinyl_decal",
        variant: "logo.png",
        surface: "Curved composite welding mask shell",
        position: { x: 280, y: 230, width: 88, height: 98 },
        curvature: "spherical",
        blend_mode: "multiply",
        opacity: 0.93,
        notes: "High-temperature vinyl decal on welding helmet flank with specular highlights."
      },
      {
        id: "fabrication_structural_placard",
        type: "equipment_nameplate",
        variant: "logo-footer.png",
        surface: "Structural steel girder fabrication staging beam",
        position: { x: 420, y: 780, width: 380, height: 110 },
        text: "MEDDY GLOBAL SOLUTIONS LTD",
        text_color: "#FFFFFF",
        blend_mode: "over",
        opacity: 0.95,
        notes: "Industrial workshop structural assembly QA certification banner."
      }
    ]
  },

  "filtration.webp": {
    image: "filtration.webp",
    dimensions: { width: 900, height: 1200 },
    primary_safe_zone: { y_min: 0.22, y_max: 0.58, x_min: 0.08, x_max: 0.92 },
    elements: [
      {
        id: "vessel_skid_nameplate",
        type: "equipment_nameplate",
        variant: "logo.png",
        surface: "High-pressure stainless filtration vessel skid chassis",
        position: { x: 410, y: 640, width: 340, height: 105 },
        text: "MEDDY GLOBAL SOLUTIONS LTD",
        text_color: "#0F172A",
        blend_mode: "over",
        opacity: 0.96,
        notes: "Stainless steel separation and filtration unit asset badge."
      }
    ]
  },

  "hero.webp": {
    image: "hero.webp",
    dimensions: { width: 1376, height: 768 },
    primary_safe_zone: { y_min: 0.20, y_max: 0.80, x_min: 0.50, x_max: 0.95 },
    elements: [
      {
        id: "storage_tank_mural",
        type: "tank_mural",
        variant: "logo-footer.png",
        surface: "Cylindrical industrial bulk liquid hydrocarbon storage tank wall",
        position: { x: 880, y: 320, width: 380, height: 125 },
        curvature: "cylindrical",
        text: "MEDDY GLOBAL SOLUTIONS LTD",
        text_color: "#FFFFFF",
        blend_mode: "over",
        opacity: 0.94,
        notes: "Painted industrial signage on nearest tank wall curved to surface. Left 45% kept pristine."
      }
    ]
  },

  "hsse.webp": {
    image: "hsse.webp",
    dimensions: { width: 1200, height: 800 },
    primary_safe_zone: { y_min: 0.20, y_max: 0.80, x_min: 0.10, x_max: 0.90 },
    elements: [
      {
        id: "foreground_vessel_hull_branding",
        type: "hull_marking",
        variant: "logo-footer.png",
        surface: "Steel vessel hull superstructure at marine terminal",
        position: { x: 380, y: 440, width: 440, height: 120 },
        text: "MEDDY GLOBAL SOLUTIONS LTD",
        text_color: "#FFFFFF",
        blend_mode: "over",
        opacity: 0.95,
        notes: "Marine fleet markings replacing foreign vessel name with crisp corporate typography."
      },
      {
        id: "terminal_crane_nameplate",
        type: "equipment_nameplate",
        variant: "logo.png",
        surface: "Heavy gantry container crane side panel",
        position: { x: 740, y: 190, width: 220, height: 65 },
        text: "MEDDY GLOBAL",
        text_color: "#0F172A",
        blend_mode: "over",
        opacity: 0.94,
        notes: "Crane operator cab signage replacing third-party terminal logos."
      }
    ]
  },

  "load-bank.webp": {
    image: "load-bank.webp",
    dimensions: { width: 896, height: 1200 },
    primary_safe_zone: { y_min: 0.22, y_max: 0.58, x_min: 0.08, x_max: 0.92 },
    elements: [
      {
        id: "load_bank_cabinet_placard",
        type: "equipment_nameplate",
        variant: "logo.png",
        surface: "Heavy power load bank ventilation and control enclosure",
        position: { x: 260, y: 490, width: 380, height: 115 },
        text: "MEDDY GLOBAL SOLUTIONS LTD",
        text_color: "#0F172A",
        blend_mode: "over",
        opacity: 0.96,
        notes: "Resistive and reactive load verification unit asset tag."
      }
    ]
  },

  "maintenance.webp": {
    image: "maintenance.webp",
    dimensions: { width: 900, height: 1200 },
    primary_safe_zone: { y_min: 0.22, y_max: 0.58, x_min: 0.08, x_max: 0.92 },
    elements: [
      {
        id: "pump_serviced_by_tag",
        type: "equipment_nameplate",
        variant: "logo.png",
        surface: "Heavy industrial cast iron pump volute casing",
        position: { x: 380, y: 510, width: 330, height: 100 },
        text: "MEDDY GLOBAL SOLUTIONS LTD",
        text_color: "#0F172A",
        blend_mode: "over",
        opacity: 0.96,
        notes: "Stainless steel 'Serviced By' asset maintenance tag riveted to casing."
      },
      {
        id: "sleeve_reflective_patch",
        type: "chest_patch",
        variant: "logo.png",
        surface: "Navy cotton-drill sleeve with silver reflective tape",
        position: { x: 740, y: 80, width: 110, height: 55 },
        text: "MEDDY GLOBAL",
        text_color: "#292D32",
        blend_mode: "over",
        opacity: 0.95,
        notes: "Coverall sleeve brand badge above cuff."
      }
    ]
  },

  "marine.webp": {
    image: "marine.webp",
    dimensions: { width: 900, height: 1200 },
    primary_safe_zone: { y_min: 0.22, y_max: 0.58, x_min: 0.08, x_max: 0.92 },
    elements: [
      {
        id: "vessel_superstructure_name",
        type: "hull_marking",
        variant: "logo-footer.png",
        surface: "Cream and red offshore crew vessel superstructure",
        position: { x: 260, y: 390, width: 420, height: 120 },
        text: "MEDDY GLOBAL SOLUTIONS LTD",
        text_color: "#292D32",
        blend_mode: "over",
        opacity: 0.96,
        notes: "Marine vessel nameplate replacing 'FAST MAMMOTH' in charcoal capital lettering."
      }
    ]
  },

  "motors.webp": {
    image: "motors.webp",
    dimensions: { width: 896, height: 1200 },
    primary_safe_zone: { y_min: 0.22, y_max: 0.58, x_min: 0.08, x_max: 0.92 },
    elements: [
      {
        id: "motor_stator_nameplate",
        type: "equipment_nameplate",
        variant: "logo.png",
        surface: "Heavy AC electric induction motor stator frame",
        position: { x: 290, y: 490, width: 340, height: 105 },
        text: "MEDDY GLOBAL SOLUTIONS LTD",
        text_color: "#0F172A",
        blend_mode: "over",
        opacity: 0.96,
        notes: "Cast stainless asset plate on motor drive frame."
      }
    ]
  },

  "oem.webp": {
    image: "oem.webp",
    dimensions: { width: 900, height: 1200 },
    primary_safe_zone: { y_min: 0.22, y_max: 0.58, x_min: 0.08, x_max: 0.92 },
    elements: [
      {
        id: "oem_parts_placard",
        type: "equipment_nameplate",
        variant: "logo.png",
        surface: "Precision machinery assembly casing on workshop bench",
        position: { x: 280, y: 520, width: 350, height: 110 },
        text: "MEDDY GLOBAL SOLUTIONS LTD",
        text_color: "#0F172A",
        blend_mode: "over",
        opacity: 0.96,
        notes: "Precision OEM bearing and turbomachinery components inspection placard."
      }
    ]
  },

  "pipeline.webp": {
    image: "pipeline.webp",
    dimensions: { width: 896, height: 1200 },
    primary_safe_zone: { y_min: 0.22, y_max: 0.58, x_min: 0.08, x_max: 0.92 },
    elements: [
      {
        id: "pipeline_marker_band",
        type: "pipe_marker",
        variant: "logo-footer.png",
        surface: "High-pressure carbon steel transmission pipeline",
        position: { x: 260, y: 480, width: 380, height: 115 },
        curvature: "cylindrical",
        text: "MEDDY GLOBAL SOLUTIONS LTD",
        text_color: "#FFFFFF",
        blend_mode: "over",
        opacity: 0.95,
        notes: "High-visibility regulatory flowline marker collar wrapped around pipe."
      }
    ]
  },

  "procurement.webp": {
    image: "procurement.webp",
    dimensions: { width: 900, height: 1200 },
    primary_safe_zone: { y_min: 0.22, y_max: 0.58, x_min: 0.08, x_max: 0.92 },
    elements: [
      {
        id: "warehouse_aisle_sign",
        type: "overhead_sign",
        variant: "logo.png",
        surface: "Logistics warehouse racking and crate staging area",
        position: { x: 270, y: 440, width: 380, height: 120 },
        text: "MEDDY GLOBAL SOLUTIONS LTD",
        text_color: "#0F172A",
        blend_mode: "over",
        opacity: 0.96,
        notes: "Industrial inventory logistics signage mounted across storage bay."
      }
    ]
  },

  "pumps.webp": {
    image: "pumps.webp",
    dimensions: { width: 900, height: 1200 },
    primary_safe_zone: { y_min: 0.22, y_max: 0.58, x_min: 0.08, x_max: 0.92 },
    elements: [
      {
        id: "centrifugal_pump_nameplate",
        type: "equipment_nameplate",
        variant: "logo.png",
        surface: "Industrial horizontal centrifugal pump overhaul skid",
        position: { x: 280, y: 490, width: 350, height: 110 },
        text: "MEDDY GLOBAL SOLUTIONS LTD",
        text_color: "#0F172A",
        blend_mode: "over",
        opacity: 0.96,
        notes: "Stainless steel 'Serviced by' tag with zero third-party catalog scrap text."
      }
    ]
  },

  "staffing.webp": {
    image: "staffing.webp",
    dimensions: { width: 900, height: 1200 },
    primary_safe_zone: { y_min: 0.22, y_max: 0.58, x_min: 0.08, x_max: 0.92 },
    elements: [
      {
        id: "standing_worker_back_patch",
        type: "rear_patch",
        variant: "logo.png",
        surface: "Navy cotton-drill coverall, upper back of standing technician",
        position: { x: 440, y: 460, width: 145, height: 80 },
        text: "MEDDY GLOBAL SOLUTIONS LTD",
        text_color: "#292D32",
        blend_mode: "over",
        opacity: 0.96,
        notes: "Large back corporate patch centred below collar with full company name."
      },
      {
        id: "standing_worker_helmet",
        type: "helmet_logo",
        variant: "logo.png",
        surface: "White hard hat shell with blue stripe",
        position: { x: 495, y: 395, width: 38, height: 44 },
        blend_mode: "multiply",
        opacity: 0.94,
        notes: "White hard hat with crown stripe and official logo."
      }
    ]
  },

  "turbines.webp": {
    image: "turbines.webp",
    dimensions: { width: 900, height: 1200 },
    primary_safe_zone: { y_min: 0.22, y_max: 0.58, x_min: 0.08, x_max: 0.92 },
    elements: [
      {
        id: "generation_hall_perimeter_sign",
        type: "perimeter_sign",
        variant: "logo.png",
        surface: "Industrial power generation plant perimeter staging",
        position: { x: 260, y: 460, width: 400, height: 125 },
        text: "MEDDY GLOBAL SOLUTIONS LTD",
        text_color: "#0F172A",
        blend_mode: "over",
        opacity: 0.96,
        notes: "Heavy turbomachinery power hall boundary sign."
      }
    ]
  }
};

const outputDir = path.resolve('tools/branding/placements');
for (const [key, data] of Object.entries(placements)) {
  const filePath = path.join(outputDir, key.replace('.webp', '.json'));
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log(`Generated placement: ${path.basename(filePath)}`);
}
console.log(`Total placement configs: ${Object.keys(placements).length}`);

