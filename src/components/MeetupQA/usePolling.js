// usePolling.js - Fixed version
import { useRef, useEffect, useCallback } from 'react';
import { fetchSessionData } from './api';

export function usePolling({
  sessionActive,
  sessionCode,
  isJoined,
  guestName,
  questions,
  participants,
  isAdmin,
  showTimeVote,
  activeQuestion,
  finishedQuestions,
  timer, // Make sure timer is included in the props
  setParticipants,
  setRemainingVotes,
  setTimer,
  setShowTimeVote,
  setTimeVotes,
  setHasVoted,
  setQuestions,
  setActiveQuestion,
  setFinishedQuestions,
  setError,
  setSessionActive,
  clearSessionFromStorage,
  setIsJoined,
  setSessionCode,
  setShowStartModal,
  timeVotes,
  hasVoted,
  replies,
  setReplies
}) {
  const pollIntervalRef = useRef(null);
  const isPollingRef = useRef(false);
  
  // Use useCallback to memoize this function
  const fetchSessionDataQuietly = useCallback(async (forceUpdate = false) => {
    if (!sessionCode || !isJoined || isPollingRef.current) return;
    
    isPollingRef.current = true;
    console.log("Polling: Starting data fetch...");
    
    try {
      console.log(`Polling: fetching session data for ${guestName}`);
      const data = await fetchSessionData(sessionCode, guestName);
      
      // Handle participants updates
      if (data.participants) {
        const newParticipants = data.participants.map(p => ({
          name: p.name,
          votes: p.remaining_votes,
          isAdmin: p.is_admin
        }));
        
        if (forceUpdate || JSON.stringify(newParticipants) !== JSON.stringify(participants)) {
          setParticipants(newParticipants);
          const currentUser = data.participants.find(p => p.name === guestName);
          if (currentUser) setRemainingVotes(currentUser.remaining_votes);
        }
      }

      // Handle timer and time vote updates
      if (data.timerInfo) {
        const serverTimer = data.timerInfo.remainingSeconds;
        console.log(`Polling: server timer=${serverTimer}, current timer=${timer}`);
        setTimer(serverTimer);
        
        const isVoteActive = data.timerInfo.isTimeVoteActive;
        if (isVoteActive !== showTimeVote) {
          console.log(`Polling: changing time vote visibility to ${isVoteActive} for ${guestName}`);
          setShowTimeVote(isVoteActive);
        }
      }
      
      // Handle time vote information
      if (data.timeVoteInfo) {
        const serverVotes = data.timeVoteInfo.votes || { yes: 0, no: 0 };
        const serverHasVoted = data.timeVoteInfo.hasVoted || false;
        
        if (forceUpdate || 
            JSON.stringify(serverVotes) !== JSON.stringify(timeVotes) ||
            serverHasVoted !== hasVoted) {
          setTimeVotes(serverVotes);
          setHasVoted(serverHasVoted);
        }
      }
      
      // Handle questions updates
      if (data.questions) {
        const newQuestions = data.questions.map(q => ({
          id: q.question_id,
          text: q.text,
          author: q.author,
          votes: q.votes || 0,
          voters: [],
          timestamp: new Date(q.created_at)
        }));
        
        if (forceUpdate || JSON.stringify(newQuestions) !== JSON.stringify(questions)) {
          setQuestions(newQuestions);
        }
      }
      
      // Handle active question updates
      const newActiveQuestion = data.activeQuestion ? {
        id: data.activeQuestion.question_id,
        text: data.activeQuestion.text,
        author: data.activeQuestion.author,
        votes: data.activeQuestion.votes || 0,
        voters: [],
        timestamp: new Date(data.activeQuestion.created_at),
        sessionId: data.session.session_id
      } : null;
      
      // Always update active question if it's different
      if (forceUpdate || 
          (newActiveQuestion?.id !== activeQuestion?.id) || 
          (newActiveQuestion === null && activeQuestion !== null)) {
        console.log(`Polling: setting active question for ${guestName}:`, newActiveQuestion?.id || 'none');
        setActiveQuestion(newActiveQuestion);
      }
      
      // Handle finished questions updates
      if (data.finishedQuestions) {
        const newFinishedQuestions = data.finishedQuestions.map(q => ({
          id: q.question_id,
          text: q.text,
          author: q.author,
          votes: q.votes || 0,
          voters: [],
          timestamp: new Date(q.created_at)
        }));
        
        if (forceUpdate || JSON.stringify(newFinishedQuestions) !== JSON.stringify(finishedQuestions)) {
          setFinishedQuestions(newFinishedQuestions);
        }
      }
      
      // Handle replies updates
      if (data.replies) {
        const repliesByQuestion = {};
        for (const reply of data.replies) {
          if (!repliesByQuestion[reply.question_id]) repliesByQuestion[reply.question_id] = [];
          repliesByQuestion[reply.question_id].push({
            reply_id: reply.reply_id,
            author: reply.author,
            text: reply.text,
            created_at: new Date(reply.created_at),
            is_pinned: reply.is_pinned
          });
        }
        
        if (forceUpdate || JSON.stringify(repliesByQuestion) !== JSON.stringify(replies)) {
          setReplies(repliesByQuestion);
        }
      }
      
      setError('');
    } catch (err) {
      console.error("Polling: Error fetching session data:", err);
      if (err.response?.status === 404) {
        clearSessionFromStorage();
        setSessionActive(false);
        setSessionCode('');
        setIsJoined(false);
        if (isAdmin) setShowStartModal(true);
      } else {
        // Only set error for non-network timeout errors to avoid flickering
        if (!err.message?.includes('timeout')) {
          setError('Unable to connect to session. Trying to reconnect...');
        }
      }
    } finally {
      isPollingRef.current = false;
    }
  }, [
    sessionCode, isJoined, guestName, participants, questions, 
    activeQuestion, finishedQuestions, replies, timeVotes, hasVoted,
    showTimeVote, isAdmin, timer, // Make sure timer is included in dependencies
    setParticipants, setRemainingVotes, setTimer, setShowTimeVote,
    setTimeVotes, setHasVoted, setQuestions, setActiveQuestion,
    setFinishedQuestions, setError, setSessionActive,
    clearSessionFromStorage, setIsJoined, setSessionCode, setShowStartModal,
    setReplies
  ]);

  // Set up polling interval
  useEffect(() => {
    if (sessionActive && sessionCode && isJoined) {
      // Initial data fetch
      fetchSessionDataQuietly(true);
      
      // Set up polling interval
      pollIntervalRef.current = setInterval(() => {
        fetchSessionDataQuietly(false);
      }, 5000); // Increase to 2 seconds to reduce server load
      
      return () => {
        if (pollIntervalRef.current) {
          clearInterval(pollIntervalRef.current);
          pollIntervalRef.current = null;
        }
      };
    }
  }, [sessionActive, sessionCode, isJoined, fetchSessionDataQuietly]);

  return { 
    fetchSessionDataQuietly: () => fetchSessionDataQuietly(true) 
  };
}