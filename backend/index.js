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
        const { title, excerpt, content, image, author, date, tags } = req.body;

        const newBlog = new Blog({
            title,
            excerpt,
            content,
            image,
            author,
            date,
            tags
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

// GET all products (with optional query filters)
app.get('/api/products', async (req, res) => {
    try {
        const filter = {};
        if (req.query.category) filter.category = req.query.category;
        if (req.query.finish) filter.finish = req.query.finish;
        if (req.query.color) filter.color = { $regex: req.query.color, $options: 'i' };
        if (req.query.thickness) filter.thickness = req.query.thickness;
        if (req.query.slipResistance) filter.slipResistance = req.query.slipResistance;
        if (req.query.priceRange) filter.priceRange = req.query.priceRange;
        if (req.query.colorCategory) filter.colorCategory = req.query.colorCategory;
        if (req.query.interior) filter.interior = req.query.interior;
        if (req.query.exterior) filter.exterior = req.query.exterior;

        const products = await Product.find(filter).sort({ createdAt: -1 });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: "Error fetching products", error: error.message });
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