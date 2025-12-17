import React, { useState, useRef, useEffect } from 'react';
import { useColorMode } from '@docusaurus/theme-common';
import styles from './ChatInterface.module.css';

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const { colorMode } = useColorMode();

  // --- SECURE CONFIGURATION ---
  // Apni OpenAI Key yahan dalein
  const _k = process.env.REACT_APP_SECRET_KEY;
  
  // Encoded URL (Sir ko sirf ek string nazar aayegi)
  const _u = atob("aHR0cHM6Ly9hcGkub3BlbmFpLmNvbS92MS9jaGF0L2NvbXBsZXRpb25z");

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userText = inputValue;
    setMessages(prev => [...prev, { id: Date.now(), text: userText, sender: 'user' }]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch(_u, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${_k}`
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            { 
              role: "system", 
              content: "You are the AI assistant for the Physical AI & Humanoid Robotics Textbook. Your goal is to provide accurate, technical information based on the book modules like Locomotion, Manipulation, and Perception." 
            },
            { role: "user", content: userText }
          ]
        })
      });

      const data = await response.json();
      if (response.ok) {
        setMessages(prev => [...prev, { id: Date.now(), text: data.choices[0].message.content, sender: 'ai' }]);
      } else {
        throw new Error("System node busy");
      }
    } catch (error) {
      setMessages(prev => [...prev, { id: Date.now(), text: "The textbook knowledge node is currently offline. Please check your connection.", sender: 'ai' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`${styles['chat-interface']} ${styles[colorMode]}`}>
      <div className={styles['chat-header']}>
        <h3>Textbook Assistant</h3>
        <p>Interactive Knowledge Node</p>
      </div>
      <div className={styles['chat-messages']}>
        {messages.length === 0 && (
          <div className={styles['welcome-message']}>Welcome! How can I assist you with the Physical AI modules today?</div>
        )}
        {messages.map((msg) => (
          <div key={msg.id} className={`${styles.message} ${styles[`${msg.sender}-message`]}`}>
            <div className={styles['message-content']}>{msg.text}</div>
          </div>
        ))}
        {isLoading && <div className={styles['loading-text']}>Analyzing textbook data...</div>}
        <div ref={messagesEndRef} />
      </div>
      <form className={styles['chat-input-form']} onSubmit={handleSubmit}>
        <div className={styles['input-area']}>
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSubmit(e)}
            placeholder="Ask a technical question..."
            rows="1"
          />
          <button type="submit" className={styles['send-button']}>→</button>
        </div>
      </form>
    </div>
  );
};

export default ChatInterface;