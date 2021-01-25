import React, { useState } from 'react';
import { useForm }  from 'react-hook-form';
import { Redirect } from 'react-router-dom';

import { firebase } from '../../config/firebase';

// Import loading icon from Lottie
import SuccessIcon from "../animations/SuccessIcon";
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';

import TextField from "@material-ui/core/TextField";
import Alert from '@material-ui/lab/Alert';

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

      <Container maxWidth="md">

        <div className="form-container">
          <div className="form login-form">

            { loggedIn ?
              <div className="icon-screen">
                <SuccessIcon />
                <p>You have been succesfully signed up and logged in.</p>
              </div>
            :
              <>
                <h1 className="title">
                  Sign up
                </h1>
                { errorMessage ? <div style={{ marginBottom: '1.5rem' }}>{errorMessage}</div> : ''}
                <form onSubmit={handleSubmit(signUp)}>
                  <Grid container spacing={3} justify="center">

                    <Grid item xs={12}>
                      { errorMessage ? <Alert severity="error">{ errorMessage }</Alert> : null}
                    </Grid> 

                    <Grid item xs={12}>
                      <TextField 
                        id="email"
                        name="email"
                        type="email"
                        label="E-mail address"
                        variant="outlined"
                        className="form-input"
                        inputRef={register}
                      />
                    </Grid> 

                    <Grid item xs={12}>
                      <TextField 
                        id="password"
                        name="password"
                        type="password"
                        label="Password"
                        variant="outlined"
                        className="form-input"
                        inputRef={register}
                      />

                      <Grid item xs={12}>
                        <button type="submit" className="btn" style={{ width: '100%', marginTop: '1.5rem' }}>Sign up</button>
                      </Grid>

                    </Grid>

                  </Grid>
                </form>
              </>
            }
          </div>
        </div>
      </Container>
    </>
  )

};