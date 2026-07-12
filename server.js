/**
 * ShopEZ MVC Application Entry Point Wrapper
 * 
 * This file acts as the standard Node.js server.js entry point.
 * It registers the tsx engine to run the type-safe TypeScript backend (server.ts) 
 * in development, and loads the optimized bundled server in production.
 */

try {
  // Register the TypeScript compilation loader dynamically
  require('tsx/cjs');
  require('./server.ts');
} catch (err) {
  try {
    // If tsx isn't installed or running in a strict production node environment, 
    // fall back to the compiled CommonJS server bundle
    require('./dist/server.cjs');
  } catch (prodErr) {
    console.error('[ShopEZ] Failed to start server via tsx loader or compiled production bundle.');
    console.error('Development loader error:', err);
    console.error('Production bundle error:', prodErr);
    process.exit(1);
  }
}
