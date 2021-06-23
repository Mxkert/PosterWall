import React, { useEffect, useState, useRef } from 'react';
import { useForm } from "react-hook-form";
import { FaTimes, FaFileAlt } from 'react-icons/fa';
import axios from 'axios';
import moment from 'moment';
// import 'moment/locale/nl';

// import LocationAutocomplete from 'location-autocomplete';
import LocationField from '../LocationAutocomplete';

// Google Maps
import { GoogleMap, useJsApiLoader, Circle, Marker, StandaloneSearchBox } from '@react-google-maps/api';

import Grid from '@material-ui/core/Grid';
import '../forms/SubmitForm.css';
import '../Form.css';

// Import loading icon from Lottie
import SuccessIcon from "../animations/SuccessIcon";

import TextField from "@material-ui/core/TextField";
import OutlinedInput from "@material-ui/core/OutlinedInput";
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
  const [picture, setPicture] = useState('https://www.genius100visions.com/wp-content/uploads/2017/09/placeholder-vertical.jpg');
  const [pictureURL, setPictureURL] = useState('');

  const [success, setSuccess] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [posterError, setPosterError] = useState(null);
  const [descriptionValue, setDescriptionValue] = useState('');

  const [pickerOpen, setPickerOpen] = useState(false);

  const [uploadingImage, setUploadingImage] = useState(false);
  const [addingPoster, setAddingPoster] = useState(false);
  
  const [selectedDate, setDate] = useState(moment().format("YYYY-MM-DD"));
  const [selectedStartTime, setSelectedStartTime] = useState(moment());
  const [selectedEndTime, setSelectedEndTime] = useState(moment());

  const [selectedLocation, setSelectedLocation] = useState('');

  const searchBox = useRef(null);

  const onPlacesChanged = async () => {
    let place = searchBox.current.state.searchBox.gm_accessors_.places;

    let x = 0;
    for(var k in place) {
      if (x < 1) {
        place = place[k].formattedPrediction;
      }
      x++;
    }

    console.log(place);
    setSelectedLocation(place);
  }; 

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    libraries: ['places'],
    googleMapsApiKey: 'AIzaSyAKQm69QiWowY9VPExD9xjJBN68FeAeEA0'
  })

  const onDateChange = (date, value) => {
    setDate(date);
    console.log(date);
    console.log(value);
    setTimeout(() => setPickerOpen(false), 1000);
  };

  const handleStartTime = (time) => {
    console.log(time);
    setSelectedStartTime(time);
    setTimeout(() => setPickerOpen(false), 1000);
  };

  const handleEndTime = (time) => {
    setSelectedEndTime(time);
    setTimeout(() => setPickerOpen(false), 1000);
  };

  const onChangePicture = async e => {

    setPicture(URL.createObjectURL(e.target.files[0]));
    setPictureURL(e.target.files[0]);
  };

  const handleDescription = (event) => {
    setDescriptionValue(event.target.value);
    console.log(event.target.value);
  };

  // Set modal opened
  useEffect(() => {
    console.log(selectedDate);
    setIsOpen(formIsOpen);
  }, [formIsOpen]);

  useEffect(() => {
    setIsOpen(props.open);
  }, [props.open]);

  const ref = useRef();

  // useOutsideClick(ref, () => (
  //   pickerOpen ?
  //     null
  //   : formIsOpen ? setIsOpen(false) : null 
  // ));

  // Add poster to the database
  const addPoster = async (data) => {

    // Place location in a variable
    var location = selectedLocation;
    
    // Get latitude and longitude using the Google Geocoding API
    let locationDetails = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${selectedLocation}&key=AIzaSyAKQm69QiWowY9VPExD9xjJBN68FeAeEA0`);
    const locationLat = locationDetails.data.results[0].geometry.location.lat
    const locationLng = locationDetails.data.results[0].geometry.location.lng

    // Start image upload
    try {

      setUploadingImage(true);

      if (pictureURL === '') {
        setPosterError('Please upload a poster before submitting the form.')
        setUploadingImage(false);
        return;
      }

      let CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dk9dh4jbu/upload';
  
      const fd = new FormData();
      fd.append('file', pictureURL);
      fd.append('upload_preset', 'testing');
      fd.append('cloud_name', 'dk9dh4jbu');

      const config = {
        headers: { "X-Requested-With": "XMLHttpRequest" },
      };

      let result = await axios.post(CLOUDINARY_URL, fd, config);

      // Start API call
        setAddingPoster(true);
        
        var currentDate =  moment().locale('nl').add(1, 'hours').format("YYYY-MM-DD HH:mm:ss");
        var eventDate =  moment(data.date).format("YYYY-MM-DD HH:mm:ss");

        console.log(descriptionValue);

        const newPoster = {
          image: result.data.url,
          title: data.title,
          genre: data.genre,
          acts: acts,
          description: descriptionValue,
          price: data.price,
          date: eventDate,
          location: selectedLocation,
          location_lat: locationLat,
          location_lng: locationLng,
          start_time: data.start_time,
          end_time: data.end_time,
          creation_date: currentDate,
          accepted: false,
          rejected: false
        };
    
        axios.post(`/api/posters/add`, newPoster)
        .then(res => { 
          console.log(res.data);
          setAddingPoster(false);
          setSuccess(true);
          props.action(true);

          setTimeout(() => {
            setIsOpen(false);
            setSuccess(false);
          }, 2500);
        })
        .catch(error => {
          console.log(error);
          setAddingPoster(false);
          setPosterError('There was an error submitting the event. Please try again.')
        });

      setAddingPoster(false);
    
    // Image upload failed
    } catch (err) {
      setUploadingImage(false);
      setUploadError('There was an error uploading the poster. Please try again.')
    }
    
    setUploadingImage(false);
    
  }

  const handleChange = (data) => {
    setActs(data);
  }

  function onDropdownSelect(component) {
    // this will give you access to the entire location object, including
    // the `place_id` and `address_components`
    const place = component.autocomplete.getPlace();
    const selectedPlace = place.formatted_address;
  
    // other awesome stuff
    setSelectedLocation(selectedPlace);
  }

  return (
    <div className={ formIsOpen ? 'slide-out slide-out-form opened' : 'slide-out slide-out-form' }>

      <>
        <FaTimes className="modal-close-btn" onClick={() => setIsOpen(false)} />

        <div className="blurred-bg" onClick={() => setIsOpen(false)}></div>

        <div className="modal-body submit-modal">

          { success ?
            <div className="icon-screen">
              <SuccessIcon />
              <p>The event has succesfully been submitted.</p>
            </div>
          :
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
                      <FaFileAlt style={{ opacity: '0' }} />
                  }
                  <input id="poster" type="file" onChange={onChangePicture} />
                </label>
              </div>
              
              <img className="submitImg" src={picture} alt="" />
                  <small style={{ color: `#fff`, fontSize: `18px` }}>Max. file size is 10MB</small>
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

                  <Grid item md={6} xs={6}>
                    <TextField 
                      id="genre"
                      name="genre"
                      type="text"
                      label="Genre"
                      variant="outlined"
                      inputRef={register}
                    />
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <KeyboardDatePicker
                        className="date-picker"
                        id="date"
                        name="date"
                        showTodayButton={true}
                        value={selectedDate}
                        format="yyyy-MM-dd"
                        onOpen={() => setPickerOpen(true)}
                        onChange={onDateChange}
                        KeyboardButtonProps={{
                          'aria-label': 'change date',
                        }}
                        inputRef={register}
                        variant="outlined"
                       
                      />
                    </MuiPickersUtilsProvider>
                  </Grid>
                  <Grid item md={4} xs={6}>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <KeyboardTimePicker
                        ampm={false}
                        id="start_time"
                        name="start_time"
                        value={selectedStartTime}
                        onChange={handleStartTime}
                        onOpen={() => setPickerOpen(true)}
                        KeyboardButtonProps={{
                          'aria-label': 'change time',
                        }}
                        inputRef={register}
                        variant="outlined"
                       
                      />
                    </MuiPickersUtilsProvider>
                  </Grid>
                  <Grid item md={4} xs={6}>
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

                  <Grid item md={4} xs={6}>
                    <TextField 
                      id="price"
                      name="price"
                      type="number"
                      label="Price"
                      variant="outlined"
                      inputRef={register}
                    />
                  </Grid>
                  {/* <Grid item md={4} xs={12}>
                    <TextField 
                      id="location"
                      name="location"
                      type="text"
                      label="Location"
                      variant="outlined"
                      inputRef={register}
                    />
                  </Grid> */}
                  
                  <Grid item xs={12}>
                    <div>
                      {/* <LocationAutocomplete
                        id="location"
                        name="location"
                        placeholder="Location"
                        locationType="(regions)"
                        googleAPIKey="AIzaSyAKQm69QiWowY9VPExD9xjJBN68FeAeEA0"
                        onDropdownSelect={(e) => onDropdownSelect(e)}
                      /> */}
                      {/* <LocationField
                        locationType="regions"
                        onDropdownSelect={(e) => onDropdownSelect(e)}
                      /> */}
                 { isLoaded ? (
                   <>
                      <StandaloneSearchBox
                        // onLoad={onSearchboxLoad}
                        onPlacesChanged={onPlacesChanged}
                        ref={searchBox}  
                      >
                        <input
                          type="text"
                          placeholder="Location"
                          style={{
                            boxSizing: `border-box`,
                            border: `1px solid transparent`,
                            padding: `0px 12px`,
                            borderRadius: `3px`,
                            boxShadow: `rgb(0 0 0 / 30%) 0px 2px 6px`,
                            fontSize: `14px`,
                            outline: `none`,
                            padding: `28px 14px !important`,
                            height: `1.1876em`,
                            marginRight: `0 !important`,
                            boxShadow: `0px 14px 24px rgb(0 0 0 / 70%)`,
                            background: `rgba(0,0,0,0.75) !important`,
                            borderRadius: `6px`,
                            padding: `20px 14px !important`,
                            border: `1px solid rgba(255,255,255,0.25) !important`,
                            borderColor: `rgba(255,255,255,0.25) !important`,
                            height: `60px`,
                            width: `100%`
                          }}
                        />
                      </StandaloneSearchBox>
                      </>
                 ) : null }
                    </div>
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
                 
                    <OutlinedInput 
                      inputComponent={TextareaAutosize} 
                      id="description"
                      name="description"
                      aria-label="description" 
                      rowsMin={3} 
                      placeholder="Description" 
                      ref={register}
                      value={descriptionValue}
                      onChange={handleDescription}
                      style={{ width: '100%' }}
                    />
                  </Grid>

                  { uploadError ?
                  <Grid item xs={12}>
                    <p style={{ margin: '0' }}>{ uploadError }</p>
                  </Grid>
                  : null }

                  { posterError ?
                  <Grid item xs={12}>
                    <p style={{ margin: '0' }}>{ posterError }</p>
                  </Grid>
                  : null }

                  <Grid item xs={12}>
                      { uploadingImage === true ? 
                      <button disabled className="btn" type="submit" style={{ width: '100%' }}>
                        Submitting event...
                      </button>
                      : null }
                      { addingPoster === true ? 
                      <button disabled className="btn" type="submit" style={{ width: '100%' }}>
                        Submitting event...
                      </button>
                      : null }
                      { addingPoster === false && uploadingImage === false ? 
                      <button className="btn" type="submit" style={{ width: '100%' }}>
                        Submit
                      </button>
                      : null }
                  </Grid>

                </Grid>
              </form>
            </div>
          </div>
          }
        </div>
      </>

    </div>
  );
}