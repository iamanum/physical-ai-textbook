// D:\phyical-ai-textbook\docs\src\components\RAGChatbot\index.tsx
import React, { useState, useEffect } from 'react';
import styles from './styles.module.css';

// Comment: Yeh URL humara local FastAPI server hai. Deployment par yeh badal jayega.
const API_URL = 'http://127.0.0.1:8000';

interface Message {
  text: string;
  isUser: boolean;
  source?: string;
  contextUsed?: string;
}

export default function RAGChatbot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedText, setSelectedText] = useState('');

  // Comment: User ke selected text ko track karna
  useEffect(() => {
    const handleSelection = () => {
      const selection = window.getSelection()?.toString();
      setSelectedText(selection || '');
    };
    document.addEventListener('mouseup', handleSelection);
    return () => document.removeEventListener('mouseup', handleSelection);
  }, []);

  // Comment: API call function
  const handleSubmit = async (overrideContext: boolean = false) => {
    if (!input.trim() && !overrideContext) return;

    const userMessage: Message = { text: input, isUser: true };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    let context_override = overrideContext && selectedText ? selectedText : undefined;
    
    // Request data
    const requestBody = {
      query: input,
      context_override: context_override,
    };

    try {
      const response = await fetch(`${API_URL}/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch RAG response.');
      }

      const data = await response.json();

      const botMessage: Message = {
        text: data.answer,
        isUser: false,
        source: data.source,
        contextUsed: data.context_used,
      };

      setMessages((prev) => [...prev, botMessage]);
      setInput('');
    } catch (error) {
      console.error(error);
      const errorMessage: Message = {
        text: `Error: Could not connect to RAG server. (API Key or Server down).`,
        isUser: false,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  // Comment: RAG Chat UI
  return (
    <div className={styles.chatContainer}>
      <div className={styles.chatHeader}>Physical AI Assistant (RAG)</div>
      
      {/* Messages Window */}
      <div className={styles.messagesWindow}>
        {messages.map((msg, index) => (
          <div key={index} className={msg.isUser ? styles.userMessage : styles.botMessage}>
            <p>{msg.text}</p>
            {!msg.isUser && msg.source && (
                <small className={styles.sourceText}>Source: {msg.source}</small>
            )}
            {/* Context/Source ko yahan display kar sakte hain (Expert Tip: Acha UI ke liye isko minimize rakhein) */}
          </div>
        ))}
        {loading && <div className={styles.botMessage}><p>Thinking...</p></div>}
      </div>

      {/* Input Section */}
      <div className={styles.inputArea}>
        {selectedText && (
          <button 
            className={styles.contextButton}
            onClick={() => handleSubmit(true)}
            disabled={loading || !input.trim()}
            title={`Ask about the selected text: "${selectedText.substring(0, 30)}..."`}
          >
            Ask ONLY about Selected Text
          </button>
        )}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          placeholder="Ask a question about the textbook content..."
          disabled={loading}
        />
        <button onClick={() => handleSubmit()} disabled={loading || !input.trim()}>
          Send
        </button>
      </div>
    </div>
  );
}