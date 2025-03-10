import React, { useState } from 'react';
import { db } from './firebaseConfig';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import './App.css';

const CreateEventPage = ({ user, goBackToManagement }) => {
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [eventID, setEventID] = useState('');
  const [message, setMessage] = useState('');

  const generateEventID = () => Math.random().toString(36).substring(2, 10).toUpperCase();

  const handleCreateEvent = async () => {
    if (!eventName || !eventDate || !eventTime) {
      setMessage('❌ Please fill in all required fields.');
      return;
    }

    const finalEventID = eventID.trim() === '' ? generateEventID() : eventID;

    try {
      // Check if the Event ID already exists in Firestore
      const eventRef = doc(db, 'events', finalEventID);
      const eventDoc = await getDoc(eventRef);

      if (eventDoc.exists()) {
        setMessage('❌ Event ID already exists. Please choose a different one.');
        return;
      }

      // If not a duplicate, proceed to create the event
      await setDoc(eventRef, {
        eventName,
        eventDate,
        eventTime,
        createdBy: user.uid
      });

      setMessage(`✅ Event created successfully with Event ID: ${finalEventID}`);
      setEventName('');
      setEventDate('');
      setEventTime('');
      setEventID('');
    } catch (error) {
      setMessage(`❌ Error creating event: ${error.message}`);
    }
  };

  return (
    <div className="app-container">
      <div className="form-container">
        <h1 className="page-title">Create Event</h1>

        <input 
          type="text" 
          placeholder="Event Name" 
          value={eventName} 
          onChange={(e) => setEventName(e.target.value)} 
          className="input" 
        /><br />

        <input 
          type="date" 
          value={eventDate} 
          onChange={(e) => setEventDate(e.target.value)} 
          className="input" 
        /><br />

        <input 
          type="time" 
          value={eventTime} 
          onChange={(e) => setEventTime(e.target.value)} 
          className="input" 
        /><br />

        <input 
          type="text" 
          placeholder="Custom Event ID (Optional)" 
          value={eventID} 
          onChange={(e) => setEventID(e.target.value)} 
          className="input" 
        /><br />

        <div className="button-group">
          <button className="button" onClick={handleCreateEvent}>Create Event</button>
          <button className="button" onClick={() => {goBackToManagement();}}>
  Return to Event Management
</button>
        </div>

        {message && <p className="message">{message}</p>}
        <p className="powered-by">Powered by Firebase</p>
      </div>
    </div>
  );
};

export default CreateEventPage;
