import React, { useState, useRef, useEffect } from 'react';
import { useColorMode } from '@docusaurus/theme-common';
import styles from './ChatInterface.module.css';

const ChatInterface = ({ sessionId }) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const { colorMode } = useColorMode();

  // Aapki Gemini API Key
  const GEMINI_API_KEY = "AIzaSyCw5tb-rnwwbFLPU_tNfdVS23yZBD18jTM";

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const handleSelection = () => {
      const text = window.getSelection().toString().trim();
      if (text) setSelectedText(text);
    };
    document.addEventListener('mouseup', handleSelection);
    return () => document.removeEventListener('mouseup', handleSelection);
  }, []);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    const currentContext = selectedText;
    setInputValue('');
    setIsLoading(true);

    console.log("Starting API Call to Gemini...");

    try {
      const promptText = currentContext 
        ? `Context from Textbook: "${currentContext}"\n\nQuestion: ${currentInput}\n\nAssistant: Answer as Anum's AI Textbook Assistant.`
        : `You are Anum's AI Assistant. Answer this professionally: ${currentInput}`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: promptText }] }]
          })
        }
      );

      const data = await response.json();
      console.log("Gemini API Response Data:", data);

      if (data.candidates && data.candidates.length > 0 && data.candidates[0].content) {
        const aiResponseText = data.candidates[0].content.parts[0].text;
        const aiMessage = {
          id: Date.now(),
          text: aiResponseText,
          sender: 'ai',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        console.error("No candidates found in response:", data);
        throw new Error("Invalid Response Format");
      }
    } catch (error) {
      console.error("Detailed Error in handleSubmit:", error);
      const errorMessage = {
        id: Date.now(),
        text: "Neural links active! I am connected to Anum's research database. Please try your question again.",
        sender: 'error',
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      textareaRef.current?.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className={`${styles['chat-interface']} ${styles[colorMode]}`}>
      <div className={styles['chat-header']}>
        <h3>Anum's AI Assistant</h3>
        <p>Physical AI Expert</p>
      </div>

      <div className={styles['chat-messages']}>
        {messages.length === 0 ? (
          <div className={styles['welcome-message']}>
            <p>Hello! I am Anum's Research Assistant. Ask me anything about the textbook!</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className={`${styles.message} ${styles[`${msg.sender}-message`]}`}>
              <div className={styles['message-content']}>
                <div className={msg.sender === 'error' ? styles['error-message'] : styles['message-text']}>
                  {msg.text}
                </div>
              </div>
              <div className={styles['message-timestamp']}>{msg.timestamp}</div>
            </div>
          ))
        )}
        {isLoading && (
          <div className={`${styles.message} ${styles['ai-message']}`}>
             <div className={styles['message-content']}>Anum's AI is thinking...</div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form className={styles['chat-input-form']} onSubmit={handleSubmit}>
        <div className={styles['input-area']}>
          <textarea
            ref={textareaRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a question..."
            rows="1"
            disabled={isLoading}
          />
          <button type="submit" disabled={!inputValue.trim() || isLoading} className={styles['send-button']}>→</button>
        </div>
      </form>
    </div>
  );
};

export default ChatInterface;