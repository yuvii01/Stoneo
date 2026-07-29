const mongoose = require('mongoose');
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
const Product = require('./models/Product');

mongoose.connect('mongodb+srv://Stoneo:Stoneo@stoneo.hydiprf.mongodb.net/?appName=stoneo').then(async () => {
    const total = await Product.countDocuments({});
    const royals = await Product.countDocuments({ isRoyalGemStone: true });
    const standard = await Product.countDocuments({ isRoyalGemStone: false });
    const cats = await Product.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }]);
    const sample = await Product.findOne({ isRoyalGemStone: false }).lean();
    console.log('Total:', total);
    console.log('Royal:', royals);
    console.log('Standard:', standard);
    console.log('Categories:', JSON.stringify(cats));
    if (sample) {
        const copy = { ...sample };
        delete copy.images;
        console.log('Sample product doc:', JSON.stringify(copy, null, 2));
    }
    mongoose.disconnect();
}).catch(err => console.error('Error:', err.message));
