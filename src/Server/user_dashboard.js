import express from 'express';
import pool from './config_db.js';

const user_dashboard_router = express.Router();
const promisePool = pool.promise();

class APIError extends Error {
    constructor(message, status = 500) {
        super(message);
        this.status = status;
        this.name = 'APIError';
    }
}

// Test endpoint (before validateUser middleware)
user_dashboard_router.get('/dashboard/test', async (req, res, next) => {
    try {
        const [result] = await promisePool.query('SELECT 1 as test');
        res.json({ message: 'Database connection successful', result });
    } catch (error) {
        console.error('Database test error:', error);
        next(error);
    }
});

const validateUser = async (req, res, next) => {
    try {
        const userId = Number.parseInt(req.params.userId);
        if (Number.isNaN(userId)) throw new APIError('Invalid user ID format', 400);
        
        const [users] = await promisePool.query(
            'SELECT user_id FROM users WHERE user_id = ?',
            [userId]
        );
        if (users.length === 0) throw new APIError('User not found', 404);
        next();
    } catch (error) {
        next(error);
    }
};

// Get user's dashboard statistics
user_dashboard_router.get('/dashboard/:userId', validateUser, async (req, res, next) => {
    const { userId } = req.params;
    try {
        // Get progress by subcategory and category
        const [progress] = await promisePool.query(`
            SELECT 
                sc.subcategory_id,
                sc.name as subcategory_name,
                c.category_id,
                c.name as category_name,
                COUNT(DISTINCT b.bite_id) as total_bites,
                COUNT(DISTINCT CASE WHEN ub.completion_date IS NOT NULL THEN b.bite_id END) as completed_bites,
                ROUND(
                    (COUNT(DISTINCT CASE WHEN ub.completion_date IS NOT NULL THEN b.bite_id END) * 100.0) / 
                    NULLIF(COUNT(DISTINCT b.bite_id), 0)
                ) as completion_percentage,
                COALESCE(SUM(ubs.learning_points), 0) as total_learning_points
            FROM subcategories sc
            LEFT JOIN bites b ON b.subcategory_id = sc.subcategory_id AND b.published = 1
            LEFT JOIN categories c ON c.category_id = b.category_id
            LEFT JOIN user_bytes ub ON ub.bite_id = b.bite_id AND ub.user_id = ?
            LEFT JOIN user_bytes_stats ubs ON ubs.bite_id = b.bite_id AND ubs.user_id = ?
            GROUP BY sc.subcategory_id, sc.name, c.category_id, c.name
            ORDER BY sc.subcategory_id, c.category_id
        `, [userId, userId]);

        // Get learning streak
        const [learningStreak] = await promisePool.query(`
            WITH RECURSIVE daily_activity AS (
                SELECT DATE(activity_date) as activity_day
                FROM (
                    SELECT completion_date as activity_date FROM user_bytes 
                    WHERE user_id = ? AND completion_date IS NOT NULL
                    UNION ALL
                    SELECT completion_date FROM user_missions 
                    WHERE user_id = ? AND completion_date IS NOT NULL
                ) all_activity
                GROUP BY DATE(activity_date)
            ),
            dates_with_gaps AS (
                SELECT 
                    activity_day,
                    LAG(activity_day) OVER (ORDER BY activity_day DESC) as next_day
                FROM daily_activity
            )
            SELECT COUNT(*) as streak
            FROM (
                SELECT activity_day
                FROM dates_with_gaps
                WHERE DATEDIFF(activity_day, next_day) = -1 OR next_day IS NULL
                ORDER BY activity_day DESC
                LIMIT 1
            ) current_streak
        `, [userId, userId]);

        // Calculate mission stats with unlock status
        const [missionStats] = await promisePool.query(`
            WITH user_completed_bytes AS (
                SELECT DISTINCT bite_id 
                FROM user_bytes 
                WHERE user_id = ? AND completion_date IS NOT NULL
            ),
            subcategory_points AS (
                SELECT 
                    subcategory_id,
                    SUM(learning_points) as total_points
                FROM user_bytes_stats
                WHERE user_id = ?
                GROUP BY subcategory_id
            ),
            mission_unlock_status AS (
                SELECT 
                    m.mission_id,
                    MAX(CASE 
                        WHEN c.condition_type = 'None' OR c.condition_type IS NULL THEN 1
                        WHEN c.condition_type = 'And' THEN 
                            CASE 
                                WHEN c.criteria_type = 'Bite Complete' THEN 
                                    CASE WHEN ucb.bite_id IS NOT NULL THEN 1 ELSE 0 END
                                WHEN c.criteria_type = 'LP Required' THEN
                                    CASE WHEN COALESCE(sp.total_points, 0) >= c.lp_value THEN 1 ELSE 0 END
                                ELSE 1
                            END
                        ELSE -- 'Or' case
                            CASE 
                                WHEN c.criteria_type = 'Bite Complete' THEN 
                                    CASE WHEN ucb.bite_id IS NOT NULL THEN 1 ELSE 0 END
                                WHEN c.criteria_type = 'LP Required' THEN
                                    CASE WHEN COALESCE(sp.total_points, 0) >= c.lp_value THEN 1 ELSE 0 END
                                ELSE 0
                            END
                    END) as is_unlocked
                FROM missions m
                LEFT JOIN criteria c ON c.mission_id = m.mission_id
                LEFT JOIN user_completed_bytes ucb ON ucb.bite_id = c.bite_id
                LEFT JOIN subcategory_points sp ON sp.subcategory_id = c.subcategory_id
                WHERE m.published = 1
                GROUP BY m.mission_id
            )
            SELECT 
                COUNT(DISTINCT CASE WHEN um.completion_date IS NOT NULL THEN m.mission_id END) as completed_missions,
                COUNT(DISTINCT m.mission_id) as total_missions,
                COUNT(DISTINCT CASE WHEN mus.is_unlocked = 1 THEN m.mission_id END) as unlocked_missions
            FROM missions m
            LEFT JOIN user_missions um ON um.mission_id = m.mission_id AND um.user_id = ?
            LEFT JOIN mission_unlock_status mus ON mus.mission_id = m.mission_id
            WHERE m.published = 1
        `, [userId, userId, userId]);

        res.json({
            progress,
            learningStreak: learningStreak[0].streak,
            missionStats: missionStats[0]
        });
    } catch (error) {
        next(error);
    }
});

