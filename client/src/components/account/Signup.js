import React, { useState } from 'react';
import { useForm }  from 'react-hook-form';
import { Redirect } from 'react-router-dom';

import { firebase } from '../../config/firebase';

// Import loading icon from Lottie
import SuccessIcon from "../animations/SuccessIcon";

import '../Form.css';

export const Signup = () => {

  const [loggedIn, setLoggedIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [toHome, setToHome] = useState(false);

  const {register, handleSubmit} = useForm();
  
  const signUp = (data) => {
    const email = data.email;
    const password = data.password;
    firebase.auth().createUserWithEmailAndPassword(email, password).then((u) => {
      setLoggedIn(true);
      setTimeout(() => setToHome(true), 2000);
    }).catch((error) => {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // ...
      console.log(errorCode);
      console.log(errorMessage);

      setErrorMessage(errorMessage);
    }); 
  }

  return (
    <>

      { toHome ? <Redirect to="/" /> : null }

      { loggedIn ?
        <div className="icon-screen">
          <SuccessIcon />
          <p>You have been succesfully signed up and logged in.</p>
        </div>
      :
      <div className="form-container">
        <div className="form">
          <h1 className="title">
            Sign up
          </h1>
          { errorMessage ? <div style={{ marginBottom: '1.5rem' }}>{errorMessage}</div> : ''}
          <form onSubmit={handleSubmit(signUp)}>
            <div className="form-group">
              <label htmlFor="username">
                <input className="form-input" type="email" ref={register} name="email" placeholder="E-mailadres" />
              </label>
            </div>
            <div className="form-group">
              <label htmlFor="password">
                <input className="form-input" type="password" ref={register} name="password" placeholder="Wachtwoord" />
              </label>
            </div>
            <button type="submit" className="btn btn-blue">Sign up</button>
          </form>
        </div>
        <div className="form-bottom">
          <p>Already have an account? <a href="/login">Login here</a>.</p>
        </div>
      </div>
      }
    </>
  )

};