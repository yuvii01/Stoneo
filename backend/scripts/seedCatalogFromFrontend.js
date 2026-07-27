const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Product = require('../models/Product');

const MONGO_URI = "mongodb+srv://Stoneo:Stoneo@stoneo.hydiprf.mongodb.net/?appName=stoneo";

function extractArrayFromText(content, varName) {
  const regex = new RegExp(`(?:const|export const)\\s+${varName}\\s*=\s*\\[([\\s\\S]*?)\\];`);
  const match = content.match(regex);
  if (!match) return [];
  try {
    return eval('[' + match[1] + ']');
  } catch (e) {
    console.error(`Error eval ${varName}:`, e.message);
    return [];
  }
}

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB for seeding...");

    let totalSeeded = 0;
    const frontendDir = path.join(__dirname, '../../frontend/src/pages/categories');
    const constantsPath = path.join(__dirname, '../../frontend/src/utils/constants.js');
    const pavingPath = path.join(__dirname, '../../frontend/src/utils/paving_landscape.json');

    const constantsContent = fs.readFileSync(constantsPath, 'utf8');

    // 1. Granite
    const granitePath = path.join(frontendDir, 'Granite.jsx');
    const graniteContent = fs.readFileSync(granitePath, 'utf8');
    const graniteItems = extractArrayFromText(graniteContent, 'CSV_PRODUCTS');
    for (let idx = 0; idx < graniteItems.length; idx++) {
      const item = graniteItems[idx];
      const name = item.name || `Granite ${idx}`;
      const existing = await Product.findOne({ name });
      if (!existing) {
        await Product.create({
          name,
          category: 'Granite',
          categories: ['Granite'],
          colorCategory: item.category || 'Black',
          color: item.category || 'Black',
          images: [item.image || ''],
          price: String(60 + ((idx * 13) % 180)),
          origin: 'India',
          description: 'Premium quality Granite stone.',
          features: ['Durable', 'Weather Resistant', 'Easy Maintenance'],
          finish: ['Polished'],
          sortOrder: idx
        });
        totalSeeded++;
      }
    }
    console.log("Seeded Granite");

    // 2. Marble
    const marblePath = path.join(frontendDir, 'Marble.jsx');
    const marbleContent = fs.readFileSync(marblePath, 'utf8');
    const marbleItems = extractArrayFromText(marbleContent, 'CSV_PRODUCTS');
    for (let idx = 0; idx < marbleItems.length; idx++) {
      const item = marbleItems[idx];
      const name = item.name || `Marble ${idx}`;
      const existing = await Product.findOne({ name });
      if (!existing) {
        await Product.create({
          name,
          category: 'Marble',
          categories: ['Marble'],
          colorCategory: item.category || 'White',
          color: item.category || 'White',
          images: [item.image || ''],
          price: String(80 + ((idx * 17) % 220)),
          origin: 'India / Italy',
          description: 'Premium quality Marble stone.',
          features: ['Elegant', 'Polished Finish', 'Classic Look'],
          finish: ['Polished'],
          sortOrder: idx + 200
        });
        totalSeeded++;
      }
    }
    console.log("Seeded Marble");

    // 3. Sandstone
    const sandstonePath = path.join(frontendDir, 'Sandstone.jsx');
    const sandstoneContent = fs.readFileSync(sandstonePath, 'utf8');
    const sandstoneItems = extractArrayFromText(sandstoneContent, 'CSV_PRODUCTS');
    for (let idx = 0; idx < sandstoneItems.length; idx++) {
      const item = sandstoneItems[idx];
      const name = item.name || `Sandstone ${idx}`;
      const existing = await Product.findOne({ name });
      if (!existing) {
        await Product.create({
          name,
          category: 'Sandstone',
          categories: ['Sandstone'],
          colorCategory: item.category || 'Beige',
          color: item.category || 'Beige',
          images: [item.image || ''],
          price: String(50 + ((idx * 11) % 150)),
          origin: 'Rajasthan, India',
          description: 'Premium quality Sandstone.',
          features: ['Natural Texture', 'Durable', 'Slip Resistant'],
          finish: ['Natural Cleft'],
          sortOrder: idx + 400
        });
        totalSeeded++;
      }
    }
    console.log("Seeded Sandstone");

    // 4. Quartz
    const quartzItems = extractArrayFromText(constantsContent, 'Quartz_products');
    for (let idx = 0; idx < quartzItems.length; idx++) {
      const item = quartzItems[idx];
      const name = item.name || `Quartz ${idx}`;
      const existing = await Product.findOne({ name });
      if (!existing) {
        await Product.create({
          name,
          category: 'Quartz',
          categories: ['Quartz'],
          colorCategory: item.color || 'White',
          color: item.color || 'White',
          images: [item.image || ''],
          price: String(60 + ((idx * 13) % 180)),
          origin: 'India / Global',
          description: 'Premium quality Quartz surface.',
          features: ['Scratch Resistant', 'Stain Resistant', 'Zero Maintenance'],
          finish: ['Polished'],
          sortOrder: idx + 600
        });
        totalSeeded++;
      }
    }
    console.log("Seeded Quartz");

    // 5. Onyx
    const onyxItems = extractArrayFromText(constantsContent, 'Onyx_products');
    for (let idx = 0; idx < onyxItems.length; idx++) {
      const item = onyxItems[idx];
      const name = item.name || `Onyx ${idx}`;
      const existing = await Product.findOne({ name });
      if (!existing) {
        await Product.create({
          name,
          category: 'Onyx',
          categories: ['Onyx'],
          colorCategory: item.color || 'Multicolor',
          color: item.color || 'Multicolor',
          images: [item.image || ''],
          price: String(150 + ((idx * 23) % 250)),
          origin: 'Exotic Quarries',
          description: 'Exquisite translucent Onyx stone.',
          features: ['Backlit Capable', 'Luxury Appearance', 'Unique Patterns'],
          finish: ['Polished'],
          sortOrder: idx + 800
        });
        totalSeeded++;
      }
    }
    console.log("Seeded Onyx");

    // 6. Other Natural Stones
    const otherItems = extractArrayFromText(constantsContent, 'OTHER_NATURAL_STONES');
    for (let idx = 0; idx < otherItems.length; idx++) {
      const item = otherItems[idx];
      const name = item.name || `Natural Stone ${idx}`;
      const existing = await Product.findOne({ name });
      if (!existing) {
        await Product.create({
          name,
          category: 'Other Natural Stones',
          categories: ['Other Natural Stones'],
          colorCategory: item.color || 'Grey',
          color: item.color || 'Grey',
          images: [item.image || ''],
          price: String(60 + ((idx * 11) % 120)),
          origin: 'India / Global Quarries',
          description: 'Authentic natural architectural stone.',
          features: ['Authentic natural texture', 'Weather resistant'],
          finish: ['Honed'],
          sortOrder: idx + 1000
        });
        totalSeeded++;
      }
    }
    console.log("Seeded Other Natural Stones");

    // 7. Paving and Landscape
    const pavingContent = fs.readFileSync(pavingPath, 'utf8');
    const pavingItems = JSON.parse(pavingContent);
    for (let idx = 0; idx < pavingItems.length; idx++) {
      const item = pavingItems[idx];
      const name = item.name || `Paving Stone ${idx}`;
      const existing = await Product.findOne({ name });
      if (!existing) {
        await Product.create({
          name,
          category: 'Paving and Landscape',
          categories: ['Paving and Landscape'],
          colorCategory: item.color || 'Grey',
          color: item.color || 'Grey',
          images: [item.image || ''],
          price: String(30 + ((idx * 13) % 150)),
          origin: 'India',
          description: 'High-quality paving and landscape stones for outdoor elegance.',
          features: ['Durable', 'Weather Resistant', 'Non-slip Surface'],
          finish: ['Natural'],
          sortOrder: idx + 1200
        });
        totalSeeded++;
      }
    }
    console.log("Seeded Paving and Landscape");

    console.log(`Seeding complete! Successfully added ${totalSeeded} new products to the database.`);
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
}

seed();
