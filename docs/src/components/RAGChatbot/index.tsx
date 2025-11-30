// D:\phyical-ai-textbook\docs\src\components\RAGChatbot\index.tsx
import React, { useState, useEffect, Dispatch, SetStateAction } from 'react'; // Dispatch and SetStateAction added
import styles from './styles.module.css';
import AuthForm from './AuthForm'; // AuthForm component import karein

const API_URL = 'http://127.0.0.1:8000'; // Deployment par yeh URL badal jayega!

// --- INTERFACES DEFINITIONS (Error Fix) ---
interface Message {
  text: string;
  isUser: boolean;
  source?: string;
  contextUsed?: string;
}

export interface User { // Exported User interface
    username: string;
    software_background: string;
    hardware_background: string;
    is_authenticated: boolean;
}
// --- END INTERFACES DEFINITIONS ---

export default function RAGChatbot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [user, setUser] = useState<User | null>(null); // User state
  const [isTranslated, setIsTranslated] = useState(false); // Translation State
  
  // --- Initialization and Selection Handlers ---
  useEffect(() => {
    // Session storage se user data load karein
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        setUser(JSON.parse(savedUser) as User); 
    }
    
    // Selected text ko track karna (Bonus Feature 1)
    const handleSelection = () => {
      const selection = window.getSelection()?.toString();
      setSelectedText(selection || '');
    };
    document.addEventListener('mouseup', handleSelection);
    return () => document.removeEventListener('mouseup', handleSelection);
  }, []);

  // --- RAG LOGIC (CORE) ---
  const handleSubmit = async (overrideContext: boolean = false) => {
    if (!input.trim() && !overrideContext) return;

    const userMessage: Message = { text: input, isUser: true };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    const context_override: string | undefined = overrideContext && selectedText ? selectedText : undefined;
    
    // Request body mein username bhejein (Personalization ke liye)
    const requestBody = {
      query: input,
      context_override: context_override,
      username: user?.username || undefined, // Personalization ke liye username
    };

    try {
      const response = await fetch(`${API_URL}/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'RAG service failed to respond.');
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
    } catch (error: any) {
      console.error("RAG ERROR:", error);
      const errorMessage: Message = {
        text: `Error: ${error.message || 'Could not connect to RAG server. (API Key or Server down)'}`,
        isUser: false,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };
  
  // --- PERSONALIZATION LOGIC (Bonus +50) ---
  const handlePersonalize = () => {
    alert(`Content will be personalized for ${user?.hardware_background} setup!`);
  };

  // --- URDU TRANSLATION LOGIC (Bonus +50) ---
  const handleTranslation = async () => {
    const markdownContent = document.querySelector('.markdown')!.innerHTML;
    if (!markdownContent) {
        alert("Cannot find content to translate.");
        return;
    }
    
    if (!isTranslated) {
        localStorage.setItem('originalDocContent', markdownContent);
    }
    
    setLoading(true);
    try {
        const response = await fetch(`${API_URL}/translate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                text: markdownContent, 
                target_lang: "Urdu (Roman script)" 
            }),
        });
        
        const data = await response.json();
        
        if (response.ok && data.translation) {
            document.querySelector('.markdown')!.innerHTML = data.translation;
            setIsTranslated(true);
        } else {
            alert(`Translation failed: ${data.detail || 'API issue or Key error.'}`);
        }

    } catch(e) {
        alert("Translation server error (FastAPI offline or API key issue).");
    } finally {
        setLoading(false);
    }
  };

  const handleRevert = () => {
    const original = localStorage.getItem('originalDocContent');
    if (original) {
        document.querySelector('.markdown')!.innerHTML = original;
        setIsTranslated(false);
    }
  };


  // --- UI RENDER ---
  return (
    <>
      {/* 1. Auth Form (Bonus +50: Signup/Signin) */}
      <AuthForm setUser={setUser as Dispatch<SetStateAction<User | null>>} user={user} />
      
      {/* 2. PERSONALIZATION / TRANSLATION BUTTONS (Bonus +50 & +50) */}
      {user && (
          <div className={styles.topButtons}>
              {/* Personalization Button (Bonus +50) */}
              <button onClick={handlePersonalize} className={styles.personalizeButton} disabled={loading}>
                  {user.hardware_background} Setup Personalization
              </button>
              
              {/* Urdu Translation Button (Bonus +50) */}
              <button 
                  onClick={isTranslated ? handleRevert : handleTranslation} 
                  className={styles.translateButton} 
                  disabled={loading}
              >
                  {isTranslated ? 'View English' : 'Translate to Urdu (Roman)'}
              </button>
          </div>
      )}
    
      {/* 3. RAG CHAT INTERFACE (Core 100 Points) */}
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
    </>
  );
}