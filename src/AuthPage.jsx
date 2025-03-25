import React, { useState } from 'react';
import { auth, db } from './firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { Check } from 'lucide-react';
import './App.css';

const AuthPage = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [userTag, setUserTag] = useState('');
  const [message, setMessage] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const validateInputs = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/; // At least 6 chars, 1 letter, 1 number
    const userTagRegex = /^\d{4}-\d{5}$/; // Format: 1234-12345

    if (isRegistering) {
      if (!firstName.trim() || !lastName.trim()) {
        setMessage('❌ First and Last Name are required.');
        return false;
      }
      if (!userTagRegex.test(userTag)) {
        setMessage('❌ User Tag must be in the format ****-***** (e.g., 1234-56789).');
        return false;
      }
    }
    if (!emailRegex.test(email)) {
      setMessage('❌ Invalid email format.');
      return false;
    }
    if (!passwordRegex.test(password)) {
      setMessage('❌ Password must be at least 6 characters and contain a letter and a number.');
      return false;
    }
    return true;
  };

  const handleRegister = async () => {
    if (!validateInputs()) return;
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user.uid;
      await setDoc(doc(db, 'users', userId), { firstName, lastName, userTag, email });
      setMessage('✅ Registered successfully!');
      onLoginSuccess(userCredential.user);
    } catch (error) {
      setMessage(`❌ ${error.message}`);
    }
  };

  const handleLogin = async () => {
    if (!validateInputs()) return;
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setMessage('✅ Logged in successfully!');
      onLoginSuccess(userCredential.user);
    } catch (error) {
      setMessage(`❌ ${error.message}`);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      isRegistering ? handleRegister() : handleLogin();
    }
  };

  return (
    <div className="app-container">
      <div className="form-container" onKeyDown={handleKeyDown} tabIndex={0}>
        <div className="title">
          <h1>Checked</h1>
          <Check size={40} className="deep-green-check" />
        </div>

        <h2>{isRegistering ? 'Register' : 'Login'}</h2>

        {isRegistering && (
          <>
            <input type="text" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="input" />
            <input type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} className="input" />
            <input type="text" placeholder="User Tag (****-*****)" value={userTag} onChange={(e) => setUserTag(e.target.value)} className="input" />
          </>
        )}

        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="input" />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="input" />

        <div className="toggle-container">
          <button className="button" onClick={isRegistering ? handleRegister : handleLogin}>
            {isRegistering ? 'Register' : 'Login'}
          </button>
          <p className="toggle-text" style={{ fontSize: '16px', fontWeight: 'bold', color: '#1B5E20' }}>
            {isRegistering ? 'Already have an account?' : "Don't have an account?"}{' '}
            <span onClick={() => setIsRegistering(!isRegistering)} className="text-link highlight" style={{ cursor: 'pointer', textDecoration: 'underline', color: '#1B5E20', transition: 'all 0.3s ease' }}
              onMouseOver={(e) => { e.target.style.color = '#4CAF50'; e.target.style.fontSize = '18px'; }}
              onMouseOut={(e) => { e.target.style.color = '#1B5E20'; e.target.style.fontSize = '16px'; }}>
              {isRegistering ? 'Login here' : 'Register here'}
            </span>
          </p>
        </div>

        {message && <p className="message">{message}</p>}
        <p className="powered-by">Powered by Firebase</p>
      </div>
    </div>
  );
};

export default AuthPage;