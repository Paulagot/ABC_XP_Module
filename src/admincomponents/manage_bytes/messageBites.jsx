import React from 'react';

const Message = ({ message }) => {
  return message ? <p>{message}</p> : null;
};

export default Message;
