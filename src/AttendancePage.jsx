import React, { useState, useEffect } from 'react';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { db, auth } from './firebaseConfig';
import UserProfilePage from './UserProfilePage';
import EventManagementPage from './EventManagementPage';
import './App.css';

const AttendancePage = ({ user }) => {
  const [message, setMessage] = useState('');
  const [showProfile, setShowProfile] = useState(false);
  const [showEventManagement, setShowEventManagement] = useState(false);
  const [eventId, setEventId] = useState('');
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUserInfo(userDoc.data());
        }
      }
    };
    fetchUserInfo();
  }, [user]);

  const markAttendance = async () => {
    if (!userInfo) {
      setMessage('❌ User information not loaded yet.');
      return;
    }
    if (user && eventId) {
      const attendanceRef = doc(db, `events/${eventId}/attendance`, user.uid);
      const attendanceSnap = await getDoc(attendanceRef);

      if (!attendanceSnap.exists()) {
        await setDoc(attendanceRef, { 
          marked: true, 
          timestamp: new Date().toISOString(),
          firstName: userInfo.firstName,
          lastName: userInfo.lastName
        });
        setMessage(`✅ Attendance marked successfully for Event ID: ${eventId}`);
      } else {
        setMessage(`⚠️ You have already marked attendance for Event ID: ${eventId}`);
      }
    } else {
      setMessage('❌ Please enter a valid Event ID.');
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    window.location.reload();
  };

  if (showProfile) return <UserProfilePage user={user} userInfo={userInfo} goBack={() => setShowProfile(false)} />;
  if (showEventManagement) return <EventManagementPage user={user} goBack={() => setShowEventManagement(false)} />;

  return (
    <div className="app-container">
      <div className="form-container">
        <h1 className="page-title">Attendance</h1>
        <h2 className="welcome-text">Welcome, {userInfo?.firstName} {userInfo?.lastName}</h2>
        
        <input 
          type="text" 
          placeholder="Enter Event ID" 
          value={eventId} 
          onChange={(e) => setEventId(e.target.value)} 
          className="input" 
        /><br />

        <div className="mark-attendance-container">
          <button className="mark-attendance-button" onClick={markAttendance}>Mark Attendance</button>
        </div>

        <div className="button-group">
          <button className="button" onClick={() => setShowProfile(true)}>Show Profile</button>
          <button className="button" onClick={() => setShowEventManagement(true)}>Manage Events</button>
          <button className="logout-button" onClick={handleLogout}>Logout</button>
        </div>
        
        {message && <p className="message">{message}</p>}
        <p className="powered-by">Powered by Firebase</p>
      </div>
    </div>
  );
};

export default AttendancePage;
