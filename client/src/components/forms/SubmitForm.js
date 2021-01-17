import React, { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import { FaTimes, FaFileAlt } from 'react-icons/fa';
import axios from 'axios';
import moment from 'moment';
// import 'moment/locale/nl';

import Grid from '@material-ui/core/Grid';
import '../forms/SubmitForm.css';
import '../Form.css';

// Import loading icon from Lottie
import SuccessIcon from "../animations/SuccessIcon";

import TextField from "@material-ui/core/TextField";
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import ChipInput from 'material-ui-chip-input';

import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';

export const SubmitForm = (props) => {

  const [acts, setActs] = useState([]);

  const { register, handleSubmit } = useForm();

  const [formIsOpen, setIsOpen] = useState(false);

  // Submit modal
  const [picture, setPicture] = useState('https://via.placeholder.com/400x600');
  const [pictureURL, setPictureURL] = useState('');

  const [success, setSuccess] = useState(false);
  const [checking, setCheck] = useState(false);
  const [error, setError] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  
  const [selectedDate, setDate] = useState(moment().format("YYYY-MM-DD"));
  const [selectedStartTime, setSelectedStartTime] = useState(moment());
  const [selectedEndTime, setSelectedEndTime] = useState(moment());

  const onDateChange = (date, value) => {
    setDate(date);
    console.log(date);
    console.log(value);
  };

  const handleStartTime = (time) => {
    console.log(time);
    setSelectedStartTime(time);
  };

  const handleEndTime = (time) => {
    setSelectedEndTime(time);
  };

  const onChangePicture = async e => {

    setPicture(URL.createObjectURL(e.target.files[0]));
    setPictureURL(e.target.files[0]);
  };

  // Set modal opened
  useEffect(() => {
    console.log(selectedDate);
    setIsOpen(formIsOpen);
  }, [formIsOpen]);

  useEffect(() => {
    setIsOpen(props.open);
  }, [props.open]);

  // Add poster to the database
  const addPoster = async (data) => {

    console.log(data);
    console.log(data.description);

    setCheck(true);

    let CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dk9dh4jbu/upload';

    const fd = new FormData();
    fd.append('file', pictureURL);
    fd.append('upload_preset', 'testing');
    fd.append('cloud_name', 'dk9dh4jbu');

    try {
      const config = {
        headers: { "X-Requested-With": "XMLHttpRequest" },
      };
            
      try {
        let result = await axios.post(CLOUDINARY_URL, fd, config);
        console.log(result.data.url);

        if (!result) {
          setUploadError('There was error uploading the poster')
        }
    
        var currentDate =  moment().locale('nl').add(1, 'hours').format("YYYY-MM-DD HH:mm:ss");
        var eventDate =  moment(data.date).format("YYYY-MM-DD HH:mm:ss");
   
        const newPoster = {
          image: result.data.url,
          title: data.title,
          genre: data.genre,
          acts: acts,
          description: data.description,
          price: data.price,
          date: eventDate,
          location: data.location,
          start_time: data.start_time,
          end_time: data.end_time,
          creation_date: currentDate,
          accepted: false,
          rejected: false
        };

        console.log(eventDate);
    
        axios.post(`/api/posters/add`, newPoster)
        .then(res => {
          // getPosters();
          console.log(res.data);
          setPicture('');
          setPictureURL('');
          setSuccess(true);
        })
        .then(res => {
          setTimeout(() => {
            setIsOpen(false);
            setSuccess(false);
          }, 1500);
        });

      // Image could not be uploaded
      } catch (err) {
        console.log(err);
      }

    } catch(err) {
        console.log(err);
        setSuccess(false);
        setError(err);
        console.log(err);
    }

  }

  const handleChange = (data) => {
    setActs(data);
  }

  return (
    <div className={ formIsOpen ? 'slide-out slide-out-form opened' : 'slide-out slide-out-form' }>

      { success ?
        <div className="icon-screen">
          <SuccessIcon />
          <p>The poster has succesfully been uploaded.</p>
          { error ? error : null }
        </div>
      :

      <>
        <FaTimes className="modal-close-btn" onClick={() => setIsOpen(false)} />

        <div className="blurred-bg"></div>

        <div className="modal-body submit-modal">
          <div className="detail-container">
            <div className="poster-image">
              {/* <img src="https://via.placeholder.com/400x600" alt="" /> */}
              {/* <input id="poster" type="file" onChange={onChangePicture}/> */}
              <div className="upload-btn">
                <label className="filelabel">
                  { 
                    pictureURL ? 
                      <FaFileAlt style={{ opacity: '0' }} />
                    :
                      <FaFileAlt />
                  }
                  <input id="poster" type="file" onChange={onChangePicture} />
                </label>
              </div>
              
              <img className="submitImg" src={picture} alt="" />
            </div>
            <div className="poster-content">
              <form noValidate onSubmit={handleSubmit(addPoster)}>
                <Grid container spacing={3} justify="center">
                  <Grid item xs={12}>
                    <TextField 
                      id="title"
                      name="title"
                      type="text"
                      label="Title"
                      variant="outlined"
                      inputRef={register}
                    />
                  </Grid>

                  <Grid item xs={4}>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <KeyboardDatePicker
                        className="date-picker"
                        id="date"
                        name="date"
                        showTodayButton={true}
                        value={selectedDate}
                        format="yyyy-MM-dd"
                        onChange={onDateChange}
                        KeyboardButtonProps={{
                          'aria-label': 'change date',
                        }}
                        inputRef={register}
                        variant="outlined"
                      />
                    </MuiPickersUtilsProvider>
                  </Grid>
                  <Grid item xs={4}>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <KeyboardTimePicker
                        ampm={false}
                        id="start_time"
                        name="start_time"
                        value={selectedStartTime}
                        onChange={handleStartTime}
                        KeyboardButtonProps={{
                          'aria-label': 'change time',
                        }}
                        inputRef={register}
                        variant="outlined"
                      />
                    </MuiPickersUtilsProvider>
                  </Grid>
                  <Grid item xs={4}>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <KeyboardTimePicker
                        ampm={false}
                        id="end_time"
                        name="end_time"
                        value={selectedEndTime}
                        onChange={handleEndTime}
                        KeyboardButtonProps={{
                          'aria-label': 'change time',
                        }}
                        inputRef={register}
                        variant="outlined"
                      />
                    </MuiPickersUtilsProvider>
                  </Grid>

                  <Grid item xs={4}>
                    <TextField 
                      id="genre"
                      name="genre"
                      type="text"
                      label="Genre"
                      variant="outlined"
                      inputRef={register}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField 
                      id="price"
                      name="price"
                      type="number"
                      label="Price"
                      variant="outlined"
                      inputRef={register}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField 
                      id="location"
                      name="location"
                      type="text"
                      label="Location"
                      variant="outlined"
                      inputRef={register}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <ChipInput 
                      id="acts" 
                      name="acts" 
                      placeholder="Acts"
                      inputRef={register}
                      fullWidth
                      onChange={(chips) => handleChange(chips)}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextareaAutosize 
                      id="description"
                      name="description"
                      aria-label="description" 
                      rowsMin={3} 
                      placeholder="Description" 
                      ref={register}
                    />
                  </Grid>

                  <Grid item xs={12}>
                  </Grid>

                  <Grid item xs={12}>
                    { checking ? uploadError : null }
                    <button className="btn" type="submit" style={{ width: '100%' }}>Submit</button>
                  </Grid>

                </Grid>
              </form>
            </div>
          </div>
        </div>
      </>
    }

    </div>
  );
}