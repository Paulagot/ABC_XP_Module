import express from 'express';
import pool from'./config_db.js'

const Sales_page_router = express.Router();

/**
 * Route: GET /api/landing-options/:type
 * Purpose: Fetch a list of available Bytes or Missions by type for dropdown selection.
 */
Sales_page_router.get('/landing-options/:type', (req, res) => {
    const { type } = req.params;

    if (type !== 'byte' && type !== 'mission') {
        return res.status(400).json({ error: 'Invalid type parameter. Must be "byte" or "mission".' });
    }

    const table = type === 'byte' ? 'bites' : 'missions';

    const query = `
        SELECT ${type === 'byte' ? 'bite_id AS id' : 'mission_id AS id'}, name
        FROM ${table}
    `;

    pool.query(query, (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ error: 'Database error occurred while fetching options.', details: err });
        }
        return res.status(200).json(results);
    });
});


/**
 * Route: GET /api/landing-details/:type/:id
 * Purpose: Fetch detailed information for a specific Byte or Mission, including category, subcategory, and sponsor details.
 */
Sales_page_router.get('/api/landing-details/:type/:id', (req, res) => {
    const { type, id } = req.params;

    // Validate the type parameter
    if (type !== 'byte' && type !== 'mission') {
        return res.status(400).json({ error: 'Invalid type parameter. Must be "byte" or "mission".' });
    }

    const table = type === 'byte' ? 'bites' : 'missions';
    const idColumn = type === 'byte' ? 'bite_id' : 'mission_id';

    // Dynamically adjust the select fields and joins
    const selectFields = `
        b.*, 
        ${type === 'byte' ? 'c.name AS category_name,' : ''}
        ${type === 'mission' ? 'ch.name AS chain_name,' : ''}
        sc.name AS subcategory_name, 
        s.name AS sponsor_name, 
        s.sponsor_image,
        pc.rich_text_content,        -- Rich text content from page_content table
        pc.seo_title,                -- SEO title
        pc.meta_description,         -- Meta description
        pc.meta_keywords,            -- Meta keywords
        pc.social_title,             -- Social media title
        pc.social_description,       -- Social media description
        pc.social_image,             -- Social media image
        pc.summary,                  -- Summary
        pc.tags                      -- Tags
    `;

    const joins = `
        ${type === 'byte' ? 'LEFT JOIN categories AS c ON b.category_id = c.category_id' : ''}
        ${type === 'mission' ? 'LEFT JOIN chains AS ch ON b.chain_id = ch.chain_id' : ''}
        LEFT JOIN subcategories AS sc ON b.subcategory_id = sc.subcategory_id
        LEFT JOIN sponsors AS s ON b.sponsor_id = s.sponsor_id
        LEFT JOIN page_content AS pc ON b.${idColumn} = pc.reference_id AND pc.reference_type = ?
    `;

    const query = `
        SELECT ${selectFields}
        FROM ${table} AS b
        ${joins}
        WHERE b.${idColumn} = ?
    `;

    pool.query(query, [type, id], (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ error: 'Database error occurred while fetching details.', details: err });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: `No ${type} found with ID ${id}.` });
        }

        return res.status(200).json(results[0]);
    });
});



/**
 * Route: GET /api/page-content/draft/:type/:id
 * Purpose: Retrieve draft data for a specific byte or mission.
 * - Fetches draft content for the specified `type` (byte or mission) and `id`.
 * - Responds with the full draft object if found.
 * - Handles error cases for invalid types, missing drafts, and database errors.
 */

Sales_page_router.get('/page-content/draft/:type/:id', (req, res) => {
    const { type, id } = req.params;

    // Validate the type parameter
    if (type !== 'byte' && type !== 'mission') {
        return res.status(400).json({ error: 'Invalid type parameter. Must be "byte" or "mission".' });
    }

    // Updated SQL query to fetch draft data
    const query = `
        SELECT 
            content_id,               -- Primary key of the draft
            reference_id,             -- ID of the byte or mission being referenced
            reference_type,           -- Type of reference ('byte' or 'mission')
            rich_text_content,        -- Rich text content (new field)
            summary,                  -- Summary of the draft
            tags,                     -- Tags associated with the draft
            status,                   -- Draft status ('draft' or 'published')
            landing_page_url,         -- Landing page URL for the content
            seo_title,                -- SEO title
            meta_description,         -- Meta description
            meta_keywords,            -- Meta keywords
            social_title,             -- Social media title
            social_description,       -- Social media description
            social_image              -- Social media image URL
        FROM page_content
        WHERE reference_id = ? AND reference_type = ?
    `;

    // Execute the query
    pool.query(query, [id, type], (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ error: 'Database error occurred while fetching draft.', details: err });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: `No draft found for ${type} with ID ${id}.` });
        }

        return res.status(200).json(results[0]);
    });
});



