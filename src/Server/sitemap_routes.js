import express from 'express';
import fs from 'fs';
import path from 'path';
import pool from './config_db.js'; // Import database connection
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';



const sitemapRouter = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Fetch dynamic URLs from the database
const fetchDynamicUrls = async () => {
  try {
    const [bites] = await pool.promise().query('SELECT landing_page_url FROM bites');
    const [missions] = await pool.promise().query('SELECT landing_page_url FROM missions');

    // Filter out rows where landing_page_url is null
    const filteredBites = bites.filter(row => row.landing_page_url);
    const filteredMissions = missions.filter(row => row.landing_page_url);

    const dynamicUrls = [
      ...filteredBites.map(row => ({ loc: `${row.landing_page_url}`, lastmod: new Date().toISOString().split('T')[0] })),
      ...filteredMissions.map(row => ({ loc: `${row.landing_page_url}`, lastmod: new Date().toISOString().split('T')[0] })),
    ];

    return dynamicUrls;
  } catch (error) {
    console.error('Error fetching dynamic URLs:', error);
    throw error;
  }
};

dotenv.config();

// Generate Sitemap
sitemapRouter.get('/generate-sitemap', async (req, res) => {
  try {
    const baseUrl = process.env.APP_URL || 'http://localhost:5173';

    // Static URLs
    const staticUrls = [
      { loc: '/bytes', lastmod: new Date().toISOString().split('T')[0], priority: 1.0 },
      { loc: '/missions', lastmod: new Date().toISOString().split('T')[0], priority: 1.0 },
      { loc: '/profile', lastmod: new Date().toISOString().split('T')[0], priority: 0.8 },
      { loc: '/leaderboard', lastmod: new Date().toISOString().split('T')[0], priority: 0.8 },
      { loc: '/loyalty', lastmod: new Date().toISOString().split('T')[0], priority: 0.7 },
    ];

    // Dynamic URLs
    const dynamicUrls = await fetchDynamicUrls();

    // Combine URLs
    const urls = [...staticUrls, ...dynamicUrls];

    // Build Sitemap XML
    const sitemapContent = `
      <xml version="1.0" encoding="UTF-8">
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${urls.map(url => `
          <url>
            <loc>${baseUrl}${url.loc}</loc>
            <lastmod>${url.lastmod}</lastmod>
            <priority>${url.priority || 0.5}</priority>
          </url>
        `).join('')}
      </urlset>
      </xml>
    `;

    // Save the sitemap file to the root-level public folder
    const sitemapPath = path.resolve(__dirname, '../../public/sitemap.xml');
    console.log("Saving sitemap to:", sitemapPath);

    try {
      fs.writeFileSync(sitemapPath, sitemapContent, 'utf8');
      console.log("Sitemap saved successfully at:", sitemapPath);
    } catch (error) {
      console.error("Error saving sitemap:", error.message);
    }

    res.json({ message: 'Sitemap generated successfully', sitemapPath });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    res.status(500).json({ error: 'Failed to generate sitemap' });
  }
});

export default sitemapRouter;
