import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaTimes } from 'react-icons/fa';
import moment from "moment";
import 'moment/locale/nl';

import './Posters.css';

import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';

import Masonry from 'react-masonry-css'

import { AdminTools } from '../widgets/AdminTools';

export const Archive = ({user}) => {

  const breakpointColumnsObj = {
    default: 5,
    1100: 3,
    700: 2,
    500: 1
  };

  const [posters, setPosters] = useState([]);

  const [posterInfo, setPosterInfo] = useState([]);
  
  const [posterDetailOpened, setPosterDetailOpened] = useState(false);

  // Get all posters and store them in an array
  const getPosters = () => {
    // Get current date
    const currentDate = moment().locale('nl').format("YYYY-MM-DD");
    // Empty the arrays
    setPosters([]);
    // Get posters
    axios.get(`/api/posters/`)
    .then(res => {
      let availablePosters = [];
      let date = '';
      // posters = res.data;
      res.data.forEach(poster => { 
        date = moment(poster.date).locale('nl').format("YYYY-MM-DD");
        if (poster.accepted === true && date < currentDate) {
          availablePosters.push(poster); 
        } 
      });

      availablePosters.sort((a, b) => (a.creation_date > b.creation_date) ? 1 : -1);

      setPosters(availablePosters);
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
    });
  }

  return (
    <>
      <div className={ posterDetailOpened ? 'slide-out slide-out-detail opened' : 'slide-out slide-out-detail'}>

        { posterInfo ?
        <>
          <div className="blurred-bg"></div>

          <FaTimes className="modal-close-btn" onClick={() => setPosterDetailOpened(false)} />

          <div className="modal-body detail-modal">
            <div className="detail-container">
              <div className="poster-image">
                <img src={ posterInfo.image } alt={ posterInfo.title } />
              </div>
              <div className="poster-content">
                
                  <Grid container spacing={3} justify="center">
                    <Grid item xs={12}>
                      <h1>{ posterInfo.title }</h1>
                    </Grid>

                    <Grid item xs={6}>
                      { moment(posterInfo.date).locale('nl').format("YYYY-MM-DD") }
                    </Grid>
                    <Grid item xs={3}>
                      { posterInfo.start_time }
                    </Grid>
                    <Grid item xs={3}>
                      { posterInfo.end_time }
                    </Grid>

                    <Grid item xs={4}>
                      { posterInfo.genre }
                    </Grid>
                    <Grid item xs={4}>
                      { posterInfo.price }
                    </Grid>
                    <Grid item xs={4}>
                      { posterInfo.location }
                    </Grid>

                    <Grid item xs={12}>
                    {/* { posterInfo.acts.map((act, index) => (
                      act
                    ))} */}
                    </Grid>

                    <Grid item xs={12}>
                      { posterInfo.description }
                    </Grid>

                  </Grid>

              </div>
            </div>
          </div>
        </>
        : null }
      </div>

      <Container maxWidth="md">

        <AdminTools />

        { user ?
          <AdminTools />
        : null }
        
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="my-masonry-grid poster-column"
          columnClassName="my-masonry-grid_column"
        >

        {
          posters.map((poster, index) => {
            return (
              <div className="poster" onClick={() => showPosterInfo(poster._id)} key={index}>
                <img src={poster.image} alt={poster.title} />
              </div>
            )
          })
        }

        </Masonry>


      </Container>
    </>
  )

}