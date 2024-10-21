// LPAccumulation.js
import React from "react";

function LPAccumulation({ lp }) {
    return (
        <div className="lp-accumulation">
            <h3>{lp.subcategoryName}</h3>
            <div className="lp-progress">
                <p>Current LP: {lp.currentLp}</p>
                <progress value={lp.currentLp} max={lp.targetLp} style={{ width: "100%" }}>
                    {Math.round((lp.currentLp / lp.targetLp) * 100)}%
                </progress>
                <p>Target LP: {lp.targetLp}</p>
                <p>{Math.round((lp.currentLp / lp.targetLp) * 100)}% of Target</p>
            </div>
        </div>
    );
}

export default LPAccumulation;