// Get mission unlock details
// Get mission unlock status
user_dashboard_router.get('/mission-unlock/:userId', validateUser, async (req, res, next) => {
    const { userId } = req.params;
    try {
        const [missions] = await promisePool.query(`
            WITH user_completed_bytes AS (
                SELECT DISTINCT bite_id 
                FROM user_bytes 
                WHERE user_id = ? AND completion_date IS NOT NULL
            ),
            subcategory_points AS (
                SELECT 
                    subcategory_id,
                    SUM(learning_points) as total_points
                FROM user_bytes_stats
                WHERE user_id = ?
                GROUP BY subcategory_id
            ),
            criteria_evaluation AS (
                SELECT 
                    m.mission_id,
                    MAX(CASE 
                        WHEN c.condition_type = 'None' OR c.condition_type IS NULL THEN 1
                        WHEN c.condition_type = 'And' THEN 
                            CASE 
                                WHEN c.criteria_type = 'Bite Complete' THEN 
                                    CASE WHEN ucb.bite_id IS NOT NULL THEN 1 ELSE 0 END
                                WHEN c.criteria_type = 'LP Required' THEN
                                    CASE WHEN COALESCE(sp.total_points, 0) >= c.lp_value THEN 1 ELSE 0 END
                                ELSE 1
                            END
                        ELSE -- 'Or' case
                            CASE 
                                WHEN c.criteria_type = 'Bite Complete' THEN 
                                    CASE WHEN ucb.bite_id IS NOT NULL THEN 1 ELSE 0 END
                                WHEN c.criteria_type = 'LP Required' THEN
                                    CASE WHEN COALESCE(sp.total_points, 0) >= c.lp_value THEN 1 ELSE 0 END
                                ELSE 0
                            END
                    END) as is_unlocked
                FROM missions m
                LEFT JOIN criteria c ON c.mission_id = m.mission_id
                LEFT JOIN user_completed_bytes ucb ON ucb.bite_id = c.bite_id
                LEFT JOIN subcategory_points sp ON sp.subcategory_id = c.subcategory_id
                WHERE m.published = 1
                GROUP BY m.mission_id
            )
            SELECT 
                m.mission_id,
                m.name,
                m.subcategory_id,
                ce.is_unlocked,
                MAX(CASE WHEN um.completion_date IS NOT NULL THEN 1 ELSE 0 END) as is_completed,
                GROUP_CONCAT(
                    DISTINCT
                    CASE 
                        WHEN c.criteria_type = 'Bite Complete' THEN CONCAT('Complete bite: ', c.bite_id)
                        WHEN c.criteria_type = 'LP Required' THEN CONCAT('Need ', c.lp_value, ' LP in subcategory: ', c.subcategory_id)
                    END
                    SEPARATOR ' | '
                ) as criteria_details
            FROM missions m
            LEFT JOIN criteria c ON c.mission_id = m.mission_id
            LEFT JOIN criteria_evaluation ce ON ce.mission_id = m.mission_id
            LEFT JOIN user_missions um ON um.mission_id = m.mission_id AND um.user_id = ?
            WHERE m.published = 1
            GROUP BY m.mission_id, m.name, m.subcategory_id, ce.is_unlocked
            ORDER BY m.mission_id
        `, [userId, userId, userId]);

        res.json(missions);
    } catch (error) {
        next(error);
    }
});

