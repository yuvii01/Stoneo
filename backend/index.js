// require('dotenv').config();
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']); // Force Google DNS to fix SRV resolution issue in Node.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const Blog = require('./models/Blog');
const Product = require('./models/Product');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Connect to MongoDB
mongoose.connect("mongodb+srv://Stoneo:Stoneo@stoneo.hydiprf.mongodb.net/?appName=stoneo")
    .then(() => {
        console.log("Connected to MongoDB successfully!");
    })
    .catch((error) => {
        console.error("MongoDB connection error:", error);
    });

app.get('/api/blogs', async (req, res) => {
    try {
        const blogs = await Blog.find().sort({ createdAt: -1 });
        res.json(blogs);
    } catch (error) {
        res.status(500).json({ message: "Error fetching blogs", error: error.message });
    }
});

// GET single blog by ID
app.get('/api/blogs/:id', async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).json({ message: "Blog not found" });
        res.json(blog);
    } catch (error) {
        res.status(500).json({ message: "Error fetching blog", error: error.message });
    }
});

// POST a new blog
app.post('/api/blogs', async (req, res) => {
    try {
        const { title, excerpt, content, image, author, date, tags, featuredProducts } = req.body;

        const newBlog = new Blog({
            title,
            excerpt,
            content,
            image,
            author,
            date,
            tags,
            featuredProducts
        });

        const savedBlog = await newBlog.save();
        res.status(201).json(savedBlog);
    } catch (error) {
        res.status(400).json({ message: "Error creating blog", error: error.message });
    }
});

// PUT update a blog by ID
app.put('/api/blogs/:id', async (req, res) => {
    try {
        const updatedBlog = await Blog.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedBlog) return res.status(404).json({ message: "Blog not found" });
        res.json(updatedBlog);
    } catch (error) {
        res.status(400).json({ message: "Error updating blog", error: error.message });
    }
});

// DELETE a blog by ID
app.delete('/api/blogs/:id', async (req, res) => {
    try {
        const deletedBlog = await Blog.findByIdAndDelete(req.params.id);
        if (!deletedBlog) return res.status(404).json({ message: "Blog not found" });
        res.json({ message: "Blog deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting blog", error: error.message });
    }
});

// ===== PRODUCT CRUD ROUTES =====

// Helper to sort products consistently by sortOrder in Node.js memory
// without exceeding MongoDB Atlas free tier 32MB in-database sort memory limit.
const sortProductsByOrder = (arr) => {
    if (!Array.isArray(arr)) return arr;
    return arr.sort((a, b) => {
        const orderA = (a && typeof a.sortOrder === 'number' && !isNaN(a.sortOrder)) ? a.sortOrder : 0;
        const orderB = (b && typeof b.sortOrder === 'number' && !isNaN(b.sortOrder)) ? b.sortOrder : 0;
        if (orderA !== orderB) {
            return orderA - orderB;
        }
        // Stable sort fallback if sortOrder is identical
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        if (timeA !== timeB) {
            return timeB - timeA;
        }
        const idA = String(a._id || a.id || '');
        const idB = String(b._id || b.id || '');
        return idA.localeCompare(idB);
    });
};

// GET all products (admin & frontend listing - lightweight without base64 images)
app.get('/api/products/list', async (req, res) => {
    try {
        const filter = {};
        if (req.query.category && req.query.category !== 'All' && req.query.category !== 'all') {
            filter.category = req.query.category;
        }
        if (req.query.isRoyalGemStone !== undefined) {
            filter.isRoyalGemStone = req.query.isRoyalGemStone === 'true';
        }
        if (req.query.finish) filter.finish = req.query.finish;
        if (req.query.color) filter.color = { $regex: req.query.color, $options: 'i' };
        if (req.query.thickness) filter.thickness = req.query.thickness;
        if (req.query.slipResistance) filter.slipResistance = req.query.slipResistance;
        if (req.query.priceRange) filter.priceRange = req.query.priceRange;
        if (req.query.colorCategory) filter.colorCategory = req.query.colorCategory;
        if (req.query.interior) filter.interior = req.query.interior;
        if (req.query.exterior) filter.exterior = req.query.exterior;

        // Exclude large base64 images array to keep payload ~170KB and query < 400ms, while keeping all metadata fields
        const products = await Product.find(filter, { images: 0 }).lean();

        sortProductsByOrder(products);

        // Attach a lazy-load thumbnail URL endpoint so browser loads only visible card images on-demand
        const productsWithThumbnail = products.map(p => ({
            ...p,
            id: p._id || p.id,
            thumbnail: `/api/products/${p._id || p.id}/thumbnail`
        }));

        res.json(productsWithThumbnail);
    } catch (error) {
        res.status(500).json({ message: "Error fetching products", error: error.message });
    }
});

// GET single product thumbnail image (lazy loading for admin cards)
app.get('/api/products/:id/thumbnail', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id, { images: { $slice: 1 } }).lean();
        if (!product || !product.images || product.images.length === 0) {
            return res.status(404).send('No image');
        }
        const img = product.images[0];
        if (!img) return res.status(404).send('No image');

        // If it's a base64 string, decode and send as binary image with Cache-Control
        const matches = img.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        if (matches && matches.length === 3) {
            const contentType = matches[1];
            const buffer = Buffer.from(matches[2], 'base64');
            res.setHeader('Content-Type', contentType);
            res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 24 hours
            return res.send(buffer);
        }

        // If it's a regular URL or path, redirect to it
        res.redirect(img);
    } catch (error) {
        res.status(500).send('Error loading thumbnail');
    }
});

