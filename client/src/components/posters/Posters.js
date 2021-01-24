import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaTimes, FaSlidersH } from 'react-icons/fa';
import moment from 'moment';
import 'moment/locale/nl';

import './Posters.css';

import Container from '@material-ui/core/Container';

import Masonry from 'react-masonry-css'

import { AdminTools } from '../widgets/AdminTools';
import { SubmitButton } from '../widgets/SubmitButton';

import TextField from "@material-ui/core/TextField";
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';

import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';

export const Posters = ({user}) => {

  const breakpointColumnsObj = {
    default: 5,
    991: 4,
    768: 3,
    500: 2
  };

  const [posters, setPosters] = useState([]);
  const [allGenres, setAllGenres] = useState([]);

  const [posterInfo, setPosterInfo] = useState([]);
  
  const [posterDetailOpened, setPosterDetailOpened] = useState(false);
  const [filterOpened, setFilterOpen] = useState(false);
  
  // Search
  const [searchResults, setSearchResults] = useState([]);
  const [searchResultsAmount, setSearchResultsAmount] = useState([]);

  const [searchedTitle, setSearchedTitle] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedPrice, setSelectedPrice] = useState("");
  const [selectedDateFrom, setSelectedDateFrom] = useState(moment('1970-01-01').format("YYYY-MM-DD"));
  const [selectedDateTo, setSelectedDateTo] = useState(moment('2100-01-01').format("YYYY-MM-DD"));

  const handleChange = event => {
     setSearchedTitle(event.target.value);
   };
  const handleGenreFilter = event => {
    setSelectedGenre(event.target.value);
  };
  const handlePriceFilter = event => {
    setSelectedPrice(event.target.value);
  };
  const handleDateFromFilter = (date, value) => {
    setSelectedDateFrom(date);
  };
  const handleDateToFilter = (date, value) => {
    setSelectedDateTo(date);
  };

  useEffect(() => {
    const results = posters.filter(poster => {
      return (
        selectedPrice ? (
          poster.title.toString().toLowerCase().indexOf(searchedTitle.toLowerCase()) > -1 &&
          poster.genre.toLowerCase().indexOf(selectedGenre.toLowerCase()) > -1 &&
          poster.price < parseInt(selectedPrice) &&
          moment(poster.date).format("YYYY-MM-DD") > moment(selectedDateFrom).format("YYYY-MM-DD") &&
          moment(poster.date).format("YYYY-MM-DD") < moment(selectedDateTo).format("YYYY-MM-DD")
        ) : (
          poster.title.toString().toLowerCase().indexOf(searchedTitle.toLowerCase()) > -1 &&
          poster.genre.toLowerCase().indexOf(selectedGenre.toLowerCase()) > -1 &&
          poster.price < 9999 &&
          moment(poster.date).format("YYYY-MM-DD") > moment(selectedDateFrom).format("YYYY-MM-DD") &&
          moment(poster.date).format("YYYY-MM-DD") < moment(selectedDateTo).format("YYYY-MM-DD")
        )
      );
    });

    setSearchResultsAmount(results.length);
    setSearchResults(results);

  }, [searchedTitle, selectedGenre, selectedPrice, posters, selectedDateFrom, selectedDateTo]);

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
      res.data.forEach(poster => { 
        date = moment(poster.date).locale('nl').format("YYYY-MM-DD");
        if (poster.accepted === true && date > currentDate) {
          availablePosters.push(poster); 

          // Push unique genre to array
          genres.push(poster.genre);
          genres = genres.filter((x, i, a) => a.indexOf(x) === i);
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

                    <div className="title">
                      <h1>{ posterInfo.title }</h1>
                    </div>

                    <div className="date-and-time">
                      <div className="date">
                        { moment(posterInfo.date).locale('nl').format("D MMMM YYYY") }
                      </div>
                      <span className="slash">/</span>
                      <div className="time">
                        <span className="start-time">{ posterInfo.start_time }</span>
                        <span className="slash">-</span>
                        <span className="end-time">{ posterInfo.end_time }</span>
                      </div>
                    </div>

                    <div className="meta">
                      <div>
                        <span className="topic">Genre:</span> <span className="genre">{ posterInfo.genre }</span>
                      </div>
                      <div>
                        <span className="topic">Price:</span> € <span className="price">{ posterInfo.price }</span>
                      </div>
                      <div>
                        <span className="topic">Location:</span> <span className="location">{ posterInfo.location }</span>
                      </div>
                    </div>

                    <div className="acts">
                    { posterInfo.acts ? posterInfo.acts.map((act, index) => (
                      <div className="act">
                        { act }
                      </div>
                    )) : null }
                    </div>

                    <div className="description">
                      { posterInfo.description }
                    </div>

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
        <>
          <div className="filter-icon" style={{ top: '5%', zIndex: '3' }} onClick={() => setFilterOpen(!filterOpened)}>
            { filterOpened ? 
             <FaTimes />
             : 
             <FaSlidersH />
            }
            
          </div>
          <SubmitButton />
        </>
        }
        
        <div className={filterOpened ? 'filter-container active' : 'filter-container'}>
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
          
            {/* Date from filter */}
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <InputLabel id="demo-simple-select-outlined-label">Date from</InputLabel>
              <KeyboardDatePicker
                className="date-picker"
                id="date"
                showTodayButton={true}
                value={selectedDateFrom}
                format="yyyy-MM-dd"
                onChange={handleDateFromFilter}
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
                variant="outlined"
              />
            </MuiPickersUtilsProvider>
          
          {/* Date to filter */}
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <InputLabel id="demo-simple-select-outlined-label">Date to</InputLabel>
            <KeyboardDatePicker
              className="date-picker"
              id="date"
              showTodayButton={true}
              value={selectedDateTo}
              format="yyyy-MM-dd"
              onChange={handleDateToFilter}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
              variant="outlined"
            />
          </MuiPickersUtilsProvider>

            {/* <FormControl variant="outlined">
              <InputLabel id="demo-simple-select-outlined-label">Date from</InputLabel>
              <Select
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                value={selectedDateFrom}
                onChange={handleDateFromFilter}
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
            </FormControl> */}

          </div>
          <div className="filter-results">
            <h3>{searchResultsAmount} posters matched your filters</h3>
          </div>
        </div>
        
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="my-masonry-grid poster-column"
          columnClassName="my-masonry-grid_column"
        >

        {
          searchResults.map((poster, index) => (
            <div className="poster" onClick={() => showPosterInfo(poster._id)} key={index}>
              <img src={poster.image} alt={poster.title} />
            </div>
          ))
          // searchResults.length ?
          //   searchResults.map((poster, index) => (
          //     <div className="poster" onClick={() => showPosterInfo(poster._id)} key={index}>
          //       <img src={poster.image} alt={poster.title} />
          //     </div>
          //   ))
          // : 
          //   posters.map((poster, index) => {
          //     return (
          //       <div className="poster" onClick={() => showPosterInfo(poster._id)} key={index}>
          //         <img src={poster.image} alt={poster.title} />
          //       </div>
          //     )
          //   })
        }

        </Masonry>


      </Container>
    </>
  )

}