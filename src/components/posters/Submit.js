import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { useForm, useFieldArray } from "react-hook-form";
import { FaCheck, FaTimes, FaLongArrowAltRight } from 'react-icons/fa';
import axios from 'axios';
import moment from "moment";
import 'moment/locale/nl';

export const Submit = () => {

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const handleChange = event => {
     setSearchTerm(event.target.value);
   };

  const { handleSubmit, register, errors } = useForm();

  const [posters, setPosters] = useState([]);
  const [posterID, setPosterID] = useState(null);

  useEffect(() => {
    getPosters();
  }, []);

  useEffect(() => {
    const results = posters.filter(poster =>
      poster.title.toLowerCase().includes(searchTerm)
    );
    setSearchResults(results);
  }, [searchTerm]);

  const getPosters = () => {
    setPosters([]);

    axios.get(`http://localhost:5000/api/posters/`)
    .then(res => {
      setPosters(res.data);
      setSearchResults(res.data);
      posters.sort((a, b) => (a.creation_date > b.creation_date) ? 1 : -1)
    });
  }

  // Add poster to the database
  const addPoster = (data) => {

    console.log(data);
    
    var currentDate =  moment().locale('nl').add(1, 'hours').format("YYYY-MM-DD HH:mm:ss");
    // var posterDate = moment(data.date + ' ' + data.time).locale('nl').add(1, 'hours').format('YYYY-MM-DD HH:mm:ss');

    const newPoster = {
      title: data.title,
      genre: data.genre,
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
      getPosters();
    });
  }

  const acceptPoster = (id) => {
    axios.put(`http://localhost:5000/api/posters/accept/${id}`)
    .then(res => {
      getPosters();
    });
  }

  const rejectPoster = (id) => {
    axios.put(`http://localhost:5000/api/posters/reject/${id}`)
    .then(res => {
      getPosters();
    });
  }

  const deletePoster = (id) => {
    axios.put(`http://localhost:5000/api/posters/delete/${id}`)
    .then(res => {
      getPosters();
    });
  }

  const editPoster = (id) => {
    axios.put(`http://localhost:5000/api/posters/reject/${id}`)
    .then(res => {
      getPosters();
    });
  }

  return (
    <div style={{ display: 'flex' }}>

      { posterID ? <Redirect to={`/poster/${posterID}`} /> : null }

      <div style={{ marginRight: '90px' }}>
        <h2>Submit a poster</h2>

        <form onSubmit={handleSubmit(addPoster)}>

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
          <div className="form-group">
            <input className="form-control" type="date" name="date" ref={register()} placeholder="Date" />
          </div>
          <div className="form-group">
            <input className="form-control" type="time" name="start_time" ref={register()} placeholder="Start time" />
          </div>
          <div className="form-group">
            <input className="form-control" type="time" name="end_time" ref={register()} placeholder="End time" />
          </div>

          <button type="submit">Submit</button>
        </form>
      </div>

      <div style={{ marginRight: '90px' }}>
        <h2>Posters not yet accepted</h2>
        { posters.map((poster, index) => (
          poster.accepted === false && poster.rejected === false ? (

            <div className="poster" key={index}>
              <div className="item-desc">
                <h4>{poster.title}</h4>
                <button onClick={() => acceptPoster(poster._id)}>Accept</button>
                <button onClick={() => setPosterID(poster._id)}>Edit</button>
                <button onClick={() => rejectPoster(poster._id)}>Reject</button>
              </div>
            </div>

          ) : null 
        )) }
      </div>

      <div style={{ marginRight: '90px' }}>
        <h2>Posters accepted</h2>
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={handleChange}
        />

        {searchResults.map((poster, index) => (
          poster.accepted !== false ? (

            <div className="poster" key={index}>
              <div className="item-desc">
                <h4>{poster.title}</h4>
                <button onClick={() => deletePoster(poster._id)}>Delete</button>
              </div>
            </div>

          ) : null 
       ))}
      </div>

      <div style={{ marginRight: '90px' }}>
        <h2>Posters rejected</h2>
        { posters.map((poster, index) => (
          poster.rejected === true ? (

            <div className="poster" key={index}>
              <div className="item-desc">
                <h4>{poster.title}</h4>
              </div>
            </div>

          ) : null 
        )) }
      </div>

      <div style={{ marginRight: '90px' }}>
        <h2>Posters archived</h2>
        { posters.map((poster, index) => (
          poster.rejected === true ? (

            <div className="poster" key={index}>
              <div className="item-desc">
                <h4>{poster.title}</h4>
              </div>
            </div>

          ) : null 
        )) }
      </div>

    </div>
  )
 
};