// GET all products (full data including images - used by frontend category pages)
app.get('/api/products', async (req, res) => {
    try {
        const filter = {};
        if (req.query.category && req.query.category !== 'All' && req.query.category !== 'all') filter.category = req.query.category;
        if (req.query.isRoyalGemStone !== undefined) {
            filter.isRoyalGemStone = req.query.isRoyalGemStone === 'true';
        }
        if (req.query.finish) filter.finish = req.query.finish;
        if (req.query.color) filter.color = { $regex: req.query.color, $options: 'i' };
        if (req.query.thickness) filter.thickness = req.query.thickness;
        if (req.query.slipResistance) filter.slipResistance = req.query.slipResistance;
        if (req.query.priceRange) filter.priceRange = req.query.priceRange;
        if (req.query.colorCategory) filter.colorCategory = req.query.colorCategory;
        if (req.query.interior) filter.interior = req.query.interior;
        if (req.query.exterior) filter.exterior = req.query.exterior;

        // NOTE: No .sort() in MongoDB query — large base64 images cause MongoDB Atlas free tier to exceed 32MB sort memory limit
        // Sort in Node.js heap memory by sortOrder so customer UI matches admin panel order exactly.
        const products = await Product.find(filter).lean();
        sortProductsByOrder(products);
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: "Error fetching products", error: error.message });
    }
});

// PUT reorder products
app.put('/api/products/reorder', async (req, res) => {
    try {
        const { products } = req.body;
        if (Array.isArray(products)) {
            for (const item of products) {
                await Product.findByIdAndUpdate(item.id || item._id, { sortOrder: item.sortOrder });
            }
        }
        res.json({ message: "Products reordered successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error reordering products", error: error.message });
    }
});

// POST seed products
app.post('/api/products/seed', async (req, res) => {
    try {
        const { products } = req.body;
        let count = 0;
        if (Array.isArray(products)) {
            const validCategories = ['Granite', 'Marble', 'Sandstone', 'Quartz', 'Onyx', 'Paving and Landscape', 'Other Natural Stones', 'Royal Gemstone'];
            for (let i = 0; i < products.length; i++) {
                const p = products[i];
                const existing = await Product.findOne({ name: p.name });
                if (!existing) {
                    let stoneCategory = 'Granite';
                    if (p.material) {
                        if (validCategories.includes(p.material)) {
                            stoneCategory = p.material;
                        } else if (['Quartzite', 'Limestone', 'Slate', 'Basalt', 'Travertine', 'Soapstone', 'Terrazzo', 'Tiles', 'Slate Stone'].includes(p.material)) {
                            stoneCategory = 'Other Natural Stones';
                        }
                    } else if (validCategories.includes(p.category)) {
                        stoneCategory = p.category;
                    }

                    const stoneColor = p.color || (p.material ? p.category : p.colorCategory || 'White');
                    const isRoyal = Boolean(p.isRoyalGemStone || stoneCategory === 'Royal Gemstone');

                    await Product.create({
                        name: p.name,
                        category: stoneCategory,
                        categories: Array.isArray(p.categories) ? p.categories : [stoneCategory],
                        variety: p.variety || p.material || stoneCategory,
                        color: stoneColor,
                        colorCategory: p.colorCategory || stoneColor || '',
                        origin: p.origin || 'India',
                        price: String(p.price || 50),
                        images: Array.isArray(p.images) ? p.images : [p.image || ''],
                        sortOrder: i,
                        isRoyalGemStone: isRoyal
                    });
                    count++;
                }
            }
        }
        res.json({ message: `Seeded ${count} new products into database.` });
    } catch (error) {
        res.status(500).json({ message: "Error seeding products", error: error.message });
    }
});

// POST convert product images to database Base64 URLs
app.post('/api/products/convert-images', async (req, res) => {
    const fs = require('fs');
    const path = require('path');
    try {
        const products = await Product.find({});
        const publicDir = path.join(__dirname, '../frontend/public');
        let updatedCount = 0;
        for (const p of products) {
            let modified = false;
            const newImages = [];
            for (const img of (p.images || [])) {
                if (!img || img.startsWith('data:image/')) {
                    newImages.push(img);
                    continue;
                }
                if (img.startsWith('/')) {
                    const localPath = path.join(publicDir, img);
                    if (fs.existsSync(localPath)) {
                        try {
                            const buffer = fs.readFileSync(localPath);
                            const ext = path.extname(localPath).toLowerCase().replace('.', '') || 'jpeg';
                            const mimeType = ext === 'jpg' ? 'image/jpeg' : `image/${ext}`;
                            newImages.push(`data:${mimeType};base64,${buffer.toString('base64')}`);
                            modified = true;
                        } catch (e) {
                            newImages.push(img);
                        }
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
            }
        }
        res.json({ message: `Successfully converted images to database URLs for ${updatedCount} products.` });
    } catch (error) {
        res.status(500).json({ message: "Error converting images", error: error.message });
    }
});

// GET single product by ID
app.get('/api/products/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: "Error fetching product", error: error.message });
    }
});

// POST create a new product
app.post('/api/products', async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(400).json({ message: "Error creating product", error: error.message });
    }
});

// PUT update a product by ID
app.put('/api/products/:id', async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedProduct) return res.status(404).json({ message: "Product not found" });
        res.json(updatedProduct);
    } catch (error) {
        res.status(400).json({ message: "Error updating product", error: error.message });
    }
});

// DELETE a product by ID
app.delete('/api/products/:id', async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) return res.status(404).json({ message: "Product not found" });
        res.json({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting product", error: error.message });
    }
});

// GET finish enum values (for frontend dropdowns)
app.get('/api/enums/finish', (req, res) => {
    res.json(Product.FINISH_ENUM);
});

// GET category enum values (for frontend dropdowns)
app.get('/api/enums/category', (req, res) => {
    res.json(Product.CATEGORY_ENUM);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});