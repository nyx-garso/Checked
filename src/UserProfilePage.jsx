import React, { useState, useEffect } from 'react';
import { db, auth } from './firebaseConfig';
import { doc, getDoc, collection, getDocs, deleteDoc } from 'firebase/firestore';
import { signOut, deleteUser } from 'firebase/auth';
import './App.css';

const UserProfilePage = ({ user, goBack }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [attendedEvents, setAttendedEvents] = useState([]);
  const [message, setMessage] = useState('');

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

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        await deleteDoc(doc(db, 'users', user.uid)); // Remove user data from Firestore
        await deleteUser(auth.currentUser); // Delete user from Firebase Authentication
        alert('Account deleted successfully.');
        window.location.reload();
      } catch (error) {
        alert('Error deleting account: ' + error.message);
      }
    }
  };

  if (!userInfo) return <p>Loading user information...</p>;

  return (
    <div className="app-container">
      <div className="form-container">
        <h1 className="page-title">User Profile</h1>
        
        <div className="profile-field">
            <label>First Name</label>
            <input type="text" value={userInfo.firstName} disabled className="input" />
        </div>
        
        <div className="profile-field">
            <label>Last Name</label>
            <input type="text" value={userInfo.lastName} disabled className="input" />
        </div>

        <div className="profile-field">
            <label>User Tag</label>
            <input type="text" value={userInfo.userTag} disabled className="input" />
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
            <p>No attended events found.</p>
          )}
        </div>
        
        <div className="button-group">
          <button className="button" onClick={goBack}>Back to Attendance</button>
          <button className="logout-button" onClick={handleLogout}>Logout</button>
          <button className="delete-account-button" onClick={handleDeleteAccount}>Delete Account</button>
        </div>
        
        {message && <p className="message">{message}</p>}
        <p className="powered-by">Powered by Firebase</p>
      </div>
    </div>
  );
};

export default UserProfilePage;
