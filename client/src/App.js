import React, { useEffect, useState, useMemo } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import './App.css';

import './Typography.css';
import './components/Form.css';

import './components/Modal.css';

// Firebase
import { firebase } from './config/firebase';

import { Signup } from './components/account/Signup';
import { Login } from './components/account/Login';
import { Logout } from './components/account/Logout';

import { Posters } from './components/posters/Posters'; 
import { Review } from './components/posters/Review';
import { Archive } from './components/posters/Archive';

import { GeoLocation } from './components/GeoLocation';

import { UserContext } from "./components/account/UserContext";

import { Date } from './components/Date';

export const App = () => {

  const [user, setUser] = useState(null);

  const value = useMemo(() => ({ user, setUser }), [user, setUser]);

  useEffect(() => {
    var unsubscribe = firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        setUser(user);
        console.log('ingelogt');
      } else {
        setUser(null);
        console.log('niet ingelogt');
      }
    });
    return function cleanup() {
      unsubscribe();
    }
  }, []);

  return (
    <UserContext.Provider value={value}>
      <BrowserRouter>
        <div className="wrapper">
          
          <Route path="/geolocation" exact component={ GeoLocation } />
          
          <Route path="/signup" exact component={ Signup } />
          <Route path="/login" exact component={ Login } />

          { user ?
          <Route path="/logout" exact component={ Logout } />
          : null }
  
          <Route
            exact
            path='/'
            render={(props) => (
              <Posters {...props} user={user} />
            )}
          />

          { user ?
          <>
            <Route path="/review" exact component={ Review } user={user} />
            <Route path="/archive" exact component={ Archive } user={user} />
          </>
          : null }

          <Route path="/date" exact component={ Date } />

        </div>
      </BrowserRouter>
    </UserContext.Provider>
  );
}
