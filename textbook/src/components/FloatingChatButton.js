// textbook/src/components/FloatingChatButton.js
import React, { useState } from 'react';
import ChatInterface from './ChatInterface';
import styles from './FloatingChatButton.module.css';

const FloatingChatButton = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Chat window ko open aur close karne ka function
  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <div className={styles['floating-chat-container']}>
      {/* Chat Window: Jab user click karega tabhi open hogi */}
      {isChatOpen && (
        <div className={styles['chat-window']}>
          {/* Header Section: Anum AI Lab ki branding ke saath */}
          <div className={styles['chat-header']}>
            <div className={styles['header-info']}>
              {/* Online indicator dot jo chamakta hai */}
              <span className={styles['online-dot']}></span>
              <h3>Textbook Assistant</h3>
            </div>
            <button 
              className={styles['close-button']} 
              onClick={toggleChat}
              aria-label="Close chat"
            >
              ×
            </button>
          </div>
          
          {/* Chat Body: Is mein aapka main AI Chat logic (ChatInterface) hai */}
          <div className={styles['chat-body']}>
            <ChatInterface />
          </div>
        </div>
      )}

      {/* Main Floating Button: Is mein neon glow aur robot icon hai */}
      <button
        className={`${styles['floating-button']} ${isChatOpen ? styles['open'] : ''}`}
        onClick={toggleChat}
        aria-label={isChatOpen ? "Close chat" : "Open chat"}
      >
        {isChatOpen ? (
          <span className={styles['close-icon']}>×</span>
        ) : (
          /* MODERN AI ROBOT ICON - Wow Factor ke liye */
          <svg 
            width="32" 
            height="32" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className={styles['chat-icon']}
          >
            {/* Robot Head Shape */}
            <path 
              d="M12 2C6.477 2 2 6.477 2 12C2 17.523 6.477 22 12 22C17.523 22 22 17.523 22 12C22 6.477 17.523 2 12 2Z" 
              stroke="white" 
              strokeWidth="1.5"
              strokeOpacity="0.5"
            />
            {/* Robot Eyes aur Face details */}
            <rect x="7" y="10" width="10" height="6" rx="1" stroke="white" strokeWidth="2" />
            <circle cx="10" cy="13" r="1" fill="#2dd4bf" />
            <circle cx="14" cy="13" r="1" fill="#2dd4bf" />
            {/* Antenna with Glow */}
            <path d="M12 10V7" stroke="white" strokeWidth="2" strokeLinecap="round" />
            <circle cx="12" cy="6" r="1.5" fill="#2dd4bf">
               {/* Blinking Animation for the antenna */}
               <animate attributeName="opacity" values="1;0.3;1" dur="1.5s" repeatCount="indefinite" />
            </circle>
          </svg>
        )}
      </button>
    </div>
  );
};

export default FloatingChatButton;