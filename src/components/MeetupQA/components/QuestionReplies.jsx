import React, { useState } from 'react';
import { timeAgo } from './../HelperFunctions';

const QuestionReplies = ({
  questionId,
  sessionId,
  replies = [], // Array of replies for this question
  currentUser,
  isAdmin,
  onAddReply,
  onPinReply,
  onDeleteReply
}) => {
  const [replyText, setReplyText] = useState('');

  const handleSubmit = () => {
    if (replyText.trim() && replyText.length <= 200) {
      onAddReply( replyText);
      setReplyText('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Sort replies: pinned first, then by created_at descending
  console.log('QuestionReplies received replies:', replies);
  const sortedReplies = [...replies].sort((a, b) => {
    if (a.is_pinned && !b.is_pinned) return -1;
    if (!a.is_pinned && b.is_pinned) return 1;
    return new Date(b.created_at) - new Date(a.created_at);
  });

  return (
    <div className="question-replies">
      <h3>Comments</h3>
      <div className="replies-list">
        {sortedReplies.length === 0 ? (
          <p className="no-replies">No comments yet—add one!</p>
        ) : (
          sortedReplies.map(reply => (
            <div key={reply.reply_id} className="reply-item">
             <span className={reply.is_pinned ? 'pinned-reply' : ''}>
  {!!reply.is_pinned && '★ '}
  {reply.author}: {reply.text}
</span>
              <span className="reply-time">{timeAgo(reply.created_at)}</span>
              {isAdmin && (
                <div className="reply-actions">
                  <button
                  type="button"
                    className="pin-button"
                    onClick={() => onPinReply(reply.reply_id)}
                    title={reply.is_pinned ? "Unpin reply" : "Pin reply"}
                  >
                    {reply.is_pinned ? 'Unpin' : 'Pin'}
                  </button>
                  <button
                  type="button"
                    className="delete-button"
                    onClick={() => onDeleteReply(reply.reply_id)}
                    title="Delete reply"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
      <div className="reply-input-section">
        <textarea
          className="reply-input"
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Add a note… (max 200 chars)"
          maxLength={200}
          rows={2}
        />
        <button
          type="button"
          className="post-button"
          onClick={handleSubmit}
          disabled={!replyText.trim() || replyText.length > 200}
        >
          Post
        </button>
      </div>
    </div>
  );
};

export default QuestionReplies;