const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);
    
    if (err instanceof APIError) {
        return res.status(err.status).json({ error: err.message });
    }

    if (err.code === 'ER_NO_SUCH_TABLE') {
        return res.status(500).json({ error: 'Database configuration error' });
    }

    if (err.code === 'ER_BAD_FIELD_ERROR') {
        return res.status(500).json({ error: 'Invalid database query' });
    }

    res.status(500).json({ error: 'Internal server error' });
};

user_dashboard_router.use(errorHandler);



// Get detailed subcategory progress
user_dashboard_router.get('/progress/:userId/:subcategoryId', validateUser, async (req, res, next) => {
    const { userId, subcategoryId } = req.params;
    try {
        const [progress] = await promisePool.query(`
            SELECT 
                b.bite_id,
                b.name,
                ub.course_progress,
                ub.completion_date,
                ubs.learning_points
            FROM bites b
            LEFT JOIN user_bytes ub ON ub.bite_id = b.bite_id AND ub.user_id = ?
            LEFT JOIN user_bytes_stats ubs ON ubs.bite_id = b.bite_id AND ubs.user_id = ?
            WHERE b.subcategory_id = ? AND b.published = 1
            ORDER BY b.bite_id
        `, [userId, userId, subcategoryId]);

        res.json(progress);
    } catch (error) {
        next(error);
    }
});

// Add this endpoint to user_dashboard_router

// Get active subcategories
user_dashboard_router.get('/active-subcategories', async (req, res, next) => {
    try {
        const [subcategories] = await promisePool.query(`
            WITH CategoryStats AS (
                SELECT 
                    b.subcategory_id,
                    c.name as category_name,
                    COUNT(DISTINCT b.bite_id) as total_bites,
                    COUNT(DISTINCT CASE WHEN ub.completion_date IS NOT NULL THEN b.bite_id END) as completed_bites
                FROM bites b
                JOIN categories c ON c.category_id = b.category_id
                LEFT JOIN user_bytes ub ON ub.bite_id = b.bite_id
                WHERE b.published = 1
                GROUP BY b.subcategory_id, c.category_id, c.name
            )
            SELECT 
                s.subcategory_id,
                s.name,
                JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'name', cs.category_name,
                        'progress', ROUND(IFNULL(cs.completed_bites / NULLIF(cs.total_bites, 0), 0), 2)
                    )
                ) as levels
            FROM subcategories s
            JOIN CategoryStats cs ON cs.subcategory_id = s.subcategory_id
            GROUP BY s.subcategory_id, s.name
        `);
        
        res.json(subcategories);
    } catch (error) {
        next(error);
    }
});

// Get detailed mission progress for subcategory
user_dashboard_router.get('/mission-progress/:userId/:subcategoryId', validateUser, async (req, res, next) => {
    const { userId, subcategoryId } = req.params;
    try {
        const [subcategories] = await promisePool.query(
            'SELECT subcategory_id FROM subcategories WHERE subcategory_id = ?',
            [subcategoryId]
        );

        if (subcategories.length === 0) {
            throw new APIError('Subcategory not found', 404);
        }

        const [missionProgress] = await promisePool.query(`
            SELECT 
                m.mission_id,
                m.name,
                m.subtitle,
                m.xp,
                um.course_progress,
                um.start_date,
                um.completion_date,
                ums.experience_points as earned_xp,
                CASE 
                    WHEN um.completion_date IS NOT NULL THEN 'completed'
                    WHEN um.start_date IS NOT NULL THEN 'in_progress'
                    ELSE 'not_started'
                END as status
            FROM missions m
            LEFT JOIN user_missions um ON um.mission_id = m.mission_id AND um.user_id = ?
            LEFT JOIN user_missions_stats ums ON ums.mission_id = m.mission_id AND ums.user_id = ?
            WHERE m.subcategory_id = ? AND m.published = 1
            ORDER BY m.mission_id
        `, [userId, userId, subcategoryId]);

        res.json(missionProgress);
    } catch (error) {
        next(error);
    }
});

export default user_dashboard_router;