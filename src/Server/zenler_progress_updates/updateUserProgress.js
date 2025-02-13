import pool from '../config_db.js';

/**
 * Update user progress and stats tables (user_bytes/user_missions and their stats) with Zenler progress data.
 * @param {number} userId - The user's ID.
 * @param {string} entityId - The ID of the byte or mission (bite_id or mission_id).
 * @param {Object} progress - The progress data from Zenler API.
 * @param {string} type - The type of entity ("byte" or "mission").
 */
export const updateUserProgress = async (userId, entityId, progress, type) => {
    const { enrollment_date, start_date, completed_date, completion_percentage } = progress;

    const enrolDate = new Date(enrollment_date);
    const startDate = start_date !== '-' ? new Date(start_date) : enrolDate;
    const completionDate = completed_date !== '-' ? new Date(completed_date) : null;

    // Determine table and column names based on the type
    const mainTable = type === "mission" ? "user_missions" : "user_bytes";
    const statsTable = type === "mission" ? "user_missions_stats" : "user_bytes_stats";
    const columnId = type === "mission" ? "mission_id" : "bite_id";

    // Update main progress table
    const updateMainTable = new Promise((resolve, reject) => {
        const query = `
            INSERT INTO ${mainTable} (user_id, ${columnId}, enrol_date, start_date, completion_date, course_progress, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())
            ON DUPLICATE KEY UPDATE
                start_date = VALUES(start_date),
                completion_date = VALUES(completion_date),
                course_progress = VALUES(course_progress),
                updated_at = NOW()
        `;

        pool.query(query, [userId, entityId, enrolDate, startDate, completionDate, completion_percentage], (err) => {
            if (err) {
                console.error(`[updateUserProgress] Error updating ${mainTable} for userId: ${userId}, ${columnId}: ${entityId}`, err);
                return reject(err);
            }
            resolve();
        });
    });

    // Update stats table only if completion date is present
    const updateStatsTable = new Promise((resolve, reject) => {
        if (!completionDate) {
         
            return resolve();
        }

        // Determine the fields to fetch and update
        const statsFields = type === "mission"
            ? ["subcategory_id", "chain_id", "xp AS experience_points"]
            : ["category_id", "subcategory_id", "points AS learning_points"];

        const mainTable = type === "mission" ? "missions" : "bites";

        const selectQuery = `
            SELECT ${statsFields.join(", ")} 
            FROM ${mainTable} 
            WHERE ${columnId} = ?
        `;

        // Fetch fields from main table
        pool.query(selectQuery, [entityId], (selectErr, results) => {
            if (selectErr) {
                console.error(`[updateUserProgress] Error fetching fields for stats table from ${mainTable}:`, selectErr);
                return reject(selectErr);
            }

            if (results.length === 0) {
                console.warn(`[updateUserProgress] No matching ${columnId} found in ${mainTable}. Skipping stats update.`);
                return resolve();
            }

            // Prepare values for the stats table update
            const fields = results[0];
            const { category_id, subcategory_id, chain_id, learning_points, experience_points } = fields;
            const statsValues = type === "mission"
                ? [subcategory_id, chain_id, experience_points]
                : [category_id, subcategory_id, learning_points];

            // Insert into stats table
            const insertQuery = `
                INSERT INTO ${statsTable} 
                    (user_id, ${columnId}, ${statsFields.map(f => f.split(" AS ")[1] || f).join(", ")}, created_at, updated_at)
                VALUES (?, ?, ${statsFields.map(() => "?").join(", ")}, NOW(), NOW())
                ON DUPLICATE KEY UPDATE
                    ${statsFields.map(f => {
                        const field = f.split(" AS ")[1] || f;
                        return `${field} = VALUES(${field})`;
                    }).join(", ")},
                    updated_at = NOW()
            `;

            pool.query(insertQuery, [userId, entityId, ...statsValues], (insertErr) => {
                if (insertErr) {
                    console.error(`[updateUserProgress] Error updating ${statsTable} for userId: ${userId}, ${columnId}: ${entityId}`, insertErr);
                    return reject(insertErr);
                }

               
                resolve();
            });
        });
    });

    // Execute updates
    try {
        await Promise.all([updateMainTable, updateStatsTable]);
       
    } catch (err) {
        console.error(`[updateUserProgress] Error updating ${type} progress and stats for userId: ${userId}, ${columnId}: ${entityId}`, err);
        throw err;
    }
};

