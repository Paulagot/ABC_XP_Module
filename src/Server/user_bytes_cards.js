import express from 'express';
import db from './config_db.js';

const UserBytesCardsRouter = express.Router();

UserBytesCardsRouter.get('/user_bytes_cards', (req, res) => {
    const { user_id } = req.query;

    // SQL Query to fetch all bytes and their statuses for the given user
    const query = `
        SELECT 
        ub.user_course_id, 
        ub.user_id, 
        ub.bite_id, 
        ub.enrol_date,
        ub.start_date,
        ub.completion_date, 
        ub.created_at,
        ub.updated_at,
        b.name AS byte_name,
        b.points AS lp_value,
        b.subcategory_id,
        u.first_name  -- Fetch the user's first name from the users table
    FROM 
        user_bytes AS ub
    JOIN 
        bites AS b ON ub.bite_id = b.bite_id
    JOIN 
        users AS u ON ub.user_id = u.user_id  -- Join with the users table to get the user's name
    WHERE 
        ub.user_id = ?;
`;

    db.query(query, [user_id], (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ error: 'Database error' });
        }

        // Process the data to add the status for each byte
        const processedResults = results.map(byte => {
            let status;
            if (!byte.start_date) {
                status = "Explore Byte"; // Not started
            } else if (byte.start_date && !byte.completion_date) {
                status = "Continue Byte"; // Started but not completed
            } else if (byte.completion_date) {
                status = "Byte Complete"; // Completed
            }

            return {
                ...byte,
                status
            };
        });

        res.status(200).json(processedResults);
    });
});

UserBytesCardsRouter.get('/user_completed_bytes', (req, res) => {
    const { user_id } = req.query;

    // SQL Query to fetch only completed bytes for the given user
    const query = `
        SELECT 
            ub.user_course_id, 
            ub.user_id, 
            ub.bite_id, 
            ub.enrol_date,
            ub.start_date,
            ub.completion_date, 
            ub.created_at,
            ub.updated_at,
            b.name AS byte_name,
            b.points AS lp_value,
            b.subcategory_id
        FROM 
            user_bytes AS ub
        JOIN 
            bites AS b ON ub.bite_id = b.bite_id
        WHERE 
            ub.user_id = ? AND ub.completion_date IS NOT NULL;  -- Only fetch completed bytes
    `;

    db.query(query, [user_id], (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ error: 'Database error' });
        }

        res.status(200).json(results);
    });
});

export default UserBytesCardsRouter;
