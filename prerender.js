/**
 * prerender.js
 * Runs after `vite build` to generate static HTML for each route.
 * This ensures crawlers (including AdSense) see unique content per page.
 */

import puppeteer from 'puppeteer';
import { createServer } from 'http';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST_DIR = join(__dirname, 'dist');
const PORT = 4173;

// All static routes to pre-render
const ROUTES = [
    '/about',
    '/privacy',
    '/terms',
    '/contact',
    '/resources',
    '/resources/virtual-birthday-ideas-2026',
    '/resources/long-distance-birthday-guide',
    '/resources/digital-vs-physical-cards',
    '/resources/birthday-message-etiquette',
];

// Simple static file server for the dist folder
function startServer() {
    const indexHtml = readFileSync(join(DIST_DIR, 'index.html'), 'utf-8');

    const server = createServer((req, res) => {
        let filePath = join(DIST_DIR, req.url === '/' ? 'index.html' : req.url);

        // If file doesn't exist, serve index.html (SPA fallback)
        if (!existsSync(filePath) || filePath.endsWith(DIST_DIR)) {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(indexHtml);
            return;
        }

        const ext = filePath.split('.').pop();
        const mimeTypes = {
            html: 'text/html',
            js: 'application/javascript',
            css: 'text/css',
            json: 'application/json',
            png: 'image/png',
            jpg: 'image/jpeg',
            svg: 'image/svg+xml',
            woff2: 'font/woff2',
        };

        try {
            const content = readFileSync(filePath);
            res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
            res.end(content);
        } catch {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(indexHtml);
        }
    });

    return new Promise((resolve) => {
        server.listen(PORT, () => {
            console.log(`  Static server running on http://localhost:${PORT}`);
            resolve(server);
        });
    });
}

async function prerender() {
    console.log('\n🔨 Pre-rendering static pages...\n');

    const server = await startServer();
    const browser = await puppeteer.launch({ headless: true });

    let successCount = 0;

    for (const route of ROUTES) {
        try {
            const page = await browser.newPage();
            const url = `http://localhost:${PORT}${route}`;

            console.log(`  Rendering: ${route}`);
            await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });

            // Wait a bit for React to fully render
            await new Promise(r => setTimeout(r, 2000));

            const html = await page.content();

            // Determine output path
            const outputDir = route === '/'
                ? DIST_DIR
                : join(DIST_DIR, ...route.split('/').filter(Boolean));

            mkdirSync(outputDir, { recursive: true });
            writeFileSync(join(outputDir, 'index.html'), html, 'utf-8');

            console.log(`  ✅ Saved: ${route} → ${join(outputDir, 'index.html')}`);
            successCount++;

            await page.close();
        } catch (err) {
            console.error(`  ❌ Failed: ${route} — ${err.message}`);
        }
    }

    await browser.close();
    server.close();

    console.log(`\n🎉 Pre-rendered ${successCount}/${ROUTES.length} pages.\n`);
}

prerender().catch(console.error);
