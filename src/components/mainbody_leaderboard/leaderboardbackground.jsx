import React, { useEffect, useState } from "react";
import "./LeaderBoardBackground.css"
import rocket from "../../assets/rocket.svg";
import eud from "../../assets/eud.svg";
import award from "../../assets/award.svg";
import award2 from "../../assets/award2.svg";
import wallet from "../../assets/wallet.svg";
import lightening from '../../assets/lightening.svg';
import btc from '../../assets/btc.svg'
import learning from '../../assets/learning.svg'
import medal from '../../assets/medal.svg'
import crown from '../../assets/crown.svg'

const TOTAL_ICONS = 100; // Total number of floating icons
const iconSVGs = [lightening, eud, award, rocket, wallet, btc, award2, learning, medal, crown  ];

function LeaderboardBackground() {
    const renderIcons = () => {
        return Array.from({ length: TOTAL_ICONS }).map((_, index) => {
            // Randomize initial position and size
            const size = Math.random() * 40 + 20; // Size between 20 and 60px
            const posX = Math.random() * 180; // Random position from 0% to 100% horizontally
            const posY = Math.random() * 180; // Random position from 0% to 100% vertically
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