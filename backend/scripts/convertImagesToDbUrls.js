const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Product = require('../models/Product');

const MONGO_URI = "mongodb+srv://Stoneo:Stoneo@stoneo.hydiprf.mongodb.net/?appName=stoneo";

function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase().replace('.', '');
  if (ext === 'jpg' || ext === 'jpeg') return 'image/jpeg';
  if (ext === 'png') return 'image/png';
  if (ext === 'webp') return 'image/webp';
  if (ext === 'gif') return 'image/gif';
  if (ext === 'svg') return 'image/svg+xml';
  return 'image/jpeg';
}

async function fetchExternalImageAsBase64(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const contentType = res.headers.get('content-type') || 'image/jpeg';
    return `data:${contentType};base64,${buffer.toString('base64')}`;
  } catch (e) {
    console.error(`Error fetching ${url}:`, e.message);
    return null;
  }
}

async function convertAll() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB for image conversion...");

    const products = await Product.find({});
    console.log(`Found ${products.length} products to check...`);

    const publicDir = path.join(__dirname, '../../frontend/public');
    let updatedCount = 0;

    for (let i = 0; i < products.length; i++) {
      const p = products[i];
      let modified = false;
      const newImages = [];

      for (const img of (p.images || [])) {
        if (!img) continue;

        // Already Base64 data URL
        if (img.startsWith('data:image/')) {
          newImages.push(img);
          continue;
        }

        // Local filesystem path (e.g. /granite_images/...)
        if (img.startsWith('/')) {
          const localPath = path.join(publicDir, img);
          if (fs.existsSync(localPath)) {
            try {
              const buffer = fs.readFileSync(localPath);
              const mimeType = getMimeType(localPath);
              const base64Str = `data:${mimeType};base64,${buffer.toString('base64')}`;
              newImages.push(base64Str);
              modified = true;
            } catch (err) {
              console.error(`Failed to read local file ${localPath}:`, err.message);
              newImages.push(img);
            }
          } else {
            newImages.push(img);
          }
        }
        // External URL (http:// or https://)
        else if (img.startsWith('http://') || img.startsWith('https://')) {
          const base64Str = await fetchExternalImageAsBase64(img);
          if (base64Str) {
            newImages.push(base64Str);
            modified = true;
          } else {
            newImages.push(img);
          }
        } else {
          newImages.push(img);
        }
      }

      if (modified) {
        p.images = newImages;
        await p.save();
        updatedCount++;
        if (updatedCount % 10 === 0) {
          console.log(`Converted images for ${updatedCount} products...`);
        }
      }
    }

    console.log(`Conversion complete! Successfully converted images to database URLs for ${updatedCount} products.`);
    process.exit(0);
  } catch (error) {
    console.error("Image conversion failed:", error);
    process.exit(1);
  }
}

convertAll();