/**
 * Route: POST /api/page-content/draft
 * Purpose: Save or update a draft with all fields dynamically handled.
 */
Sales_page_router.post('/page-content/draft', (req, res) => {
   

    const {
        reference_id, reference_type,      // Reference details
        rich_text_content,                // Rich text content (new field)
        summary,                          // Summary
        tags,                             // Tags
        seo_title, meta_description,      // SEO details
        meta_keywords, social_title,      // Social media details
        social_description, social_image, // Social media image
    } = req.body;

    // Validate required fields
    if (!reference_id || !reference_type) {
        return res.status(400).json({ error: 'Reference ID and type are required for saving a draft.' });
    }

    // Updated SQL query to insert or update draft data
    const query = `
        INSERT INTO page_content (
            reference_id, reference_type, rich_text_content, summary, tags,
            seo_title, meta_description, meta_keywords, social_title, 
            social_description, social_image, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'draft')
        ON DUPLICATE KEY UPDATE
            rich_text_content = VALUES(rich_text_content),
            summary = VALUES(summary),
            tags = VALUES(tags),
            seo_title = VALUES(seo_title),
            meta_description = VALUES(meta_description),
            meta_keywords = VALUES(meta_keywords),
            social_title = VALUES(social_title),
            social_description = VALUES(social_description),
            social_image = VALUES(social_image)
    `;

    const values = [
        reference_id, reference_type, rich_text_content || '', summary || '', tags || '',
        seo_title || '', meta_description || '', meta_keywords || '', social_title || '',
        social_description || '', social_image || ''
    ];

    // Execute the query
    pool.query(query, values, (err, result) => {
       

        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ error: 'Database error occurred while saving draft.', details: err });
        }

        return res.status(201).json({ message: 'Draft saved successfully', content_id: result.insertId });
    });
});


/**
 * Route: PUT /api/page-content/:id
 * Purpose: Update an existing draft for a specific byte or mission.
 */

Sales_page_router.put('/page-content/:content_id', (req, res) => {
   

    const { content_id } = req.params;

    const {
        rich_text_content,                // Rich text content (new field)
        summary,                          // Summary
        tags,                             // Tags
        seo_title, meta_description,      // SEO details
        meta_keywords, social_title,      // Social media details
        social_description, social_image, // Social media image
        landing_page_url,                 // Landing page URL
        status,                           // Draft or published
    } = req.body;

    // Validate the content_id
    if (!content_id) {
        return res.status(400).json({ error: 'Content ID is required for updating a draft.' });
    }

    // Updated SQL query to update draft data
    const query = `
        UPDATE page_content
        SET
            rich_text_content = COALESCE(?, rich_text_content),
            summary = COALESCE(?, summary),
            tags = COALESCE(?, tags),
            seo_title = COALESCE(?, seo_title),
            meta_description = COALESCE(?, meta_description),
            meta_keywords = COALESCE(?, meta_keywords),
            social_title = COALESCE(?, social_title),
            social_description = COALESCE(?, social_description),
            social_image = COALESCE(?, social_image),
            landing_page_url = COALESCE(?, landing_page_url),
            status = COALESCE(?, status),
            updated_at = NOW()
        WHERE content_id = ?
    `;

    const values = [
        rich_text_content || null, summary || null, tags || null,
        seo_title || null, meta_description || null, meta_keywords || null,
        social_title || null, social_description || null, social_image || null,
        landing_page_url || null, status || null,
        content_id
    ];

    // Execute the query
    pool.query(query, values, (err, result) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ error: 'Database error occurred while updating the draft.', details: err });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'No page content found with this content_id.' });
        }

        res.status(200).json({ message: 'Page content updated successfully.' });
    });
});

/**
 * Route: GET /landing-pages/:slug
 * Purpose: Fetch a landing page based on its slug and include additional details for Bytes or Missions.
 */
