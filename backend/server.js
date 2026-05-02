
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser'; // 1. Import cookie-parser
import 'dotenv/config';
import bcrypt from 'bcryptjs';
import compression from 'compression';
import path from 'path';
import { fileURLToPath } from 'url';

import connectDB from './db.js';
import Product from './models/Product.js';
import Settings from './models/Settings.js';

import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';
import messageRoutes from './routes/messages.js';
import settingsRoutes from './routes/settings.js';
import trackingRoutes from './routes/tracking.js';

import { MOCK_PRODUCTS_DATA, DEFAULT_SETTINGS_DATA } from './data/seedData.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(compression());
app.use(cors());
app.use(cookieParser()); // 2. Use cookie-parser middleware
app.use(express.json({ limit: '10mb' }));

let isSeedingComplete = false;
const initializeDatabase = async () => {
    if (isSeedingComplete) return;
    try {
        const settingsCount = await Settings.countDocuments();
        if (settingsCount === 0) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(DEFAULT_SETTINGS_DATA.adminPassword, salt);
            await Settings.create({ ...DEFAULT_SETTINGS_DATA, adminPassword: hashedPassword });
        }
        const productCount = await Product.countDocuments();
        if (productCount === 0) {
            const productsToSeed = MOCK_PRODUCTS_DATA.map(({ id, ...rest }) => ({
                ...rest,
                productId: String(id) 
            }));
            await Product.insertMany(productsToSeed);
        }
        isSeedingComplete = true;
    } catch (error) {
        console.error('Database initialization error:', error);
    }
};

const dbConnectionMiddleware = async (req, res, next) => {
    try {
        await connectDB();
        await initializeDatabase();
        next();
    } catch (error) {
        res.status(503).json({ message: "Service Unavailable" });
    }
};

app.use('/api', dbConnectionMiddleware);

app.get('/api/page-data/home', async (req, res) => {
    try {
        // Cache home data for 10 minutes - it rarely changes
        res.set('Cache-Control', 'public, max-age=600, s-maxage=600');

        const settings = await Settings.findOne().select('-adminPassword').lean();
        
        // Fetch featured products with only necessary fields to reduce payload size
        const products = await Product.find(
            { $or: [{ isNewArrival: true }, { isTrending: true }] },
            { images: { $slice: 1 }, description: 0, colors: 0, sizes: 0 }
        )
        .sort({ isTrending: -1, isNewArrival: -1 })
        .limit(12)
        .lean();

        const formattedProducts = products.map(p => ({
            ...p,
            id: p._id.toString()
        }));

        res.json({ settings, products: formattedProducts });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/track', trackingRoutes);

const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath, { 
    maxAge: '1d',
    etag: true
}));

app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);
    await connectDB().catch(console.error);
});

export default app;
