require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { apiLimiter } = require('./middleware/rateLimit');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('trust proxy', 1);
app.use(helmet());

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  process.env.FRONTEND_URL,
  process.env.CF_PAGES_URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    if (origin.endsWith('.vercel.app') || origin.endsWith('.pages.dev')) {
      return callback(null, true);
    }
    return callback(new Error('CORS not allowed'));
  }
}));

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  next();
});

app.use('/api', apiLimiter);

const cache = require('./utils/cache');
const startTime = Date.now();

app.get('/api/health', (req, res) => {
  const stats = cache.getStats?.() || { hits: 0, misses: 0 };
  res.json({
    status: 'healthy',
    uptime: Math.floor((Date.now() - startTime) / 1000),
    timestamp: new Date(),
    version: '1.0.0',
    cache: {
      keys: cache.keys().length,
      hits: stats.hits,
      misses: stats.misses,
      hitRate: stats.hits + stats.misses > 0
        ? ((stats.hits / (stats.hits + stats.misses)) * 100).toFixed(1) + '%'
        : '0%'
    }
  });
});

app.use('/api/sky-events', require('./routes/skyEvents'));
app.use('/api/discoveries', require('./routes/discoveries'));
app.use('/api/history', require('./routes/history'));
app.use('/api/apod', require('./routes/apod'));
app.use('/api/geocode', require('./routes/geocode'));

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
