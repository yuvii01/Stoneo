// require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const Blog = require('./models/Blog');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect("mongodb+srv://stoneoindia:stoneoindia@stoneo.dsexaz0.mongodb.net/?appName=stoneo", { family: 4 })
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
        const { title, excerpt, content, image, author, date } = req.body;

        const newBlog = new Blog({
            title,
            excerpt,
            content,
            image,
            author,
            date
        });

        const savedBlog = await newBlog.save();
        res.status(201).json(savedBlog);
    } catch (error) {
        res.status(400).json({ message: "Error creating blog", error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});