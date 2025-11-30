// D:\phyical-ai-textbook\docs\src\components\RAGChatbot\AuthForm.tsx
import React, { useState, Dispatch, SetStateAction } from 'react';
import styles from './styles.module.css';
import { User } from './index'; // Correctly import User interface from index.tsx

const API_URL = 'http://127.0.0.1:8000'; // Deployment par yeh URL badal jayega!

// FIX: AuthForm ke props ke liye sahi types define karein
interface AuthFormProps {
    // Dispatch type use karein taake React state setter theek ho
    setUser: Dispatch<SetStateAction<User | null>>; 
    user: User | null;
}

// UserModel is not defined error users.py mein fix ho chuka hai

export default function AuthForm({ setUser, user }: AuthFormProps) {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [software, setSoftware] = useState('Beginner'); 
    const [hardware, setHardware] = useState('Laptop');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    // --- AUTH LOGIC (SIGNUP/SIGNIN) ---
    const handleAuth = async (endpoint: string) => {
        setLoading(true);
        setMessage('');
        
        const requestBody: any = { username, password };
        if (endpoint === 'signup') {
            requestBody.software_background = software;
            requestBody.hardware_background = hardware;
        }

        try {
            const response = await fetch(`${API_URL}/${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody),
            });

            const data = await response.json();

            if (data.success) {
                setMessage(`${data.message}. Welcome, ${data.user.username}.`);
                // User state aur session ko set karna
                setUser(data.user); 
                localStorage.setItem('currentUser', JSON.stringify(data.user)); 
            } else {
                setMessage(data.message || "Authentication failed.");
            }
        } catch (error) {
            setMessage("Server error during authentication or connection refused.");
        } finally {
            setLoading(false);
        }
    };
    
    // --- UI DISPLAY ---
    if (user) {
        return (
            <div className={styles.authContainer}>
                <p className={styles.authStatus}>
                    Logged in as: <strong>{user.username}</strong>
                    <br />
                    Background: {user.software_background} ({user.hardware_background})
                </p>
            </div>
        );
    }

    // Login/Signup Form UI
    return (
        <div className={styles.authContainer}>
            <h4 className={styles.authHeader}>{isLogin ? 'Sign In' : 'Sign Up'} for Personalization</h4>
            <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
            <input type="password" placeholder="Password (hackathon2025)" value={password} onChange={(e) => setPassword(e.target.value)} />
            
            {/* Signup Fields (Bonus +50) */}
            {!isLogin && (
                <>
                    <label>Software Background:</label>
                    <select value={software} onChange={(e) => setSoftware(e.target.value)}>
                        <option value="Beginner">Beginner</option>
                        <option value="ROS_Familiar">ROS Familiar</option>
                        <option value="Expert_Python">Expert Python/AI</option>
                    </select>

                    <label>Hardware Background:</label>
                    <select value={hardware} onChange={(e) => setHardware(e.target.value)}>
                        <option value="Laptop">Standard Laptop</option>
                        <option value="RTX_GPU">High-end RTX GPU</option>
                        <option value="Jetson_Orin">NVIDIA Jetson/Edge Kit</option>
                    </select>
                </>
            )}

            <button 
                onClick={() => handleAuth(isLogin ? 'signin' : 'signup')} 
                disabled={loading || !username || !password}
                className={styles.authButton}
            >
                {isLogin ? 'Sign In' : 'Sign Up'}
            </button>
            
            <p className={styles.toggleAuth} onClick={() => setIsLogin(!isLogin)}>
                {isLogin ? 'New User? Sign up here.' : 'Already have an account? Sign in.'}
            </p>
            {message && <p className={styles.message}>{message}</p>}
        </div>
    );
}