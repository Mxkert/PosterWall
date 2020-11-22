import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useForm, useFieldArray } from "react-hook-form";
import { FaCloudUploadAlt, FaTools, FaFileArchive, FileSignature, FaFileSignature, FaTimes } from 'react-icons/fa';
import axios from 'axios';
import moment from "moment";
import 'moment/locale/nl';

// Modal
import Modal from 'react-modal';
import '../Modal.css';

import './Listing.css';

import Grid from '@material-ui/core/Grid';
import '../Form.css';

import TextField from "@material-ui/core/TextField";
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import ChipInput from 'material-ui-chip-input';

export const Listing = () => {

  const { register, handleSubmit } = useForm();

  const [posters, setPosters] = useState([]);
  const [acts, setActs] = useState([]);

  useEffect(() => {
    axios.get(`/api/posters/`) 
    .then(res => {
      setPosters(res.data);
    });
  }, []);

  // Modal
  const customStyles = {
    content : {
      top                   : '50%',
      left                  : '50%',
      right                 : 'auto',
      bottom                : 'auto',
      marginRight           : '-50%',
      transform             : 'translate(-50%, -50%)',
      width                 : '70%'
    }
  };

  Modal.setAppElement('#root');

  const [modalIsOpen, setIsOpen] = useState(false);
  const [submitModalIsOpen, setSubmitModalOpen] = useState(false);
  const [posterInfo, setPosterInfo] = useState([]);
  
  const [toolsActive, setToolsActive] = useState(false);
  
  const showPosterInfo = (id) => {

    // Get poster detail information
    axios.get(`http://localhost:5000/api/posters/${id}`)
    .then(res => {
      setPosterInfo(res.data);
      console.log(res.data);
    });

    // Open the modal
    openModal();
  }

  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    
  }

  function closeModal(){
    setIsOpen(false);
  }

  // Submit modal
  const [picture, setPicture] = useState('https://via.placeholder.com/400x600');

  const onChangePicture = e => {
    console.log('picture: ', picture);
    setPicture(URL.createObjectURL(e.target.files[0]));
  };

  function openSubmitModal() {
    setSubmitModalOpen(true);
  }

  function closeSubmitModal(){
    setSubmitModalOpen(false);
  }

  // Add poster to the database
  const addPoster = (data) => {

    console.log(data);
    
    var currentDate =  moment().locale('nl').add(1, 'hours').format("YYYY-MM-DD HH:mm:ss");
    // var posterDate = moment(data.date + ' ' + data.time).locale('nl').add(1, 'hours').format('YYYY-MM-DD HH:mm:ss');

    const newPoster = {
      title: data.title,
      genre: data.genre,
      acts: acts,
      description: data.description,
      price: data.price,
      date: data.date,
      start_time: data.start_time,
      end_time: data.end_time,
      creation_date: currentDate,
      accepted: false,
      rejected: false
    };

    axios.post(`http://localhost:5000/api/posters/add`, newPoster)
    .then(res => {
      // getPosters();
      console.log(res.data);
    });

  }

  const handleChange = (data) => {
    setActs(data);
  }

  return (
    <>
      
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        portalClassName="modal"
        style={customStyles}
        contentLabel="Poster Detail"
      >

        <FaTimes className="modal-close" onClick={closeModal} />

        <div className="modal-body">
          <div className="detail-container">
            <div className="poster-image">
              <img src="https://via.placeholder.com/400x600" alt="" />
            </div>
            <div className="poster-content">
              <h2>{ posterInfo.title }</h2>
              <div className="meta">
                <span>20 March</span>
                <div className="event-time">
                  <span>20:00</span>
                  <span>03:00</span>
                </div>
                <div className="event-location">
                  <span>Konzerthaus</span>
                  <span>{ posterInfo.price }</span>
                </div>
              </div>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
            </div>
          </div>
        </div>

      </Modal>
      
      {/* Submit modal */}
      <Modal
        isOpen={submitModalIsOpen}
        onRequestClose={closeSubmitModal}
        portalClassName="modal"
        style={customStyles}
        contentLabel="Poster Detail"
      >

        <FaTimes className="modal-close" onClick={closeSubmitModal} />

        <div className="modal-body submit-modal">
          <div className="detail-container">
            <div className="poster-image">
              {/* <img src="https://via.placeholder.com/400x600" alt="" /> */}
              <input id="poster" type="file" onChange={onChangePicture}/>
              
              <img className="submitImg" src={picture} />
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

                  <Grid item xs={6}>
                    <TextField 
                      id="date"
                      name="date"
                      type="date"
                      label="Date"
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                      inputRef={register}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <TextField 
                      id="end_time"
                      name="end_time"
                      type="time"
                      label="Start time"
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                      inputRef={register}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <TextField 
                      id="start_time"
                      name="start_time"
                      type="time"
                      label="End time"
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                      inputRef={register}
                    />
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
                      inputRef={register}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <button type="submit">Submit</button>
                  </Grid>

                </Grid>
              </form>
            </div>
          </div>
        </div>

      </Modal>

      <div className="upload-icon">
        {/* <Link to="/submit"><FaCloudUploadAlt /></Link> */}
        <FaCloudUploadAlt onClick={() => openSubmitModal()} />
      </div>

      <div className="admin-tools">
        <div className={toolsActive ? `tools active` : `tools`}>
          <div className="tool">
            <Link to="/approve"><FaFileSignature /></Link>
            <div className="tool-label">
              <span>Approve</span>
            </div>
          </div>
          <div className="tool">
            <Link to="/archive"><FaFileArchive /></Link>
            <div className="tool-label">
              <span>Archive</span>
            </div>
          </div>
        </div>
        <div className='tool-icon' onClick={() => setToolsActive(!toolsActive)}>
          <FaTools />
        </div>
      </div>

      <div className="poster-container">

        <div className="poster-column">
          <div className="poster" onClick={() => showPosterInfo('5fb0f57d0e892b65c44faf40')}>
            <img src="https://d1csarkz8obe9u.cloudfront.net/posterpreviews/music-bar-event-invitation-poster-design-template-c1c895ef0f7f88038c4f246ec1c47caa_screen.jpg?ts=1566606628" alt="poster" />
          </div>
          <div className="poster">
            <img src="https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/f74f0073844443.5c1799952b78d.png" alt="poster" />
          </div>
          <div className="poster">
            <img src="https://cdnb.artstation.com/p/assets/images/images/015/878/767/large/fleur-sciortino-summer-book-fest-poster.jpg?1550014593" alt="poster" />
          </div>
          <div className="poster">
            <img src="https://images.template.net/4999/Free-Concert-Event-Poster-Template-440x570-1.jpg" alt="poster" />
          </div>
          <div className="poster">
            <img src="https://cdnb.artstation.com/p/assets/images/images/022/986/391/large/kriti-ranjan-event-poster-high.jpg?1577603206" alt="poster" />
          </div>
        </div>
        <div className="poster-column">
          <div className="poster">
            <img src="https://images.template.net/4999/Free-Concert-Event-Poster-Template-440x570-1.jpg" alt="poster" />
          </div>
          <div className="poster">
            <img src="https://cdnb.artstation.com/p/assets/images/images/022/986/391/large/kriti-ranjan-event-poster-high.jpg?1577603206" alt="poster" />
          </div>
          <div className="poster">
            <img src="https://d1csarkz8obe9u.cloudfront.net/posterpreviews/music-bar-event-invitation-poster-design-template-c1c895ef0f7f88038c4f246ec1c47caa_screen.jpg?ts=1566606628" alt="poster" />
          </div>
          <div className="poster">
            <img src="https://cdnb.artstation.com/p/assets/images/images/015/878/767/large/fleur-sciortino-summer-book-fest-poster.jpg?1550014593" alt="poster" />
          </div>
          <div className="poster">
            <img src="https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/f74f0073844443.5c1799952b78d.png" alt="poster" />
          </div>
        </div>
        <div className="poster-column">
          <div className="poster">
            <img src="https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/f74f0073844443.5c1799952b78d.png" alt="poster" />
          </div>
          <div className="poster">
            <img src="https://cdnb.artstation.com/p/assets/images/images/015/878/767/large/fleur-sciortino-summer-book-fest-poster.jpg?1550014593" alt="poster" />
          </div>
          <div className="poster">
            <img src="https://images.template.net/4999/Free-Concert-Event-Poster-Template-440x570-1.jpg" alt="poster" />
          </div>
          <div className="poster">
            <img src="https://cdnb.artstation.com/p/assets/images/images/022/986/391/large/kriti-ranjan-event-poster-high.jpg?1577603206" alt="poster" />
          </div>
          <div className="poster">
            <img src="https://d1csarkz8obe9u.cloudfront.net/posterpreviews/music-bar-event-invitation-poster-design-template-c1c895ef0f7f88038c4f246ec1c47caa_screen.jpg?ts=1566606628" alt="poster" />
          </div>
        </div>
        <div className="poster-column">
          <div className="poster">
            <img src="https://cdnb.artstation.com/p/assets/images/images/022/986/391/large/kriti-ranjan-event-poster-high.jpg?1577603206" alt="poster" />
          </div>
          <div className="poster">
            <img src="https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/f74f0073844443.5c1799952b78d.png" alt="poster" />
          </div>
          <div className="poster">
            <img src="https://d1csarkz8obe9u.cloudfront.net/posterpreviews/music-bar-event-invitation-poster-design-template-c1c895ef0f7f88038c4f246ec1c47caa_screen.jpg?ts=1566606628" alt="poster" />
          </div>
          <div className="poster">
            <img src="https://cdnb.artstation.com/p/assets/images/images/015/878/767/large/fleur-sciortino-summer-book-fest-poster.jpg?1550014593" alt="poster" />
          </div>
          <div className="poster">
            <img src="https://images.template.net/4999/Free-Concert-Event-Poster-Template-440x570-1.jpg" alt="poster" />
          </div>
        </div>
        <div className="poster-column">
          <div className="poster">
            <img src="https://images.template.net/4999/Free-Concert-Event-Poster-Template-440x570-1.jpg" alt="poster" />
          </div>
          <div className="poster">
            <img src="https://cdnb.artstation.com/p/assets/images/images/015/878/767/large/fleur-sciortino-summer-book-fest-poster.jpg?1550014593" alt="poster" />
          </div>
          <div className="poster">
            <img src="https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/f74f0073844443.5c1799952b78d.png" alt="poster" />
          </div>
          <div className="poster">
            <img src="https://cdnb.artstation.com/p/assets/images/images/022/986/391/large/kriti-ranjan-event-poster-high.jpg?1577603206" alt="poster" />
          </div>
          <div className="poster">
            <img src="https://d1csarkz8obe9u.cloudfront.net/posterpreviews/music-bar-event-invitation-poster-design-template-c1c895ef0f7f88038c4f246ec1c47caa_screen.jpg?ts=1566606628" alt="poster" />
          </div>
        </div>
        
      </div>

    </>
  )
 
};