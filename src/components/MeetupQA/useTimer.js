// useTimer.js - Fixed version
import { useEffect } from 'react';

export function useTimer({
  timer,
  setTimer,
  sessionId,
  isAdmin,
  showTimeVote,
  setShowTimeVote,
  activeQuestion
}) {
  console.log("useTimer initialized with:", { timer, showTimeVote, activeQuestion: !!activeQuestion });
  // Centralized function to handle timer updates
  const setTimerValue = (value) => {
    console.log(`Timer manually set to: ${value} by ${isAdmin ? 'admin' : 'user'}`);
    setTimer(value);
  };

  // Effect to handle timer countdown
  useEffect(() => {
    // Don't count down if no timer, if time vote is active, or if no active question
    if (timer === null || timer <= 0 || showTimeVote || !activeQuestion) {
      return;
    }

    const interval = setInterval(() => {
      setTimer(prevTimer => {
        // Only decrement if we have an active timer
        if (prevTimer > 0) {
          const newTimerValue = prevTimer - 1;
          console.log(`Timer countdown: ${newTimerValue}`);
          
          // If timer reaches 0, show the time extension vote
          if (newTimerValue === 0) {
            console.log("Timer reached 0, activating time vote");
            setShowTimeVote(true);
          }
          
          return newTimerValue;
        }
        return prevTimer;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timer, showTimeVote, activeQuestion, setShowTimeVote]);

  return {
    setTimerValue
  };
}