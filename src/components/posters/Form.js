import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray } from "react-hook-form";
import { Redirect } from 'react-router-dom';

import axios from 'axios';
import moment from "moment";
import 'moment/locale/nl';

import '../../Typography.css';
import '../Form.css';

import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";

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
        <TextField
          id="email"
          label="Type here"
          variant="outlined"
          color="secondary"
        />
        <TextField
          id="email"
          label="Type here"
          variant="outlined"
          color="secondary"
        />
      </form>

      <form onSubmit={handleSubmit()}>

        <div className="form-group">
          <input className="form-control" type="text" name="title" ref={register()} placeholder="Title" />
        </div>
        <div className="form-group">
          <input className="form-control" type="text" name="genre" ref={register()} placeholder="Genre" />
        </div>
        <div className="form-group">
          <textarea className="form-control" name="description" ref={register()} placeholder="Description"></textarea>
        </div>
        <div className="form-group">
          <input className="form-control" type="number" name="price" ref={register()} placeholder="Price" />
        </div>

        <button className="btn" type="submit">Submit poster</button>
      </form>

    </>
  )
 
};