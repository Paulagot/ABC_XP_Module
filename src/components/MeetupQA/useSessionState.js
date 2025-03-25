// useSessionState.js
import { useState, useEffect } from 'react';
import { useAuth } from "../../context/auth_context";
import { generateSessionCode } from './HelperFunctions';

export function useSessionState() {
  const { user, isAuthenticated } = useAuth();
  
  // Session state
  const [sessionActive, setSessionActive] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [sessionCode, setSessionCode] = useState('');
  const [isJoined, setIsJoined] = useState(false);
  const [guestName, setGuestName] = useState('');
  
  // Questions state
  const [questions, setQuestions] = useState([]);
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [finishedQuestions, setFinishedQuestions] = useState([]);
  
  // Participants and votes
  const [remainingVotes, setRemainingVotes] = useState(5);
  const [participants, setParticipants] = useState([]);
  
  // Timer and voting state
  const [timer, setTimer] = useState(null);
  const [showTimeVote, setShowTimeVote] = useState(false);
  const [timeVotes, setTimeVotes] = useState({ yes: 0, no: 0 });
  const [hasVoted, setHasVoted] = useState(false);
  
  // UI state
  const [showStartModal, setShowStartModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Replies state
  const [replies, setReplies] = useState({}); // NEW: Object keyed by questionId
  
  // Check if user is admin
  const isAdmin = user?.role === 'admin';
  
  // Load session from localStorage on mount
  useEffect(() => {
    const sessionData = localStorage.getItem('meetup_qa_session');
    
    if (sessionData) {
      try {
        const { code, name, id } = JSON.parse(sessionData);
        setSessionCode(code);
        setSessionId(id);
        setGuestName(name);
        setIsJoined(true);
        setSessionActive(true);
      } catch (err) {
        console.error("Error parsing stored session data:", err);
        localStorage.removeItem('meetup_qa_session');
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
      if (isAdmin && isAuthenticated) {
        setShowStartModal(true);
      }
    }
  }, [isAdmin, isAuthenticated]);
  
  // Generate new session code for admin
  const generateNewCode = () => {
    return generateSessionCode();
  };
  
  // Save session to localStorage
  const saveSessionToStorage = (code, name, id, admin = false) => {
    localStorage.setItem('meetup_qa_session', JSON.stringify({
      code,
      name,
      id,
      isAdmin: admin
    }));
  };
  
  // Clear session from localStorage
  const clearSessionFromStorage = () => {
    localStorage.removeItem('meetup_qa_session');
  };
  
  return {
    sessionActive,
    sessionId,
    sessionCode,
    isJoined,
    guestName,
    questions,
    activeQuestion,
    finishedQuestions,
    remainingVotes,
    participants,
    timer,
    showTimeVote,
    timeVotes,
    hasVoted,
    showStartModal,
    isLoading,
    error,
    isAdmin,
    replies, 
    
    setSessionActive,
    setSessionId,
    setSessionCode,
    setIsJoined,
    setGuestName,
    setQuestions,
    setActiveQuestion,
    setFinishedQuestions,
    setRemainingVotes,
    setParticipants,
    setTimer,
    setShowTimeVote,
    setTimeVotes,
    setHasVoted,
    setShowStartModal,
    setIsLoading,
    setError,
    setReplies, // NEW
    generateNewCode,
    saveSessionToStorage,
    clearSessionFromStorage
  };
}