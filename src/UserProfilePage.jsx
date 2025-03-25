import React, { useState, useEffect } from 'react';
import { db, auth } from './firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import './App.css';

const UserProfilePage = ({ user, goBack }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [editing, setEditing] = useState(false);
  const [updatedInfo, setUpdatedInfo] = useState({ firstName: '', lastName: '', userTag: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUserInfo(userDoc.data());
          setUpdatedInfo(userDoc.data());
        }
      }
    };
    fetchUserInfo();
  }, [user]);

  const handleEditToggle = () => {
    setEditing(!editing);
    setMessage(editing ? '❌ Editing canceled.' : '✏️ Editing enabled. You can now modify your details.');
  };

  const handleInputChange = (e) => {
    setUpdatedInfo({ ...updatedInfo, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!updatedInfo.firstName || !updatedInfo.lastName || !updatedInfo.userTag) {
      setMessage('❌ All fields must be filled.');
      return;
    }

    try {
      await updateDoc(doc(db, 'users', user.uid), updatedInfo);
      setUserInfo(updatedInfo);
      setEditing(false);
      setMessage('✅ Profile updated successfully!');
    } catch (error) {
      setMessage(`❌ Error updating profile: ${error.message}`);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    window.location.reload();
  };

  if (!userInfo) return <p>Loading user information...</p>;

  return (
    <div className="app-container">
      <div className={`form-container ${editing ? 'editing-mode' : ''}`} style={{ backgroundColor: editing ? '#f0fff4' : 'white', border: editing ? '2px solid #1B5E20' : 'none', transition: 'all 0.3s ease' }}>
        <h1 className="page-title" style={{ color:"#388E3C" }}>User Profile</h1>
        {message && <p className="message" style={{ color:'#388E3C' }}>{message}</p>}
        <div className="profile-field">
          <label>First Name</label>
          <input type="text" name="firstName" value={updatedInfo.firstName} onChange={handleInputChange} disabled={!editing} className={`input ${editing ? 'editable' : ''}`} style={{ backgroundColor: editing ? '#ccff90' : '#e8f5e9', borderColor: editing ? '#00796B' : '#ccc', transition: 'all 0.3s ease' }} />
        </div>
        <div className="profile-field">
          <label>Last Name</label>
          <input type="text" name="lastName" value={updatedInfo.lastName} onChange={handleInputChange} disabled={!editing} className={`input ${editing ? 'editable' : ''}`} style={{ backgroundColor: editing ? '#ccff90' : '#e8f5e9', borderColor: editing ? '#00796B' : '#ccc', transition: 'all 0.3s ease' }} />
        </div>
        <div className="profile-field">
          <label>User Tag</label>
          <input type="text" name="userTag" value={updatedInfo.userTag} onChange={handleInputChange} disabled={!editing} className={`input ${editing ? 'editable' : ''}`} style={{ backgroundColor: editing ? '#ccff90' : '#e8f5e9', borderColor: editing ? '#00796B' : '#ccc', transition: 'all 0.3s ease' }} />
        </div>
        <div className="button-group">
          {editing ? (
            <>
              <button className="button save-button" onClick={handleSave} style={{ backgroundColor: '#00796B', color: 'white' }}>Save Changes</button>
              <button className="button cancel-button" onClick={handleEditToggle} style={{ backgroundColor: '#d32f2f', color: 'white' }}>Cancel</button>
            </>
          ) : (
            <button className="button edit-button" onClick={handleEditToggle} style={{ backgroundColor: '#388E3C', color: 'white' }}>Edit Profile</button>
          )}
          <button className="button" onClick={goBack} style={{ backgroundColor: '#388E3C', color: 'white' }}>Back to Attendance</button>
          <button className="logout-button" onClick={handleLogout} style={{ backgroundColor: '#d32f2f', color: 'white' }}>Logout</button>
        </div>
        <p className="powered-by">Powered by Firebase</p>
      </div>
    </div>
  );
};

export default UserProfilePage;