Sales_page_router.get('/landing-pages/:slug', (req, res) => {
    const { slug } = req.params;

    // Step 1: Fetch the page content details
    const contentQuery = `
        SELECT 
            content_id, reference_id, reference_type, landing_page_url, rich_text_content,
            seo_title, meta_description, meta_keywords, 
            social_title, social_description, social_image,
            summary, tags
        FROM page_content
        WHERE landing_page_url = ? OR landing_page_url = ?
    `;

    pool.query(contentQuery, [`/bytes/${slug}`, `/missions/${slug}`], (err, contentResults) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ error: 'Database error occurred while fetching page content.' });
        }

        if (contentResults.length === 0) {
            return res.status(404).json({ error: `No page content found for slug ${slug}.` });
        }

        const contentData = contentResults[0];
        const { reference_id, reference_type } = contentData;

        // Step 2: Fetch additional details for the reference
        const table = reference_type === 'byte' ? 'bites' : 'missions';
        const idColumn = reference_type === 'byte' ? 'bite_id' : 'mission_id';

        const detailsQuery = `
            SELECT 
                b.*, 
                ${reference_type === 'byte' ? 'c.name AS category_name,' : ''}
                ${reference_type === 'mission' ? 'ch.name AS chain_name,' : ''}
                sc.name AS subcategory_name, 
                s.name AS sponsor_name, 
                s.sponsor_image
            FROM ${table} AS b
            ${reference_type === 'byte' ? 'LEFT JOIN categories AS c ON b.category_id = c.category_id' : ''}
            ${reference_type === 'mission' ? 'LEFT JOIN chains AS ch ON b.chain_id = ch.chain_id' : ''}
            LEFT JOIN subcategories AS sc ON b.subcategory_id = sc.subcategory_id
            LEFT JOIN sponsors AS s ON b.sponsor_id = s.sponsor_id
            WHERE b.${idColumn} = ?
        `;

        pool.query(detailsQuery, [reference_id], (err, detailsResults) => {
            if (err) {
                console.error('Database query error:', err);
                return res.status(500).json({ error: 'Database error occurred while fetching additional details.' });
            }

            if (detailsResults.length === 0) {
                return res.status(404).json({ error: `No ${reference_type} found with ID ${reference_id}.` });
            }

            const response = {
                ...contentData,
                ...detailsResults[0], // Merge additional details into the response
            };

            return res.status(200).json(response);
        });
    });
});




  /**
 * Route: PUT /api/page-content/publish/:content_id
 * Purpose: Publish the content, allowing users to confirm or customize the URL.
 */
Sales_page_router.put('/page-content/publish/:content_id', (req, res) => {
    const { content_id } = req.params;

    const {
        reference_id, reference_type,   // Reference details
        rich_text_content,             // Rich text content (new field)
        seo_title, meta_description,   // SEO details
        meta_keywords, social_title,   // Social media details
        social_description, social_image, // Social media image
        summary, tags                  // Summary and tags
    } = req.body;

    

    // Validate required fields
    if (!content_id || !reference_id || !reference_type || !seo_title || !rich_text_content) {
        return res.status(400).json({ error: 'Required fields are missing for publishing.' });
    }

    // Generate a unique URL based on social_title
    const sanitizedName = social_title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const landingPageUrl = `/${reference_type === 'byte' ? 'bytes' : 'missions'}/${sanitizedName}`;

    // Begin transaction
    pool.query('START TRANSACTION', (err) => {
        if (err) {
            console.error('Error starting transaction:', err);
            return res.status(500).json({ error: 'Transaction error occurred while publishing.' });
        }

        // Update page_content table
        const updateContentQuery = `
            UPDATE page_content
            SET 
                rich_text_content = ?, summary = ?, tags = ?,
                seo_title = ?, meta_description = ?, meta_keywords = ?,
                social_title = ?, social_description = ?, social_image = ?,
                landing_page_url = ?, status = 'published', updated_at = NOW()
            WHERE content_id = ?
        `;
        const contentValues = [
            rich_text_content, summary || '', tags || '',
            seo_title, meta_description || '', meta_keywords || '',
            social_title, social_description || '', social_image || '',
            landingPageUrl, content_id
        ];

        pool.query(updateContentQuery, contentValues, (err) => {
            if (err) {
                console.error('Error updating page_content:', err);
                return pool.query('ROLLBACK', () => {
                    res.status(500).json({ error: 'Failed to update page_content.' });
                });
            }

            // Update reference table (bites or missions)
            const updateReferenceQuery = `
                UPDATE ${reference_type === 'byte' ? 'bites' : 'missions'}
                SET landing_page_url = ?
                WHERE ${reference_type === 'byte' ? 'bite_id' : 'mission_id'} = ?
            `;
            pool.query(updateReferenceQuery, [landingPageUrl, reference_id], (err) => {
                if (err) {
                    console.error('Error updating reference table:', err);
                    return pool.query('ROLLBACK', () => {
                        res.status(500).json({ error: 'Failed to update reference table.' });
                    });
                }

                // Commit the transaction
                pool.query('COMMIT', (err) => {
                    if (err) {
                        console.error('Error committing transaction:', err);
                        return res.status(500).json({ error: 'Transaction commit failed.' });
                    }

                    res.status(200).json({ message: 'Page published successfully.', landing_page_url: landingPageUrl });
                });
            });
        });
    });
});





export default Sales_page_router;

   
