import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { connectDB, getDBStatus } from './src/server/config/db.ts';
import employeeRoutes from './src/server/routes/employeeRoutes.ts';
import { errorHandler } from './src/server/middleware/errorHandler.ts';

// Load environment variables from .env if present
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  // Connect to Database using Mongoose
  await connectDB();

  // Standard middleware
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));

  // System Diagnostics & Database Status endpoint
  app.get('/api/health', (_req, res) => {
    res.status(200).json({
      status: 'operational',
      timestamp: new Date().toISOString(),
      database: getDBStatus(),
      platform: 'GUPIO EMS Platform v2.4',
    });
  });

  // Mount Employee REST API
  app.use('/api/employees', employeeRoutes);

  // Mount centralized error handler for API routes
  app.use('/api', errorHandler);

  // Integrate Vite for SPA development or serve compiled static assets in production
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 [GUPIO EMS] Full-Stack Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error('Fatal initialization error:', error);
  process.exit(1);
});
