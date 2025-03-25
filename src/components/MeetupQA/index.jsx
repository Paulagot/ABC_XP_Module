import React, { useEffect } from 'react';
import { useAuth } from '../../context/auth_context';
import { useSessionState } from './useSessionState';
import { usePolling } from './usePolling';
import { useTimer } from './useTimer';
import {
  fetchSessionData,
  startSession,
  endSession,
  joinSession,
  addQuestion,
  voteQuestion,
  setActiveQuestion as activateQuestion,
  setTimer as setTimerAPI,
  submitTimeVote,
  endTimeVote,
  finishActiveQuestion,
  deleteQuestion,
  editQuestion,
  addReply,
  pinReply, // Add this
  deleteReply,
  
} from './api';

import JoinForm from './components/JoinForm';
import AdminPanel from './components/AdminPanel';
import QuestionsList from './components/QuestionsList';
import ActiveQuestion from './components/ActiveQuestion';
import FinishedQuestions from './components/FinishedQuestions';
import TimeExtensionVote from './components/TimeExtensionVote';
import StartSessionModal from './components/StartSessionModal';
import AddQuestionForm from './components/AddQuestionForm';
import ParticipantsList from './components/ParticipantsList';
import LoadingState from './components/LoadingState';
import ErrorState from './components/ErrorState';

