import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

// Route Imports
import productRouter from './routes/product.routes';
import orderRouter from './routes/order.routes';
import aiRouter from './routes/ai.routes';
import healthRouter from './routes/health.routes';

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Middleware for parsing JSON requests
app.use(express.json());

// --- API Routes (MVC Architecture) ---
app.use('/api/products', productRouter);
app.use('/api/orders', orderRouter);
app.use('/api', aiRouter); // Maps /api/artisan-advisor
app.use('/api/health', healthRouter);

// --- Express + Vite Server Integration ---
async function startServer() {
  const distPath = path.join(process.cwd(), 'dist');
  const hasBuiltAssets = fs.existsSync(path.join(distPath, 'index.html'));

  if (process.env.NODE_ENV !== 'production' && !hasBuiltAssets) {
    // Vite dev mode
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('Vite middleware loaded in Express dev mode.');
  } else {
    // Production static serving
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log('Serving static files from dist directory in production mode.');
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[ShopEZ Full-Stack Server] running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
