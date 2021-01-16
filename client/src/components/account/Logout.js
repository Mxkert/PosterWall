import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';

import { firebase } from '../../config/firebase';

// Import loading icon from Lottie
import SuccessIcon from "../animations/SuccessIcon";

export const Logout = () => {

  const [loggedIn, setLoggedIn] = useState(true);
  const [toHome, setToHome] = useState(false);

  useEffect(() => {
    firebase.auth().signOut().then(function() {
      // Sign-out successful.
      setLoggedIn(false);
      setTimeout(() => setToHome(true), 2000);
      console.log('uitgelogt');
    }).catch(function(error) {
      // An error happened.
      console.log(error);
    });
  }, []);

  return (
    <>

    { !loggedIn ?
      <>
        { toHome ? <Redirect to="/login" /> : null }
        <div className="icon-screen">
          <SuccessIcon />
          <p>You have been succesfully logged out.</p>
        </div>
      </>
    :
      null
    }
    </>
  )

};