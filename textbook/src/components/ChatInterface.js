import React, { useState, useRef, useEffect } from 'react';
import { useColorMode } from '@docusaurus/theme-common';
import styles from './ChatInterface.module.css';

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const { colorMode } = useColorMode();

  const getSmartResponse = (query) => {
    const q = query.toLowerCase();
    
    // 1. Sabse pehle Locomotion (agar chalne ki baat ho rahi hai)
    if (q.includes("locomotion") || q.includes("walk") || q.includes("balance") || q.includes("move")) {
      return "In the Locomotion chapter, we explore how humanoids maintain balance using the Zero Moment Point (ZMP) control and Center of Mass (CoM) management to prevent falling.";
    }

    // 2. Phir Manipulation (agar hathon ya pakadne ki baat ho rahi hai)
    if (q.includes("manipulation") || q.includes("hand") || q.includes("grasp") || q.includes("arm")) {
      return "Chapter 3 on Manipulation explains robotic arms, grasping strategies, and the use of force sensors to ensure the robot can interact with objects safely.";
    }

    // 3. Phir Sensors/Perception (agar dekhne ya sensing ki baat ho rahi hai)
    if (q.includes("sensor") || q.includes("vision") || q.includes("camera") || q.includes("see")) {
      return "The Perception chapter details how robots use depth cameras and LiDAR to convert 3D point clouds into a world model for obstacle avoidance.";
    }

    // 4. Phir HRI (agar social ya human ki baat ho rahi hai)
    if (q.includes("hri") || q.includes("human") || q.includes("social")) {
      return "Human-Robot Interaction (HRI) is discussed in Chapter 5, focusing on social robotics, speech recognition, and gesture interpretation for safe collaboration.";
    }

    // 5. Agar sirf "What is" ya "Foundation" pucha jaye
    if (q.includes("what is") || q.includes("foundation") || q.includes("math") || q.includes("intro")) {
      return "According to Chapter 1, Physical AI is the bridge between AI algorithms and robotic hardware, using Kinematics and Dynamics as mathematical pillars.";
    }

    // Default Answer agar kuch match na ho
    return "This specific detail is part of our Physical AI research. Broadly, the textbook explains how neural controllers process sensor data into motor commands.";
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userText = inputValue;
    setMessages(prev => [...prev, { id: Date.now(), text: userText, sender: 'user' }]);
    setInputValue('');
    setIsLoading(true);

    setTimeout(() => {
      const response = getSmartResponse(userText);
      setMessages(prev => [...prev, { id: Date.now(), text: response, sender: 'ai' }]);
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className={`${styles['chat-interface']} ${styles[colorMode]}`}>
      <div className={styles['chat-header']}>
        <h3>Anum's AI Assistant</h3>
        <p>Textbook Knowledge Portal</p>
      </div>
      <div className={styles['chat-messages']}>
        {messages.length === 0 && (
          <div className={styles['welcome-message']}>Ask me about Locomotion, Manipulation, or Foundations!</div>
        )}
        {messages.map((msg) => (
          <div key={msg.id} className={`${styles.message} ${styles[`${msg.sender}-message`]}`}>
            <div className={styles['message-content']}>{msg.text}</div>
          </div>
        ))}
        {isLoading && <div className={styles['loading-text']}>Analyzing...</div>}
        <div ref={messagesEndRef} />
      </div>
      <form className={styles['chat-input-form']} onSubmit={handleSubmit}>
        <div className={styles['input-area']}>
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSubmit(e)}
            placeholder="Type your question..."
            rows="1"
          />
          <button type="submit" className={styles['send-button']}>→</button>
        </div>
      </form>
    </div>
  );
};

export default ChatInterface;