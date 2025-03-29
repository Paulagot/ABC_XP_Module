import React from "react";

const MissionStatus = ({ mission, criteria = [], userBytes = [] }) => {
    // Filter out invalid criteria
    const validCriteria = criteria.filter((criterion) => criterion.criteria_type);

    if (!mission || validCriteria.length === 0) {
        console.warn("[MissionStatus] No valid criteria available for this mission.");
        return <div>No criteria available for this mission.</div>;
    }

    const isCriterionMet = (criterion) => {
      

        if (criterion.criteria_type === "Bite Complete") {
            const hasCompletedBite = userBytes.some(
                (byte) => byte.bite_id === criterion.bite_id && byte.completion_date !== null
            );
            return hasCompletedBite;
        }

        if (criterion.criteria_type === "LP") {
            const userLP = userBytes
                .filter((byte) => byte.subcategory_id === criterion.subcategory_id)
                .reduce((total, byte) => total + (byte.lp_value || 0), 0);
            return userLP >= criterion.lp_value;
        }

        console.warn("[MissionStatus] Unhandled criterion type:", criterion.criteria_type);
        return false;
    };

    return (
        <div className="missions_criteria_container">
            <h3 className="missions_criteria_H">{mission.name}</h3>
            <p className="missions_criteria_H">This mission is locked. Here is what you need to unlock it:</p>
            <ul className="missions_criteria_display">
                {validCriteria.map((criterion) => {
                    const criterionMet = isCriterionMet(criterion);

                    return (
                        <li key={criterion.criteria_id}>
                            {criterion.criteria_type === "Bite Complete" ? (
                                <span>Complete the byte: {criterion.bite_name}</span>
                            ) : (
                                <span>Earn {criterion.lp_value} LP in Subcategory: {criterion.subcategory_name}</span>
                            )}
                            {criterionMet ? (
                                <span style={{ color: "green", marginLeft: "10px" }}>✓</span>
                            ) : (
                                <span style={{ color: "red", marginLeft: "10px" }}>✗</span>
                            )}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default MissionStatus;