const MeetupQA = () => {
  const sessionState = useSessionState();
  const { user } = useAuth();
  const {
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
    setReplies,
    generateNewCode,
    saveSessionToStorage,
    clearSessionFromStorage
  } = sessionState;

  const fetchSessionDataFromServer = async (code) => {
    console.log("Fetching session data with code:", code);
    try {
      setIsLoading(true);
      const data = await fetchSessionData(code, guestName);
      console.log("Session data fetched:", data);
      
      setSessionActive(true);
      setSessionId(data.session.session_id);
      
      setParticipants(data.participants.map(p => ({
        name: p.name,
        votes: p.remaining_votes,
        isAdmin: p.is_admin
      })));
      
      setQuestions((data.questions || []).map(question => ({
        id: question.question_id,
        text: question.text,
        author: question.author,
        votes: question.votes || 0,
        voters: [],
        timestamp: new Date(question.created_at)
      })));
      
      setActiveQuestion(data.activeQuestion ? {
        id: data.activeQuestion.question_id,
        text: data.activeQuestion.text,
        author: data.activeQuestion.author,
        votes: data.activeQuestion.votes || 0,
        voters: [],
        timestamp: new Date(data.activeQuestion.created_at),
        sessionId: data.session.session_id // For replies
      } : null);
      
      setFinishedQuestions((data.finishedQuestions || []).map(question => ({
        id: question.question_id,
        text: question.text,
        author: question.author,
        votes: question.votes || 0,
        voters: [],
        timestamp: new Date(question.created_at)
      })));

      console.log('Server response replies:', data.replies);
      const repliesByQuestion = {};
      (data.replies || []).forEach(reply => {
        if (!repliesByQuestion[reply.question_id]) {
          repliesByQuestion[reply.question_id] = [];
        }
        repliesByQuestion[reply.question_id].push({
          reply_id: reply.reply_id,
          author: reply.author,
          text: reply.text,
          created_at: new Date(reply.created_at),
          is_pinned: reply.is_pinned
        });
      });
      console.log('Grouped replies:', repliesByQuestion);
      setReplies(repliesByQuestion);

      const currentUser = data.participants.find(p => p.name === guestName);
      if (currentUser) {
        setRemainingVotes(currentUser.remaining_votes);
      }
      
      if (data.timerInfo) {
        if (data.timerInfo.remainingSeconds !== undefined && data.timerInfo.remainingSeconds > 0) {
          setTimer(data.timerInfo.remainingSeconds);
        }
        setShowTimeVote(data.timerInfo.isTimeVoteActive && data.timerInfo.remainingSeconds === 0);
      }
      
      if (data.timeVoteInfo) {
        setTimeVotes(data.timeVoteInfo.votes);
        setHasVoted(data.timeVoteInfo.hasVoted);
      }
      
      setIsLoading(false);
      setError('');
    } catch (err) {
      console.error("Error fetching session data:", err);
      setError('Failed to load session data. The session may have ended.');
      setIsLoading(false);
      
      if (err.response && err.response.status === 404) {
        clearSessionFromStorage();
        setSessionActive(false);
        setSessionCode('');
        setIsJoined(false);
        if (isAdmin) {
          setShowStartModal(true);
        }
      }
    }
  };

  const polling = usePolling({
    ...sessionState,
    timer,       
    replies,
    setTimer,
    setActiveQuestion,    
    setReplies,
    forceRefresh: () => fetchSessionDataFromServer(sessionCode)
  });
  console.log("MeetupQA activeQuestion state:", activeQuestion);
  console.log("MeetupQA timer state:", timer);
  const handleAddReply = async (questionId, text) => {
    console.log('Adding reply for questionId:', questionId, 'ActiveQuestion ID:', activeQuestion?.id);

    try {
      const response = await addReply(sessionId, questionId, text, guestName);
      setReplies(prev => {
        const newReplies = { ...prev };
        if (!newReplies[questionId]) {
          newReplies[questionId] = [];
        }
        newReplies[questionId] = [
          ...newReplies[questionId],
          {
            reply_id: response.reply.reply_id,
            author: response.reply.author,
            text: response.reply.text,
            created_at: new Date(response.reply.created_at),
            is_pinned: response.reply.is_pinned
          }
        ];
        console.log('Updated replies state:', newReplies);
        return newReplies;
      });
      await polling.fetchSessionDataQuietly(true);
    } catch (err) {
      console.error("Error adding reply:", err);
      setError(err.response?.data?.error || 'Failed to add reply');
    }
  };

  const handlePinReply = async (questionId, replyId) => {
    try {
      const response = await pinReply(sessionId, questionId, replyId);
      setReplies(prev => ({
        ...prev,
        [questionId]: prev[questionId].map(reply =>
          reply.reply_id === replyId ? { ...reply, is_pinned: response.reply.is_pinned } : reply
        ),
      }));
      await polling.fetchSessionDataQuietly(true); // Sync others
    } catch (err) {
      console.error("Error pinning reply:", err);
      setError(err.response?.data?.error || 'Failed to pin reply');
    }
  };
  
  const handleDeleteReply = async (questionId, replyId) => {
    try {
      await deleteReply(sessionId, questionId, replyId);
      setReplies(prev => ({
        ...prev,
        [questionId]: prev[questionId].filter(reply => reply.reply_id !== replyId),
      }));
      await polling.fetchSessionDataQuietly(true); // Sync others
    } catch (err) {
      console.error("Error deleting reply:", err);
      setError(err.response?.data?.error || 'Failed to delete reply');
    }
  };

  const timerManager = useTimer({
    timer,
    activeQuestion,
    isAdmin,
    sessionId,
    showTimeVote,
    setTimer,
    setShowTimeVote,
    hasVoted
  });

  useEffect(() => {
    if (sessionActive && sessionCode && isJoined) {
      fetchSessionDataFromServer(sessionCode);
    }
  }, [sessionActive, sessionCode, isJoined]); // Only run when these change

  const handleStartSession = async () => {
    try {
      const code = generateNewCode();
      // const { user } = window.authContext || {};
     
   

      const adminName = user?.first_name || user?.email || "Admin";
      
      const response = await startSession(code, adminName, user?.id || null);
      
      setSessionCode(code);
      setSessionId(response.session_id);
      setSessionActive(true);
      setShowStartModal(false);
      setGuestName(adminName);
      setIsJoined(true);
      
      saveSessionToStorage(code, adminName, response.session_id, true);
      
      fetchSessionDataFromServer(code);
    } catch (err) {
      console.error("Error starting session:", err);
      setError('Failed to start session. Please try again.');
    }
  };

  const handleEndSession = async () => {
    if (window.confirm("Are you sure you want to end this Q&A session? All questions and votes will be lost.")) {
      try {
        await endSession(sessionId);
        setSessionActive(false);
        setSessionCode('');
        setSessionId(null);
        setQuestions([]);
        setActiveQuestion(null);
        setFinishedQuestions([]);
        setParticipants([]);
        setIsJoined(false);
        clearSessionFromStorage();
        if (isAdmin) {
          setShowStartModal(true);
        }
      } catch (err) {
        console.error("Error ending session:", err);
        setError('Failed to end session. Please try again.');
      }
    }
  };

  const handleJoin = async (name, code) => {
    console.log("Attempting to join with name:", name, "and code:", code);
    try {
      const { session_id } = await joinSession(name, code);
      
      setGuestName(name);
      setSessionCode(code);
      setSessionId(session_id);
      setIsJoined(true);
      setSessionActive(true);
      setError('');
      
      saveSessionToStorage(code, name, session_id);
      
      fetchSessionDataFromServer(code);
      
      return true;
    } catch (err) {
      console.error("Error joining session:", err);
      if (err.response) {
        if (err.response.status === 404) {
          setError('Session not found. Please check the code and try again.');
        } else if (err.response.status === 400) {
          setError('Invalid input. Please check your name and session code.');
        } else {
          setError(`Server error: ${err.response.data?.message || 'Unknown error'}`);
        }
      } else if (err.request) {
        setError('Network error. Please check your connection and try again.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
      return false;
    }
  };

  const handleAddQuestion = async (questionText) => {
    if (!questionText.trim() || !sessionId) return;
    
    try {
      await addQuestion(sessionId, questionText, guestName);
      await polling.fetchSessionDataQuietly(true);
    } catch (err) {
      console.error("Error adding question:", err);
      setError('Failed to add question. Please try again.');
    }
  };

  const handleVoteQuestion = async (questionId) => {
    if (remainingVotes <= 0) {
      setError('You have no votes remaining.');
      return;
    }
    
    try {
      const response = await voteQuestion(questionId, guestName);
      setRemainingVotes(prev => prev - 1);
      setQuestions(prev => 
        prev.map(q => 
          q.id === questionId ? { ...q, votes: response.votes } : q
        )
      );
      await polling.fetchSessionDataQuietly(true);
      setError('');
    } catch (err) {
      console.error("Error voting for question:", err);
      if (err.response) {
        if (err.response.status === 400) {
          setError('No votes remaining or you already voted for this question.');
        } else {
          setError(`Error: ${err.response.data?.error || 'Failed to vote'}`);
        }
      } else {
        setError('Failed to vote. Please check your connection and try again.');
      }
    }
  };

 // Handler for setting active question - key fixes
const handleSetActive = async (questionId) => {
  try {
    await activateQuestion(questionId);
    
    // Update local state immediately for better UX
    const questionToActivate = questions.find(q => q.id === questionId);
    if (questionToActivate) {
      setActiveQuestion({
        ...questionToActivate,
        sessionId,
        status: 'active'
      });
      
      // Remove from pending questions list
      setQuestions(prev => prev.filter(q => q.id !== questionId));
    }
    
    // Reset timer and time vote state
    setTimer(null); // null indicates "setting time"
    setShowTimeVote(false);
    setTimeVotes({ yes: 0, no: 0 });
    setHasVoted(false);
    
    // Force refresh to ensure all clients are in sync
    await polling.fetchSessionDataQuietly(true);
  } catch (err) {
    console.error("Error setting active question:", err);
    setError('Failed to set active question.');
  }
};

// Handler for setting timer - key fixes
const handleSetTimer = async (minutes) => {
  try {
    const seconds = minutes * 60;
    await setTimerAPI(sessionId, minutes);
    
    // Update local state immediately for better UX
    setTimer(seconds);
    // Ensure time vote is hidden when setting a new timer
    setShowTimeVote(false);
    
    // Make sure server and all clients are in sync
    await polling.fetchSessionDataQuietly(true);
  } catch (err) {
    console.error("Error setting timer:", err);
    setError('Failed to set timer.');
  }
};

// Handler for time vote - key fixes
const handleTimeVote = async (vote) => {
  if (vote === 'close') {
    console.log("Closing modal for user", guestName);
    setShowTimeVote(false);
    return;
  }
  
  if (hasVoted) return;

  try {
    const data = await submitTimeVote(sessionId, guestName, vote);
    console.log("Vote submitted for", guestName, ":", data);
    setTimeVotes(data.votes);
    setHasVoted(true);
    
    // Add this: Close the modal after voting with a short delay
    if (!isAdmin) {
      setTimeout(() => {
        console.log("Auto-closing modal for user after voting");
        setShowTimeVote(false);
      }, 3000); // Close after 3 seconds
    }
  } catch (err) {
    console.error("Error submitting vote:", err);
    setError("Failed to submit vote.");
  }
};

// Handler for resolving time vote - key fixes
const handleResolveTimeVote = async (addMoreTime) => {
  try {
    console.log("Admin resolving vote, addMoreTime:", addMoreTime);
    await endTimeVote(sessionId);
    setShowTimeVote(false);
    setTimeVotes({ yes: 0, no: 0 });
    setHasVoted(false);

    if (!addMoreTime) {
      // Move to next question - mark current as finished
      await finishActiveQuestion(sessionId);
      // Immediately update local state for better user experience
      if (activeQuestion) {
        // Move active question to finished questions
        setFinishedQuestions(prev => [
          { ...activeQuestion, status: 'finished' },
          ...prev
        ]);
        setActiveQuestion(null);
      }
      setTimer(null);
    } else {
      // Continue with current question
      // Just reset the timer state to null to indicate "setting time"
      setTimer(null);
    }
       // Force refresh data from server to ensure all clients are in sync
       await polling.fetchSessionDataQuietly(true);
      } catch (err) {
        console.error("Error resolving time vote:", err);
        setError('Failed to resolve vote.');
      }
    };

  const handleDeleteQuestion = async (questionId) => {
    const question = questions.find(q => q.id === questionId);
    if (!question) return;
    if (!isAdmin && question.author !== guestName) {
      setError('You can only delete your own questions.');
      return;
    }
    if (window.confirm("Are you sure you want to delete this question?")) {
      try {
        await deleteQuestion(sessionId, questionId, guestName);
        setQuestions(prev => prev.filter(q => q.id !== questionId));
        if (activeQuestion && activeQuestion.id === questionId) {
          setActiveQuestion(null);
          setTimer(null);
          timerManager.setPrevTimerValue(0);
        }
        setError('');
        await polling.fetchSessionDataQuietly(true);
      } catch (err) {
        console.error("Error deleting question:", err);
        setError(err.response?.data?.error || 'Failed to delete question. Please try again.');
      }
    }
  };

  const handleEditQuestion = async (questionId, newText) => {
    const question = questions.find(q => q.id === questionId);
    if (!question || question.author !== guestName) {
      setError('You can only edit your own questions.');
      return;
    }
    if (newText && newText.trim() && newText !== question.text) {
      try {
        const response = await editQuestion(sessionId, questionId, newText, guestName);
        setQuestions(prev => 
          prev.map(q => 
            q.id === questionId ? { ...q, text: response.question.text } : q
          )
        );
        setError('');
        await polling.fetchSessionDataQuietly(true);
      } catch (err) {
        console.error("Error editing question:", err);
        setError(err.response?.data?.error || 'Failed to edit question. Please try again.');
      }
    }
  };

  if (isLoading) {
    console.log("Showing loading state");
    return <LoadingState />;
  }

  if (isAdmin && showStartModal) {
    console.log("Showing start modal for admin");
    return <StartSessionModal onStart={handleStartSession} />;
  }

  if (!isJoined) {
    console.log("Showing join form - user not joined");
    return <JoinForm onJoin={handleJoin} />;
  }

  if (error && !sessionActive) {
    console.log("Showing error state:", error);
    return (
      <ErrorState 
        error={error} 
        isAdmin={isAdmin}
        onStartNewSession={() => setShowStartModal(true)}
      />
    );
  }

  console.log("User is joined to session, showing main interface");
  const sortedQuestions = [...questions].sort((a, b) => b.votes - a.votes);
  console.log("Rendering QuestionsList - isAdmin:", isAdmin, "onDelete:", !!handleDeleteQuestion);
  console.log("ActiveQuestion props - timer:", timer, "question:", questions, "showTimeVote:", showTimeVote);
 
  return (
    <main className="container__right" id="main">
      <div className="meetup-qa-container">
        {error && <div className="error-message">{error}</div>}
        
        {isAdmin && (
          <AdminPanel 
            sessionCode={sessionCode}
            onSetTimer={handleSetTimer}
            timer={timer}
            participants={participants}
            onEndSession={handleEndSession}
          />
        )}

        <ParticipantsList participants={participants} />
        <div className="meetup-qa-questions">
          <AddQuestionForm onAddQuestion={handleAddQuestion} />
        </div>
        
        <div className="meetup-qa-main">
          <div className="meetup-qa-unanswered">
            <h2 className="meetup-qa-unanswered-header">Questions ({sortedQuestions.length})</h2>
            <QuestionsList 
              questions={sortedQuestions}
              onVote={handleVoteQuestion}
              onEdit={handleEditQuestion}
              onDelete={handleDeleteQuestion}
              onSetActive={isAdmin ? handleSetActive : null}
              currentUser={guestName}
              remainingVotes={remainingVotes}
              isAdmin={isAdmin}
            />
            <div className="meetup-qa-finished">
              <h2 className="meetup-qa-finished-header">Answered Questions ({finishedQuestions.length})</h2>
              <FinishedQuestions questions={finishedQuestions} replies={replies} />
            </div>
          </div>
          
          <div className="meetup-qa-active" id="active-question-area">
          <ActiveQuestion 
  question={activeQuestion}
  timer={timer}
  replies={replies[activeQuestion?.id] || []}
  currentUser={guestName}
  isAdmin={isAdmin}
  onAddReply={handleAddReply}
  onPinReply={(replyId) => handlePinReply(activeQuestion?.id, replyId)}
  onDeleteReply={(replyId) => handleDeleteReply(activeQuestion?.id, replyId)}
  showTimeVote={showTimeVote} // Add this prop
/>
            {showTimeVote && (
              <TimeExtensionVote 
                onVote={handleTimeVote}
                onResolve={isAdmin ? handleResolveTimeVote : null}
                votes={timeVotes}
                totalParticipants={participants.length}
                hasVoted={hasVoted}
              />
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default MeetupQA;