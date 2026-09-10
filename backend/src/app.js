const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const mediaInfoRoutes = require('./features/media-info/media-info.routes');
const mediaDownloadRoutes = require('./features/media-download/media-download.routes');
const errorHandler = require('./shared/middleware/errorHandler');

const app = express();

// Middleware
app.use(cors({ origin: true }));
app.use(express.json());

// Rate Limiter for downloads
const downloadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX, 10) || 30, // Limit each IP
  message: { error: 'Too many download requests, please try again later.' }
});

// Routes
app.use('/api/media/info', mediaInfoRoutes);
app.use('/api/media/download', downloadLimiter, mediaDownloadRoutes);

// Global Error Handler
app.use(errorHandler);

module.exports = app;
