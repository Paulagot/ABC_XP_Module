import React, { useEffect, useRef, useState } from 'react';
import { enableDragDrop } from '../HelperFunctions';

const QuestionsList = ({ 
  questions, 
  onVote, 
  onEdit, 
  onDelete, 
  onSetActive, 
  currentUser, 
  remainingVotes,
  isAdmin
}) => {
  const questionRefs = useRef({});
  const [editingQuestionId, setEditingQuestionId] = useState(null);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    if (onSetActive) {
      questions.forEach(question => {
        const questionEl = questionRefs.current[question.id];
        if (questionEl) {
          enableDragDrop(
            questionEl,
            (e) => {
              e.dataTransfer.setData('questionId', question.id);
              e.target.classList.add('dragging');
            },
            (e) => {
              e.target.classList.remove('dragging');
            }
          );
        }
      });
      
      const activeQuestionArea = document.querySelector('#active-question-area');
      if (activeQuestionArea) {
        activeQuestionArea.addEventListener('dragover', (e) => {
          e.preventDefault();
          e.dataTransfer.dropEffect = 'move';
          activeQuestionArea.classList.add('drop-target-active');
        });
        
        activeQuestionArea.addEventListener('dragleave', () => {
          activeQuestionArea.classList.remove('drop-target-active');
        });
        
        activeQuestionArea.addEventListener('drop', (e) => {
          e.preventDefault();
          activeQuestionArea.classList.remove('drop-target-active');
          const questionId = e.dataTransfer.getData('questionId');
          if (questionId && onSetActive) {
            onSetActive(questionId);
          }
        });
      }
    }
    
    return () => {
      const activeQuestionArea = document.querySelector('#active-question-area');
      if (activeQuestionArea) {
        activeQuestionArea.removeEventListener('dragover', () => {});
        activeQuestionArea.removeEventListener('dragleave', () => {});
        activeQuestionArea.removeEventListener('drop', () => {});
      }
    };
  }, [questions, onSetActive]);
  
  if (!questions || questions.length === 0) {
    return <p className="no-questions">No questions yet. Be the first to ask!</p>;
  }

  const startEditing = (question) => {
    setEditingQuestionId(question.id);
    setEditText(question.text);
  };

  const cancelEditing = () => {
    setEditingQuestionId(null);
    setEditText('');
  };

  const saveEdit = (questionId) => {
    if (editText.trim() && onEdit) {
      onEdit(questionId, editText);
    }
    setEditingQuestionId(null);
    setEditText('');
  };

  return (
    <div className="questions-list">
      {questions.map(question => (
        <div 
          key={question.id} 
          className="question-card"
          ref={el => questionRefs.current[question.id] = el}
          data-question-id={question.id}
        >
          {editingQuestionId === question.id ? (
            <div className="question-edit">
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="edit-input"
                autoFocus
                rows="2" // Adjust as needed for your card height
              />
              <div className="edit-actions">
                <button 
                  className="save-button"
                  onClick={() => saveEdit(question.id)}
                  disabled={!editText.trim()}
                >
                  Save
                </button>
                <button 
                  className="cancel-button"
                  onClick={cancelEditing}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="question-text">{question.text}</div>
          )}

<div className="question-votes">
              <button 
                className="vote-button"
                onClick={() => onVote(question.id)}
                disabled={remainingVotes <= 0}
                title={remainingVotes <= 0 ? "No votes remaining" : "Vote for this question"}
              >
                <span className="vote-icon">↑</span>
                <span>Vote ({question.votes})</span>
              </button>
              
              {onSetActive && (
                <button 
                  className="activate-button"
                  onClick={() => onSetActive(question.id)}
                  title="Set as active question"
                >
                  Discuss
                </button>
              )}
              
              {(onEdit && question.author === currentUser && editingQuestionId !== question.id) && (
                <button 
                  className="activate-button"
                  onClick={() => startEditing(question)}
                  title="Edit your question"
                >
                  Edit
                </button>
              )}
              
              {((onSetActive && onDelete) || (onDelete && question.author === currentUser)) && (
                <button 
                  className="activate-button"
                  onClick={() => onDelete(question.id)}
                  title={onSetActive ? "Delete this question (Admin)" : "Delete your question"}
                >
                  Delete
                </button>
              )}
            </div>
          
          <div className="question-footer">
            <div>
              Asked by {question.author === currentUser ? 'you' : question.author}
              <span className="question-time">
                {' • '}
                {new Date(question.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </span>
            </div>
            
            {onSetActive && (
            <div className="drag-handle" title="Drag to make active">
              ⋮⋮
            </div>
          )}
          </div>
          
        
        </div>
      ))}
    </div>
  );
};

export default QuestionsList;