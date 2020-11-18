import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray } from "react-hook-form";
import { Redirect } from 'react-router-dom';
import { useParams } from "react-router";

import axios from 'axios';
import moment from "moment";
import 'moment/locale/nl';

export const Poster = () => {

  const { handleSubmit, register, errors } = useForm();

  const [posterEdited, setPosterEdited] = useState(false);

  const [poster, setPoster] = useState([]);
  const [posterDate, setPosterDate] = useState([]);
  const [posterTime, setPosterTime] = useState([]);

  // Get ID from URL-parameter
  let { id } = useParams();

  useEffect(() => {
    getPoster(id);
  }, []);

  const getPoster = (id) => {
    axios.get(`http://localhost:5000/api/posters/${id}`)
    .then(res => {
      setPoster(res.data);

      var posterDate = moment(res.data.date).locale('nl').format('DD-MM-YYYY');
      var posterTime = moment(res.data.date).locale('nl').subtract(1, 'hours').format('HH:mm');

      setPosterDate(posterDate);
      setPosterTime(posterTime);
    });
  }

  const editPoster = (data) => {

    const editedPoster = {
      _id: id,
      title: data.title,
      genre: data.genre,
      description: data.description,
      price: data.price
    };

    axios.put(`http://localhost:5000/api/posters/edit/${id}`, editedPoster)
    .then(res => {
      setPosterEdited(true);
    });
  }

  return (
    <div style={{ display: 'flex' }}>

    { posterEdited ? <Redirect to={`/submit`} /> : null }

      <div style={{ marginRight: '90px' }}>
        <h2>Submit a poster</h2>

        <form onSubmit={handleSubmit(editPoster)}>

          <div className="form-group">
            <input type="text" name="title" ref={register()} defaultValue={ poster.title } />
          </div>
          <div className="form-group">
            <input type="text" name="genre" ref={register()} defaultValue={ poster.genre } />
          </div>
          <div className="form-group">
            <textarea name="description" ref={register()} defaultValue={ poster.description }></textarea>
          </div>
          <div className="form-group">
            <input type="number" name="price" ref={register()} defaultValue={ poster.price } />
          </div>

          <button type="submit">Edit poster</button>
        </form>
      </div>

    </div>
  )
 
};