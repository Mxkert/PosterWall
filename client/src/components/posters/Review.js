import React, { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import axios from 'axios';
import { FaTimes, FaCheck, FaDoorClosed, FaTrashAlt } from 'react-icons/fa';
import moment from 'moment';
import 'moment/locale/nl';

import './Posters.css';

import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';

import Masonry from 'react-masonry-css'

import TextField from "@material-ui/core/TextField";
import { Tooltip } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import ChipInput from 'material-ui-chip-input';

import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';

import { AdminTools } from '../widgets/AdminTools';

export const Review = ({user}) => {

  const breakpointColumnsObj = {
    default: 5,
    991: 4,
    768: 3,
    500: 2
  };

  const [acts, setActs] = useState([]);

  const { register, handleSubmit } = useForm();

  const [posterTitle, setPosterTitle] = useState('');
  const [posterId, setPosterId] = useState('');

  const [posters, setPosters] = useState([]);

  const [posterInfo, setPosterInfo] = useState({});
  const [posterDetailOpened, setPosterDetailOpened] = useState(false);
  
  // const [selectedDate, setDate] = useState(moment().format("YYYY-MM-DD"));
  const [selectedStartTime, setSelectedStartTime] = useState(moment());
  const [selectedEndTime, setSelectedEndTime] = useState(moment());
  const [descriptionValue, setDescriptionValue] = useState('');

  // const onDateChange = (date, value) => {
  //   setDate(date);
  //   console.log(date);
  //   console.log(value);
  // };

  const handleStartTime = (time) => {
    console.log(time);
    setSelectedStartTime(time);
  };

  const handleEndTime = (time) => {
    setSelectedEndTime(time);
  };

  const handleDescription = (event) => {
    setDescriptionValue(event.target.value);
  };

  // Submit modal
  const [pictureURL, setPictureURL] = useState('');

  // Get all posters and store them in an array
  const getPosters = () => {
    // Empty the arrays
    setPosters([]);
    // Get posters
    axios.get(`/api/posters/not-accepted`)
    .then(res => {
      let posters = [];
      posters = res.data;
      posters.sort((a, b) => (a.creation_date > b.creation_date) ? 1 : -1)

      posters.forEach((poster, index) => {
        setPosters(posters => [...posters, poster]);
      });
    });
  }

  // Get posters on page load
  useEffect(() => {
    getPosters();
  }, []);

  const showPosterInfo = (id) => {
    // Get poster detail information
    axios.get(`/api/posters/${id}`)
    .then(res => {
      setPosterInfo(res.data);
      setPosterDetailOpened(true);
      setPictureURL(res.data.image);

      // Set acts as chips from data
      setActs([]);
      res.data.acts.forEach(act => {
        setActs(acts => [...acts, act] );
      });

      setPosterId(res.data._id);
      setPosterTitle(res.data.title);
    });
  }

  const acceptPoster = (id) => {
    axios.put(`/api/posters/accept/${id}`)
    .then(res => {
      getPosters();
      setPosterDetailOpened(false);
    });
  }

  const rejectPoster = (id) => {
    axios.put(`/api/posters/reject/${id}`)
    .then(res => {
      getPosters();
      setPosterDetailOpened(false);
    });
  }

  const deletePoster = (id) => {
    axios.put(`/api/posters/delete/${id}`)
    .then(res => {
      getPosters();
      setPosterDetailOpened(false);
    });
  }

  // Add poster to the database
  const editPoster = async (data) => {

    const id = data.poster_id;
    
    let CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dk9dh4jbu/upload';

    const fd = new FormData();
    fd.append('file', pictureURL);
    fd.append('upload_preset', 'testing');
    fd.append('cloud_name', 'dk9dh4jbu');

    try {
      const config = {
        headers: { "X-Requested-With": "XMLHttpRequest" },
      };
            
      let result = await axios.post(CLOUDINARY_URL, fd, config);
      console.log(result.data.url);
    
      var currentDate =  moment().locale('nl').add(1, 'hours').format("YYYY-MM-DD HH:mm:ss");
 
      const newPoster = {
        image: result.data.url,
        title: data.title,
        genre: data.genre,
        acts: acts,
        description: descriptionValue,
        price: data.price,
        date: data.date,
        start_time: data.start_time,
        end_time: data.end_time,
        creation_date: currentDate,
        accepted: false,
        rejected: false
      };
  
      axios.post(`/api/posters/edit/${id}`, newPoster)
      .then(res => {
        // getPosters();
        console.log(res.data);
        setPictureURL('');
        setPosterDetailOpened(false);
      });

    } catch(err) {
        console.log(err);
    }

  }

  const handleChange = (data) => {
    setActs(acts => [...acts, data] );
  }

  return (
    <>
      <div className={ posterDetailOpened ? 'slide-out slide-out-detail opened' : 'slide-out slide-out-detail'}>

        { posterInfo ?
        <>
          <div className="blurred-bg" onClick={() => setPosterDetailOpened(false)}></div>

          <FaTimes className="modal-close-btn" onClick={() => setPosterDetailOpened(false)} />

          <div className="modal-body detail-modal">
            <div className="detail-container">
              <div className="poster-image">
                <img src={ pictureURL } alt={ posterInfo.title } />
              </div>
              <div className="poster-content">
                
                <form noValidate onSubmit={handleSubmit(editPoster)}>
                  <Grid container spacing={3} justify="center">

                    <Grid item xs={12}>
                      <div className="action-buttons">
                        <Tooltip title="Accept" class="btn action-btn btn-success" onClick={() => acceptPoster(posterInfo._id)}>
                          <IconButton aria-label="accept">
                            <FaCheck />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Reject" class="btn action-btn btn-reject" onClick={() => rejectPoster(posterInfo._id)}>
                          <IconButton aria-label="reject">
                            <FaDoorClosed />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete" class="btn action-btn btn-delete" onClick={() => deletePoster(posterInfo._id)}>
                          <IconButton aria-label="delete">
                            <FaTrashAlt />
                          </IconButton>
                        </Tooltip>
                      </div>
                    </Grid>

                    <Grid item xs={12}>
                      <TextField 
                        id="title"
                        name="title"
                        type="text"
                        label="Title"
                        variant="outlined"
                        inputRef={register}
                        value={posterTitle}
                        onChange={e => setPosterTitle(e.target.value)}
                      />
                    </Grid>

                    <Grid item xs={4}>
                      <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker
                          className="date-picker"
                          id="date"
                          name="date"
                          showTodayButton={true}
                          value={moment(posterInfo.date).format("YYYY-MM-DD")}
                          format="yyyy-MM-dd"
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
                        InputLabelProps={{ shrink: true }}
                        value={posterInfo.genre}
                        onChange={e => setPosterInfo({'genre': e.target.value})}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <TextField 
                        id="price"
                        name="price"
                        type="number"
                        label="Price"
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                        inputRef={register}
                        value={posterInfo.price}
                        onChange={e => setPosterInfo({'price': e.target.value})}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <TextField 
                        id="location"
                        name="location"
                        type="text"
                        label="Location"
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                        inputRef={register}
                        value={posterInfo.location}
                        onChange={e => setPosterInfo({'location': e.target.value})}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <ChipInput 
                        id="acts" 
                        name="acts" 
                        placeholder="Acts"
                        inputRef={register}
                        fullWidth
                        value={acts}
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
                        inputRef={register}
                        value={posterInfo.description}
                        onChange={handleDescription}
                      />
                    </Grid>

                    <TextField 
                      id="poster_id"
                      name="poster_id"
                      type="hidden"
                      inputRef={register}
                      value={posterId}
                      onChange={e => setPosterId(e.target.value)}
                      style={{ opacity: '0' }}
                    />

                    <Grid item xs={12}>
                      <button class="btn" type="submit" style={{ width: '100%' }}>Update poster</button>
                    </Grid>

                  </Grid>
                </form>

              </div>
            </div>
          </div>
        </>
        : null }
      </div>

      <Container maxWidth="md">

        <div className="page-header" style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h1>Events to review</h1>
        </div>

        <AdminTools />

        { posters.length ?
        // There are posters in the array
          
          <Masonry
          breakpointCols={breakpointColumnsObj}
          className="my-masonry-grid poster-column"
          columnClassName="my-masonry-grid_column"
        >

          { posters.map((poster, index) => {
            return (
              <div className="poster" onClick={() => showPosterInfo(poster._id)} key={index}>
                <img src={poster.image} alt={poster.title} />
              </div>
            )
          }) }

        </Masonry>

        :

        <Grid container spacing={1} justify="center">
          <h1>No events to review</h1>
        </Grid>

        }
      </Container>
    </>
  )

}