import React, { useState, useEffect } from 'react';
import { db, auth } from './firebaseConfig';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import './App.css';

const UserProfilePage = ({ user, goBack }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [attendedEvents, setAttendedEvents] = useState([]);
  const [message] = useState('');

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUserInfo(userDoc.data());
        }
      }
    };

    const fetchAttendedEvents = async () => {
      if (user) {
        const eventsCollection = collection(db, 'events');
        const eventsSnapshot = await getDocs(eventsCollection);
        const attended = [];
        
        for (const eventDoc of eventsSnapshot.docs) {
          const attendanceRef = doc(db, `events/${eventDoc.id}/attendance`, user.uid);
          const attendanceSnap = await getDoc(attendanceRef);
          if (attendanceSnap.exists()) {
            attended.push({ id: eventDoc.id, ...eventDoc.data() });
          }
        }
        setAttendedEvents(attended);
      }
    };

    fetchUserInfo();
    fetchAttendedEvents();
  }, [user]);

  const handleLogout = async () => {
    await signOut(auth);
    window.location.reload();
  };

  if (!userInfo) return <p>Loading user information...</p>;

  return (
    <div className="app-container">
      <div className="form-container">
        <h1 className="page-title">User Profile</h1>
        
        <div style={{ textAlign: 'left', marginBottom: '10px' }}>
            <label style={{ fontSize: '15px', fontWeight: 'bold', color: '#1B5E20' }}>First Name</label>
            <input 
            type="text" 
            value={userInfo.firstName} 
            disabled 
            className="input" 
            /><br />
        </div>
        
        <div style={{ textAlign: 'left', marginBottom: '10px' }}>
            <label style={{ fontSize: '15px', fontWeight: 'bold', color: '#1B5E20' }}>Last Name</label>
            <input 
            type="text" 
            value={userInfo.lastName} 
            disabled 
            className="input" 
            /><br />
        </div>

        <div style={{ textAlign: 'left', marginBottom: '10px' }}>
            <label style={{ fontSize: '15px', fontWeight: 'bold', color: '#1B5E20' }}>User Tag</label>
            <input 
            type="text" 
            value={userInfo.userTag} 
            disabled 
            className="input" 
            /><br />
        </div>

        <h2>Attended Events</h2>
        <div className="event-list">
          {attendedEvents.length > 0 ? (
            <ul>
              {attendedEvents.map(event => (
                <li key={event.id} className="event-item">
                  <strong>{event.eventName}</strong> - {event.eventDate} {event.eventTime}
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ fontSize: '15px', fontWeight: 'bold', color: '#5cf366'}}>No attended events found.</p>
          )}
        </div>
        
        <div className="button-group">
          <button className="button" onClick={goBack}>Back to Attendance</button>
          <button className="logout-button" onClick={handleLogout}>Logout</button>
        </div>
        
        {message && <p className="message">{message}</p>}
        <p className="powered-by">Powered by Firebase</p>
      </div>
    </div>
  );
};

export default UserProfilePage;
