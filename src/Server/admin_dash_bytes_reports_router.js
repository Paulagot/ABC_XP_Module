import express from 'express';
import pool from './config_db.js';

const bitesReportRouter = express.Router();

// Get bites report
bitesReportRouter.get('/bitesreport', (req, res) => {
  const query = `
    SELECT 
      name,
      CASE 
        WHEN published = 1 THEN '✔️'
        ELSE '❌'
      END AS published,
      CASE 
        WHEN landing_page_url IS NOT NULL AND landing_page_url != '' 
        THEN CONCAT('<a href="', landing_page_url, '" target="_blank">Preview</a>')
        ELSE '❌'
      END AS url
    FROM bites;
  `;

  pool.query(query, (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ error: 'Database error', details: err });
    }
    return res.status(200).json(results);
  });
});

export default bitesReportRouter;

