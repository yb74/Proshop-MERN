import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import colors from 'colors';
import morgan from 'morgan';
import {notFound, errorHandler} from './middleware/errorMiddleware.js';
import connectDB from './config/db.js'; // we put .js cos we use ES modules with node.js (backend)

import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

dotenv.config();

connectDB();

const app = express();

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.use(express.json()); // allow to use Json data in body of request

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);

app.get('/api/config/paypal', (req, res) => res.send(process.env.PAYPAL_CLIENT_ID));

const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads'))); // make uploads files static with express

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '/frontend/build'))); // if we are in prod we set frontend/build to a static folder
    app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, '/frontend', 'build', 'index.html'))); // any route that are not above (api route) will point to index.html in build folder located in the static folder
} else {
    app.get('/', (req, res) => {
        res.send("API is running...");
    });
}

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(
    PORT, 
    console.log(`Server running in ${process.env.NODE_ENV} on port ${PORT}`.yellow.bold)
);