import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { useForm, useFieldArray } from "react-hook-form";
import { FaCheck, FaTimes, FaLongArrowAltRight } from 'react-icons/fa';
import axios from 'axios';
import moment from "moment";
import 'moment/locale/nl';

export const Archive = () => {

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const handleChange = event => {
     setSearchTerm(event.target.value);
   };

  const { handleSubmit, register, errors } = useForm();

  const [posters, setPosters] = useState([]);
  const [posterID, setPosterID] = useState(null);

  const [currentDate, setCurrentDate] = useState(null);

  useEffect(() => {
    getPosters();
    getCurrentDate();
  }, []);

  useEffect(() => {
    const results = posters.filter(poster =>
      poster.title.toLowerCase().includes(searchTerm)
    );
    setSearchResults(results);
  }, [searchTerm]);

  const getCurrentDate = () => {
    setCurrentDate(moment().locale('nl').format("YYYY-MM-DD"));
  }

  const getPosters = () => {
    setPosters([]);

    axios.get(`http://localhost:5000/api/posters/`)
    .then(res => {
      var allPosters = res.data;
      allPosters.map(poster => {
        poster.date = moment(poster.date).locale('nl').format("YYYY-MM-DD");
        setPosters(posters => [...posters, poster] );
      });
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
        <h2>Posters accepted</h2>
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={handleChange}
        />

        {searchResults.map((poster, index) => (
          poster.accepted !== false && poster.date < currentDate ? (

            <div className="poster" key={index}>
              <div className="item-desc">
                <h4>{poster.title} {poster.date}</h4>
                <button onClick={() => deletePoster(poster._id)}>Delete</button>
              </div>
            </div>

          ) : null 
       ))}
      </div>

    </div>
  )
 
};