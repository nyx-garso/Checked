import React, { useState, useEffect } from 'react';
import { auth } from './firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import AttendancePage from './AttendancePage';
import EventManagementPage from './EventManagementPage';
import CreateEventPage from './CreateEventPage';
import AuthPage from './AuthPage';
import './App.css';

const App = () => {
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('login');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setCurrentPage('attendance');
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLoginSuccess = (user) => {
    setUser(user);
    setCurrentPage('attendance');
  };
  
  const navigate = (page) => {
    console.log(`Navigating to: ${page}`);
    setCurrentPage(page);
  };
  

  if (!user && currentPage === 'login') {
    return <AuthPage onLoginSuccess={handleLoginSuccess} />;
  }

  switch (currentPage) {
    case 'attendance':
      return <AttendancePage user={user} navigate={navigate} />;
    case 'eventManagement':
      return <EventManagementPage user={user} goBack={() => navigate('attendance')} goToCreateEvent={() => navigate('createEvent')} />;
      case 'createEvent':
        return (<CreateEventPage user={user} goBackToManagement={() => navigate('eventManagement')} />);      
    default:
      return null;
  }
};

export default App;
