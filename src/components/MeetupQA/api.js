// api.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchSessionData = async (code, participantName) => {
  console.log('Fetching session data from server with code:', code, 'and participantName:', participantName);
  try {
    const response = await axios.get(`${API_BASE_URL}/api/meetupQA/code/${code}`, {
      params: { participant_name: participantName }
    });
    console.log('Server response in fetchSessionData:', response.data);
    return response.data;
  } catch (err) {
    console.error('Error in fetchSessionData:', err.message);
    if (err.response) {
      console.error('Response error details:', err.response.data);
    } else if (err.request) {
      console.error('No response received:', err.request);
    }
    throw err;
  }
};

export const startSession = async (code, adminName, adminId) => {
  const response = await axios.post(`${API_BASE_URL}/api/meetupQA`, {
    session_code: code,
    created_by: adminName,
    admin_id: adminId
  });
  console.log('Server response in startSession:', response.data);
  return response.data;
  
};

export const endSession = async (sessionId) => {
  await axios.put(`${API_BASE_URL}/api/meetupQA/${sessionId}/end`);
};

export const joinSession = async (name, code) => {
  // First check if session exists
  const response = await axios.get(`${API_BASE_URL}/api/meetupQA/code/${code}`);
  const sessionId = response.data.session.session_id;
  
  // Add participant
  await axios.post(`${API_BASE_URL}/api/meetupQA/${sessionId}/participants`, { name });
  
  return { session_id: sessionId };
};

export const addQuestion = async (sessionId, questionText, authorName) => {
  await axios.post(`${API_BASE_URL}/api/meetupQA/${sessionId}/questions`, {
    text: questionText,
    author: authorName
  });
};

export const voteQuestion = async (questionId, participantName) => {
  const response = await axios.post(`${API_BASE_URL}/api/questions/${questionId}/vote`, {
    participant_name: participantName
  });
  return response.data;
};

export const setActiveQuestion = async (questionId) => {
  await axios.put(`${API_BASE_URL}/api/questions/${questionId}/activate`);
};

export const setTimer = async (sessionId, minutes) => {
  await axios.post(`${API_BASE_URL}/api/meetupQA/${sessionId}/timer`, { minutes });
};

export const startTimeVote = async (sessionId) => {
  await axios.post(`${API_BASE_URL}/api/meetupQA/${sessionId}/time-vote/start`);
};

export const submitTimeVote = async (sessionId, participantName, vote) => {
  const response = await axios.post(`${API_BASE_URL}/api/meetupQA/${sessionId}/time-vote`, {
    participant_name: participantName,
    vote
  });
  return response.data;
};


export const endTimeVote = async (sessionId) => {
  await axios.post(`${API_BASE_URL}/api/meetupQA/${sessionId}/time-vote/end`);
};

export const finishActiveQuestion = async (sessionId) => {
  const response = await axios.put(`${API_BASE_URL}/api/meetupQA/${sessionId}/finish-active`);
  console.log("finishActiveQuestion response:", response.data);
  return response.data;
};

export const deleteQuestion = async (sessionId, questionId, participantName) => {
  await axios.delete(`${API_BASE_URL}/api/meetupQA/${sessionId}/questions/${questionId}`, {
    params: { participant_name: participantName }
  });
};

export const editQuestion = async (sessionId, questionId, newText, participantName) => {
  const response = await axios.put(`${API_BASE_URL}/api/meetupQA/${sessionId}/questions/${questionId}`, {
    text: newText,
    participant_name: participantName
  });
  return response.data;
};

// NEW: Add reply function
export const addReply = async (sessionId, questionId, text, author) => {
  const response = await axios.post(`${API_BASE_URL}/api/meetupQA/${sessionId}/questions/${questionId}/replies`, {
    text,
    author
  });
  return response.data;
};

// Pin/Unpin a reply
export const pinReply = async (sessionId, questionId, replyId) => {
  const response = await axios.put(`${API_BASE_URL}/api/meetupQA/${sessionId}/questions/${questionId}/replies/${replyId}/pin`);
  return response.data;
};

// Delete a reply
export const deleteReply = async (sessionId, questionId, replyId) => {
  const response = await axios.delete(`${API_BASE_URL}/api/meetupQA/${sessionId}/questions/${questionId}/replies/${replyId}`);
  return response.data;
};
