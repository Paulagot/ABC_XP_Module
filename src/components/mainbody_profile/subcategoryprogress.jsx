// SubcategoryProgress.js
import React from "react";

function SubcategoryProgress({ subcategory }) {
    return (
        <div className="subcategory-progress">
            <h3>{subcategory.name}</h3>
            {subcategory.levels.map((level) => (
                <div key={level.name} className="level-progress">
                    <p>{level.name}:</p>
                    <progress
                        value={level.completedBytes}
                        max={level.totalBytes}
                        style={{ width: "100%" }}
                    >
                        {Math.round((level.completedBytes / level.totalBytes) * 100)}%
                    </progress>
                    <p>{Math.round((level.completedBytes / level.totalBytes) * 100)}% Completed</p>
                </div>
            ))}
        </div>
    );
}

export default SubcategoryProgress;
