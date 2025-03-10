import React, { useState } from 'react';
import { auth, db } from './firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword} from 'firebase/auth';
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
  const [showHelp, setShowHelp] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  const handleRegister = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user.uid;

      await setDoc(doc(db, 'users', userId), {
        firstName,
        lastName,
        userTag,
        email
      });

      setMessage('✅ Registered successfully!');
      onLoginSuccess(userCredential.user);
    } catch (error) {
      setMessage(`❌ ${error.message}`);
    }
  };

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setMessage('✅ Logged in successfully!');
      onLoginSuccess(userCredential.user);
    } catch (error) {
      setMessage(`❌ ${error.message}`);
    }
  };

  return (
    <div className="app-container">
      <div className="form-container">
        <div className="title">
          <h1>Checked</h1>
          <Check size={40} className="deep-green-check" />
        </div>
        
        <button onClick={() => setShowHelp(!showHelp)} className="help-button">?</button>
        {showHelp && (
          <div className="help-box">
            <p className="help-text">
              This is an attendance tracker. <br />
              - Register or login to proceed. <br />
              - You can create events or join existing ones using Event IDs.
            </p>
          </div>
        )}

        <h2>{isRegistering ? 'Register' : 'Login'}</h2>

        {isRegistering && (
          <>
            <input type="text" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="input" />
            <input type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} className="input" />
            <input type="text" placeholder="User Tag (****-***** Format)" value={userTag} onChange={(e) => setUserTag(e.target.value)} className="input" />
          </>
        )}

        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="input" />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="input" />

        {isRegistering ? (
          <div className="toggle-container">
            <button className="button" onClick={handleRegister}>Register</button>
            <p className="toggle-text" style={{ fontSize: '15px', fontWeight: 'bold', color: '#5cf366', marginTop: '10px' }}>
              Already have an account? <span onClick={() => setIsRegistering(false)} className="text-link highlight" style={{ cursor: 'pointer', textDecoration: 'underline' }}>Login here</span>
            </p>
          </div>
        ) : (
          <div className="toggle-container">
            <button className="button" onClick={handleLogin}>Login</button>
            <p className="toggle-text" style={{ fontSize: '15px', fontWeight: 'bold', color: '#5cf366', marginTop: '10px' }}>
              Don't have an account? <span onClick={() => setIsRegistering(true)} className="text-link highlight" style={{ cursor: 'pointer', textDecoration: 'underline' }}>Register here</span>
            </p>
          </div>
        )}

        {message && <p className="message">{message}</p>}
        <p className="powered-by">Powered by Firebase</p>
      </div>
    </div>
  );
};

export default AuthPage;
