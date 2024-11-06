import React, { useEffect, useState } from "react";
import "./LeaderBoardBackground.css"
import circle from '../../assets/card_icons/circle.svg'
import circle2 from '../../assets/card_icons/circle2.svg'
import circle3 from '../../assets/card_icons/circle3.svg'
import circle4 from '../../assets/card_icons/circle4.svg'

import hex from '../../assets/card_icons/hex.svg'
import hex2 from '../../assets/card_icons/hex2.svg'
import hex3 from '../../assets/card_icons/hex3.svg'
import hex4 from '../../assets/card_icons/hex4.svg'

import square from '../../assets/card_icons/square.svg'
import square2 from '../../assets/card_icons/square2.svg'
import square3 from '../../assets/card_icons/square3.svg'
import square4 from '../../assets/card_icons/square4.svg'

import triangle from '../../assets/card_icons/triangle.svg'
import triangle2 from '../../assets/card_icons/triangle2.svg'
import triangle3 from '../../assets/card_icons/triangle3.svg'
import triangle4 from '../../assets/card_icons/triangle4.svg'
import triangle5 from '../../assets/card_icons/triangle5.svg'

const TOTAL_ICONS = 150; // Total number of floating icons
const iconSVGs = [circle, circle2, circle3, circle4, hex, hex2, hex3, hex4, square, square2, square3, square4, triangle, triangle2, triangle3, triangle4, triangle5  ];

function LeaderboardBackground() {
    const renderIcons = () => {
        return Array.from({ length: TOTAL_ICONS }).map((_, index) => {
            // Randomize initial position and size
            const size = Math.random() * 40 + 80; // Size between 20 and 60px
            const posX = Math.random() * 160; // Random position from 0% to 100% horizontally
            const posY = Math.random() * 120; // Random position from 0% to 100% vertically
            const animationDuration = Math.random() * 20 + 5; // Random duration between 5 and 25 seconds

            return (
                <img
                    key={index}
                    src={iconSVGs[index % iconSVGs.length]}
                    alt="floating icon"
                    className="floating-icon"
                    style={{
                        width: `${size}px`,
                        height: `${size}px`,
                        left: `${posX}%`,
                        top: `${posY}%`,
                        animationDuration: `${animationDuration}s`, // Random duration for each icon
                    }}
                />
            );
        });
    };

    return (
        <div className="leaderboard-background">
            <div className="icon-container">{renderIcons()}</div>
        </div>
    );
}

export default LeaderboardBackground;