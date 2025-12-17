import React, { useState, useRef, useEffect } from 'react';
import { useColorMode } from '@docusaurus/theme-common';
import styles from './ChatInterface.module.css';
import { sendQuery } from '../utils/api';

// Define the ChatInterface component
const ChatInterface = ({ sessionId }) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const { colorMode } = useColorMode();

  // Focus input box when component mounts and after each message
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  // Scroll to bottom of messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Get selected text when user selects text on the page
  useEffect(() => {
    const handleSelection = () => {
      const selectedText = window.getSelection().toString().trim();
      if (selectedText) {
        setSelectedText(selectedText);
      }
    };

    document.addEventListener('mouseup', handleSelection);
    return () => {
      document.removeEventListener('mouseup', handleSelection);
    };
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    // Add user message to the chat
    const userMessage = {
      id: Date.now(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Prepare context with selected text if available
      const queryWithContext = selectedText
        ? `Context: ${selectedText}\n\nQuestion: ${inputValue}`
        : inputValue;

      // Call the backend API
      const data = await sendQuery(queryWithContext);

      // Add AI response to the chat
      const aiMessage = {
        id: Date.now(),
        text: data.response,
        sender: 'ai',
        sources: data.sources || [],
        confidence: null,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);

      // Add error message to the chat
      const errorMessage = {
        id: Date.now(),
        text: 'Server is busy. Please try again later.',
        sender: 'error',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      // Focus input box after message is sent (either success or error)
      textareaRef.current?.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Render message with proper formatting
  const renderMessage = (message) => {
    if (message.sender === 'ai') {
      return (
        <div className={styles['ai-message-content']}>
          <div className={styles['ai-answer']}>{message.text}</div>

          {message.sources && message.sources.length > 0 && (
            <div className={styles['sources-section']}>
              <strong>Sources:</strong>
              <ul className={styles['sources-list']}>
                {message.sources.map((source, idx) => (
                  <li key={idx}>
                    <span>{source}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      );
    } else if (message.sender === 'error') {
      return (
        <div className={styles['error-message']}>
          {message.text}
        </div>
      );
    } else {
      return <div className={styles['user-message-content']}>{message.text}</div>;
    }
  };

  return (
    <div className={`${styles['chat-interface']} ${styles[colorMode]}`}>
      <div className={styles['chat-header']}>
        <h3>Textbook Assistant</h3>
        <p>Ask questions about the Physical AI & Humanoid Robotics content</p>
      </div>

      <div className={styles['chat-messages']}>
        {messages.length === 0 ? (
          <div className={styles['welcome-message']}>
            <p>Hello! I am your textbook assistant. Ask me anything about the Physical AI & Humanoid Robotics content.</p>
            {selectedText && (
              <p className={styles['selected-text-notice']}>
                I noticed you selected: <em>"{selectedText.substring(0, 60)}{selectedText.length > 60 ? '...' : ''}"</em>
              </p>
            )}
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`${styles['message']} ${styles[`${message.sender}-message`]}`}
            >
              <div className={styles['message-content']}>
                {renderMessage(message)}
              </div>
              <div className={styles['message-timestamp']}>{message.timestamp}</div>
            </div>
          ))
        )}
        {isLoading && (
          <div className={`${styles['message']} ${styles['ai-message']}`}>
            <div className={styles['message-content']}>
              <div className={styles['ai-message-content']}>
                Thinking...
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form className={styles['chat-input-form']} onSubmit={handleSubmit}>
        {selectedText && (
          <div className={styles['selected-text-preview']}>
            <small>Context: "{selectedText.substring(0, 80)}{selectedText.length > 80 ? '...' : ''}"</small>
          </div>
        )}

        <div className={styles['input-area']}>
          <textarea
            ref={textareaRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a question about the textbook content..."
            rows="1"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className={styles['send-button']}
          >
            {isLoading ? '→' : '→'}
          </button>
        </div>
        
      </form>
    </div>
  );
};

export default ChatInterface;