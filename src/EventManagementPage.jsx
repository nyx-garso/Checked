import React, { useState, useEffect } from 'react';
import { db } from './firebaseConfig';
import { collection, getDocs, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import './App.css';
import CreateEventPage from './CreateEventPage';

const EventManagementPage = ({ user, goBack }) => {
  const [events, setEvents] = useState([]);
  const [attendanceList, setAttendanceList] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [showCreateEvent, setShowCreateEvent] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      const userEvents = [];
      const querySnapshot = await getDocs(collection(db, 'events'));

      querySnapshot.forEach((doc) => {
        if (doc.data().createdBy === user.uid) {
          userEvents.push({ id: doc.id, ...doc.data() });
        }
      });

      setEvents(userEvents);
    };
    fetchEvents();
  }, [user]);
  if (showCreateEvent) return <CreateEventPage user={user} goBackToManagement={() => setShowCreateEvent(false)} />;
  if (showCreateEvent) return <CreateEventPage user={user} goBack={() => setShowCreateEvent(false)} />;
  const viewAttendance = (eventId) => {
    setSelectedEventId(eventId);

    const attendanceRef = collection(db, `events/${eventId}/attendance`);
    onSnapshot(attendanceRef, (snapshot) => {
      const attendees = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setAttendanceList(attendees);
    });
  };
  const handleDeleteEvent = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await deleteDoc(doc(db, 'events', eventId)); // Deletes the event from Firestore
        setEvents(events.filter(event => event.id !== eventId)); // Remove the event from the UI
        alert('Event deleted successfully!');
      } catch (error) {
        alert('Error deleting event: ' + error.message);
      }
    }
  };
  

  return (
    <div className="app-container">
      <div className="form-container">
        <h1 className="page-title">Event Management</h1>

        <div className="button-group">
            <button className="button" onClick={() => setShowCreateEvent(true)}>Create Event</button>
            <button className="button" onClick={goBack}>Back to Attendance</button>
        </div>

        <div className="event-list">
          {events.map(event => (
            <div key={event.id} className="event-item">
              <h3>{event.eventName}</h3>
              <p>Date: {event.eventDate}</p>
              <p>Time: {event.eventTime}</p>
              <p>Event ID: {event.id}</p>
              <button className="view-attendance-button" onClick={() => viewAttendance(event.id)}>View Attendance</button>
              <button className="delete-event-button" onClick={() => handleDeleteEvent(event.id)}>Delete Event</button>
            </div>
          ))}
        </div>

        {selectedEventId && (
        <div className="attendance-list">
            <h2>Attendance for Event: {events.find(event => event.id === selectedEventId)?.eventName || 'Unknown Event'}</h2>
            {attendanceList.length === 0 ? (
            <p>No attendance marked yet.</p>
            ) : (
            <ul>
                {attendanceList.map(attendee => (
                <li key={attendee.id}>
                    {attendee.lastName}, {attendee.firstName} - Marked at {attendee.timestamp}
                </li>
                ))}
            </ul>
            )}
        </div>
        )}
        
      </div>
    </div>
  );
};

export default EventManagementPage;
