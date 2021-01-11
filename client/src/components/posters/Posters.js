import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useForm, useFieldArray } from "react-hook-form";
import { FaTimes } from 'react-icons/fa';
import moment from "moment";
import 'moment/locale/nl';

import './Posters.css';

import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';

import Masonry from 'react-masonry-css'

import { AdminTools } from '../widgets/AdminTools';
import { SubmitButton } from '../widgets/SubmitButton';

import TextField from "@material-ui/core/TextField";
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';

export const Posters = ({user}) => {

  const breakpointColumnsObj = {
    default: 5,
    1100: 3,
    700: 2,
    500: 1
  };

  const [posters, setPosters] = useState([]);
  const [allGenres, setAllGenres] = useState([]);

  const [posterInfo, setPosterInfo] = useState([]);
  
  const [posterDetailOpened, setPosterDetailOpened] = useState(false);

  const { register, handleSubmit } = useForm();
  
  // Search
  const [searchResults, setSearchResults] = useState([]);
  const [searchResultsAmount, setSearchResultsAmount] = useState([]);

  const [searchedTitle, setSearchedTitle] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedPrice, setSelectedPrice] = useState("");
  const [searchedAct, setSearchedAct] = useState("");

  const handleChange = event => {
     setSearchedTitle(event.target.value);
   };
  const handleGenreFilter = event => {
    setSelectedGenre(event.target.value);
  };
  const handlePriceFilter = event => {
    setSelectedPrice(event.target.value);
  };

  useEffect(() => {
    const results = posters.filter(poster => {
      return (
        selectedPrice ? (
          poster.title.toString().toLowerCase().indexOf(searchedTitle.toLowerCase()) > -1 &&
          poster.genre.toLowerCase().indexOf(selectedGenre.toLowerCase()) > -1 &&
          poster.price < parseInt(selectedPrice)
        ) : (
          poster.title.toString().toLowerCase().indexOf(searchedTitle.toLowerCase()) > -1 &&
          poster.genre.toLowerCase().indexOf(selectedGenre.toLowerCase()) > -1 &&
          poster.price < 9999
        )
      );
    });

    setSearchResultsAmount(results.length);
    setSearchResults(results);

  }, [searchedTitle, selectedGenre, selectedPrice]);


  const testGet = () => {
    axios.get(`/api/get`)
    .then(res => {
      console.log(res);
    });
  }

  const testGet2 = () => {
    axios.post('/api/post')
    .then(res => {
      console.log(res);
    });
  }

  // Get all posters and store them in an array
  const getPosters = () => {
    // Get current date
    const currentDate = moment().locale('nl').format("YYYY-MM-DD");
    // Empty the arrays
    setPosters([]);
    setAllGenres([]);
    // Get posters
    axios.get(`/api/posters/`)
    .then(res => {
      let availablePosters = [];
      let date = '';
      let genres = [];
      // posters = res.data;
      res.data.map(poster => { 
        date = moment(poster.date).locale('nl').format("YYYY-MM-DD");
        if (poster.accepted === true && date > currentDate) {
          availablePosters.push(poster); 

          // Push unique genre to array
          genres.push(poster.genre);
          genres = genres.filter((x, i, a) => a.indexOf(x) == i);
          setAllGenres(genres);
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

        { user ?
          <AdminTools />
        : null }
        { posterDetailOpened ? null :
          <SubmitButton />
        }
        
        <div className="filter-container">
          <div className="filters">

            {/* Title filter */}
            <FormControl variant="outlined">
              <TextField 
                value={searchedTitle}
                onChange={handleChange}
                id="title"
                name="title"
                type="text"
                label="Search title"
                variant="outlined"
              />
            </FormControl>

            {/* Genre filter */}
            <FormControl variant="outlined">
              <InputLabel id="demo-simple-select-outlined-label">Genre</InputLabel>
              <Select
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                value={selectedGenre}
                onChange={handleGenreFilter}
                label="Genre"
              >
                <MenuItem value="">
                  <em>Remove filter</em>
                </MenuItem>
                {
                  allGenres.map(genre => {
                    return (
                      <MenuItem value={genre}>{genre}</MenuItem>
                    )
                  })
                }
              </Select>
            </FormControl>
          
            {/* Price filter */}
            <FormControl variant="outlined">
              <InputLabel id="demo-simple-select-outlined-label">Price</InputLabel>
              <Select
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                value={selectedPrice}
                onChange={handlePriceFilter}
                label="Price"
              >
                <MenuItem value="">
                  <em>Remove filter</em>
                </MenuItem>
                <MenuItem value='0'>Free</MenuItem>
                <MenuItem value='10'>10</MenuItem>
                <MenuItem value='20'>20</MenuItem>
                <MenuItem value='50'>50</MenuItem>
              </Select>
            </FormControl>

          </div>
          <div className="filter-results">
            <h3>{searchResultsAmount} posters matched your filters - Test</h3>
          </div>
        </div>
        
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="my-masonry-grid poster-column"
          columnClassName="my-masonry-grid_column"
        >

        {
          searchResults.length ?
            searchResults.map((poster, index) => (
              <div className="poster" onClick={() => showPosterInfo(poster._id)} key={index}>
                <img src={poster.image} alt={poster.title} />
              </div>
            ))
          : 
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