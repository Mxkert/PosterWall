import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray } from "react-hook-form";
import { Redirect } from 'react-router-dom';

import axios from 'axios';
import moment from "moment";
import 'moment/locale/nl';

import '../../Typography.css';
import '../Form.css';

import Grid from '@material-ui/core/Grid';

import TextField from "@material-ui/core/TextField";
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import ChipInput from 'material-ui-chip-input';

export const Form = () => {

  const { handleSubmit, register, errors } = useForm();

  return (
    <>

      <div className="header">

        <h2>Submit a poster</h2>
        <p>
          For each project we establish relationships with partners who we know will help us create added value for your project.
        </p>
      </div>

      <form noValidate autoComplete="off">
        <Grid container spacing={3} justify="center">
          <Grid item xs={12}>
            <TextField 
              id="email"
              type="email"
              label="E-mail address"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField 
              id="password"
              type="password"
              label="Password"
              variant="outlined"
            />
          </Grid>
        </Grid>
      </form>

      <form noValidate autoComplete="off" onSubmit={handleSubmit()}>
        <Grid container spacing={3} justify="center">
          <Grid item xs={12}>
            <TextField 
              id="title"
              type="text"
              label="Title"
              variant="outlined"
            />
          </Grid>

          <Grid item xs={6}>
            <TextField 
              id="date"
              type="date"
              label="Date"
              variant="outlined"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField 
              id="time"
              type="time"
              label="Start time"
              variant="outlined"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField 
              id="time"
              type="time"
              label="End time"
              variant="outlined"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={4}>
            <TextField 
              id="genre"
              type="text"
              label="Genre"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={4}>
            <TextField 
              id="price"
              type="number"
              label="Price"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={4}>
            <TextField 
              id="location"
              type="text"
              label="Location"
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12}>
            <ChipInput defaultValue={['Rammstein']} fullWidth />
          </Grid>

          <Grid item xs={12}>
            <TextareaAutosize 
              id="description"
              aria-label="description" 
              rowsMin={3} 
              placeholder="Description" 
            />
          </Grid>

        </Grid>
      </form>

    </>
  )
 
};