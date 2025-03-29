import express from 'express';
import pool from './config_db.js';

const missionsReportRouter = express.Router();

// Get missions report
missionsReportRouter.get('/missionsreport', (req, res) => {
  const query = `
    SELECT 
      m.name,
      CASE 
        WHEN m.published = 1 THEN '✔️'
        ELSE '❌'
      END AS published,
      CASE 
        WHEN c.mission_id IS NOT NULL THEN '✔️'
        ELSE '❌'
      END AS criteria,
      CASE 
        WHEN m.landing_page_url IS NOT NULL AND m.landing_page_url != '' 
        THEN CONCAT('<a href="', m.landing_page_url, '" target="_blank">Preview</a>')
        ELSE '❌'
      END AS url
    FROM 
      missions m
    LEFT JOIN 
      criteria c ON m.mission_id = c.mission_id
    GROUP BY 
      m.mission_id;
  `;

  pool.query(query, (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ error: 'Database error', details: err });
    }
    return res.status(200).json(results);
  });
});

export default missionsReportRouter;
