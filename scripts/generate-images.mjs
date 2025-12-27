import OpenAI from "openai";
import fs from "fs";
import path from "path";
import https from "https";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env
dotenv.config({ path: path.join(__dirname, "../.env") });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const outputDir = path.join(__dirname, "../public/images/generated");

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Download image from URL
async function downloadImage(url, filename) {
  const filepath = path.join(outputDir, filename);

  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    https.get(url, (response) => {
      response.pipe(file);
      file.on("finish", () => {
        file.close();
        console.log(`✓ Downloaded: ${filename}`);
        resolve(filepath);
      });
    }).on("error", (err) => {
      fs.unlink(filepath, () => {}); // Delete the file on error
      reject(err);
    });
  });
}

// Generate image with DALL-E
async function generateImage(prompt, filename, size = "1792x1024") {
  console.log(`Generating: ${filename}...`);

  try {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: size,
      quality: "standard",
      style: "natural",
    });

    const imageUrl = response.data[0].url;
    await downloadImage(imageUrl, filename);

    // Add a delay to avoid rate limits
    await new Promise(resolve => setTimeout(resolve, 2000));

    return true;
  } catch (error) {
    console.error(`✗ Error generating ${filename}:`, error.message);
    return false;
  }
}

// Image prompts for the JHR Photography website
const images = [
  // Hero/Banner Images
  {
    filename: "hero-homepage.jpg",
    prompt: "Professional corporate event photography scene at a modern convention center, wide shot showing a photographer capturing keynote speaker on stage with audience in foreground, dramatic lighting, gold and black color scheme, cinematic quality, Nashville style venue, dark moody atmosphere with spotlights",
    size: "1792x1024",
  },
  {
    filename: "hero-services.jpg",
    prompt: "Professional photographer with camera at a trade show booth, capturing headshots of business professionals, modern equipment setup with professional lighting, gold accent lighting, dark sophisticated atmosphere, corporate event setting",
    size: "1792x1024",
  },
  {
    filename: "hero-venues.jpg",
    prompt: "Stunning aerial view of Nashville downtown at twilight, Music City Center and downtown skyline visible, warm golden hour lighting, professional architectural photography style, dramatic clouds, corporate event venue atmosphere",
    size: "1792x1024",
  },
  {
    filename: "hero-about.jpg",
    prompt: "Professional male photographer in his 40s with military bearing, confident pose, holding professional camera, wearing dark professional attire, dramatic lighting with gold accents, dark studio background, Nashville event photographer portrait",
    size: "1024x1024",
  },

  // Service Images
  {
    filename: "service-headshot-activation.jpg",
    prompt: "Professional headshot photography setup at a trade show, ring light and backdrop visible, business professional getting their headshot taken, instant photo delivery on tablet screen, modern corporate environment, gold and black color scheme",
    size: "1792x1024",
  },
  {
    filename: "service-event-coverage.jpg",
    prompt: "Dynamic corporate conference scene, professional photographer capturing keynote presentation, large audience visible, stage with dramatic lighting, screens showing presentation, sophisticated corporate event atmosphere",
    size: "1792x1024",
  },
  {
    filename: "service-corporate-headshots.jpg",
    prompt: "Professional corporate headshot session in an office, executive portrait being photographed, clean modern backdrop, professional lighting setup, multiple team members waiting, sophisticated business environment",
    size: "1792x1024",
  },
  {
    filename: "service-event-video.jpg",
    prompt: "Professional video production at corporate event, camera operator with cinema camera on gimbal, capturing speaker on stage, monitors showing live feed, dramatic stage lighting, high-end production quality",
    size: "1792x1024",
  },

  // Venue Images
  {
    filename: "venue-music-city-center.jpg",
    prompt: "Interior of Music City Center Nashville convention center, grand exhibit hall with trade show booths, modern architecture with soaring ceilings, professional event lighting, crowds of business professionals, wide angle architectural shot",
    size: "1792x1024",
  },
  {
    filename: "venue-gaylord-opryland.jpg",
    prompt: "Interior of Gaylord Opryland Delta Atrium, lush indoor gardens with water features, elegant event setup, dramatic natural light through glass ceiling, Nashville luxury hotel atmosphere, corporate event venue",
    size: "1792x1024",
  },
  {
    filename: "venue-hotel-ballroom.jpg",
    prompt: "Elegant hotel ballroom set up for corporate gala, round tables with gold centerpieces, stage with dramatic lighting, crystal chandeliers, sophisticated dark and gold color scheme, professional event photography atmosphere",
    size: "1792x1024",
  },
  {
    filename: "venue-conference-room.jpg",
    prompt: "Modern hotel conference room during business meeting, executives around table, presentation screen visible, professional photography documenting the moment, clean corporate environment, natural window light",
    size: "1792x1024",
  },

  // Event Type Images
  {
    filename: "event-trade-show.jpg",
    prompt: "Busy trade show floor with corporate exhibition booths, business professionals networking, headshot station visible in foreground, modern convention center setting, dynamic corporate event atmosphere",
    size: "1792x1024",
  },
  {
    filename: "event-awards-ceremony.jpg",
    prompt: "Corporate awards ceremony on stage, executive receiving award, dramatic spotlight, audience applauding, elegant stage design with gold accents, professional event photography moment",
    size: "1792x1024",
  },
  {
    filename: "event-networking.jpg",
    prompt: "Professional networking event at corporate conference, diverse group of business professionals in conversation, cocktail reception atmosphere, elegant venue with ambient lighting, candid professional photography",
    size: "1792x1024",
  },
  {
    filename: "event-keynote.jpg",
    prompt: "Dynamic keynote speaker on stage at corporate conference, large LED screens, engaged audience visible from behind, professional stage lighting, dramatic wide shot, corporate event photography",
    size: "1792x1024",
  },

  // Gallery/Portfolio Style Images
  {
    filename: "gallery-headshot-1.jpg",
    prompt: "Professional corporate headshot of a confident businesswoman, studio lighting, clean gray background, approachable smile, professional attire, high-end executive portrait photography",
    size: "1024x1024",
  },
  {
    filename: "gallery-headshot-2.jpg",
    prompt: "Professional corporate headshot of a distinguished businessman in his 50s, studio lighting, clean background, confident expression, professional suit, executive portrait photography",
    size: "1024x1024",
  },
  {
    filename: "gallery-headshot-3.jpg",
    prompt: "Professional corporate headshot of a young professional, modern style, studio lighting, clean background, friendly approachable expression, business casual attire, contemporary executive portrait",
    size: "1024x1024",
  },
];

async function main() {
  console.log("🎨 JHR Photography - Image Generation Script");
  console.log("==========================================\n");

  let successCount = 0;
  let failCount = 0;

  for (const image of images) {
    const success = await generateImage(image.prompt, image.filename, image.size);
    if (success) {
      successCount++;
    } else {
      failCount++;
    }
  }

  console.log("\n==========================================");
  console.log(`✓ Successfully generated: ${successCount} images`);
  console.log(`✗ Failed: ${failCount} images`);
  console.log(`📁 Output directory: ${outputDir}`);
}

main().catch(console.error);
