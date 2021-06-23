import React, { useEffect, useState, useRef, useCallback } from 'react';
import axios from 'axios';
import { FaTimes, FaSearch, FaExpand } from 'react-icons/fa';
import moment from 'moment';
import 'moment/locale/nl';

import './Posters.css';

// Import loading icon from Lottie
import LoadingIcon from "../animations/LoadingIcon";

import Container from '@material-ui/core/Container';

import Masonry from 'react-masonry-css'

import { AdminTools } from '../widgets/AdminTools';
import { SubmitButton } from '../widgets/SubmitButton';

import TextField from "@material-ui/core/TextField";
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';

// Location slider
import { withStyles } from '@material-ui/core/styles';
import Slider from '@material-ui/core/Slider';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';

import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';

// Hooks
import useOutsideClick from "../hooks/useOutsideClick";

// Google Maps
import { GoogleMap, useJsApiLoader, Circle, Marker, StandaloneSearchBox } from '@react-google-maps/api';


export const Posters = ({user}) => {

  const [markers, setMarkers]  = useState([]);

  // Get all posters and store them in an array
  const getPosterLocations = () => {
    // Get current date
    const currentDate = moment().locale('nl').format("YYYY-MM-DD");
    let date = '';
    axios.get(`/api/posters/`)
    .then(res => {
      let allMarkers = [];
      // posters = res.data; 
      res.data.forEach(poster => { 
        date = moment(poster.date).locale('nl').format("YYYY-MM-DD");
        if (poster.accepted === true && date >= currentDate) {
          if (poster.location_lat) {
            allMarkers.push({
              title: poster.title,
              lat: poster.location_lat, 
              lng: poster.location_lng,
              id: poster._id
            });
          }
        } 
      });
      setMarkers(allMarkers);
    }); 
  }

  useEffect(() => {
    getPosterLocations();
  }, []);

  const markerOptions = {
    draggable: false,
    icon: 'https://i.imgur.com/9EvQep5.png'
  }

  // Maps
  const containerStyle = {
    width: '100%',
    height: '400px'
  };

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    libraries: ['places'],
    googleMapsApiKey: 'AIzaSyAKQm69QiWowY9VPExD9xjJBN68FeAeEA0'
  })

  const mapOptions = { 
    styles: [
      { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
      { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
      { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
      {
        featureType: "administrative.locality",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }]
      },
      {
        featureType: "poi",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }]
      },
      {
        featureType: "poi.park",
        elementType: "geometry",
        stylers: [{ color: "#263c3f" }]
      },
      {
        featureType: "poi.park",
        elementType: "labels.text.fill",
        stylers: [{ color: "#6b9a76" }]
      },
      {
        featureType: "road",
        elementType: "geometry",
        stylers: [{ color: "#38414e" }]
      },
      {
        featureType: "road",
        elementType: "geometry.stroke",
        stylers: [{ color: "#212a37" }]
      },
      {
        featureType: "road",
        elementType: "labels.text.fill",
        stylers: [{ color: "#9ca5b3" }]
      },
      {
        featureType: "road.highway",
        elementType: "geometry",
        stylers: [{ color: "blue" }]
      },
      {
        featureType: "road.highway",
        elementType: "geometry.stroke",
        stylers: [{ color: "blue" }]
      },
      {
        featureType: "road.highway",
        elementType: "labels.text.fill",
        stylers: [{ color: "blue" }]
      },
      {
        featureType: "transit",
        elementType: "geometry",
        stylers: [{ color: "#2f3948" }]
      },
      {
        featureType: "transit.station",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }]
      },
      {
        featureType: "water",
        elementType: "geometry",
        stylers: [{ color: "#17263c" }]
      },
      {
        featureType: "water",
        elementType: "labels.text.fill",
        stylers: [{ color: "#515c6d" }]
      },
      {
        featureType: "water",
        elementType: "labels.text.stroke",
        stylers: [{ color: "#17263c" }]
      }
    ]
  }

  const options = {
    strokeColor: '#3E5A91',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: '#3E5A91',
    fillOpacity: 0.35,
    clickable: false,
    draggable: true,
    editable: false,
    visible: true,
    zIndex: 1
  }

  const onLoad2 = circle => {
    console.log('Circle onLoad circle: ', circle)
  }
  
  const onUnmount2 = circle => {
    console.log('Circle onUnmount circle: ', circle)
  }

  const [map, setMap] = useState(null);
  const [location, setLocation]  = useState({});

  const [mapCenter, setMapCenter]  = useState({});

  const centerTheMap = () => {
    if (sessionStorage.getItem('loc_lat')) {
      setMapCenter(
        {
          lat: parseFloat(sessionStorage.getItem('loc_lat')), 
          lng: parseFloat(sessionStorage.getItem('loc_lng'))
        });
    } else {
      setMapCenter(
        {
          lat: -3.745, 
          lng: -38.523
        }
      );
    }
    setMapHasBeenCentered(true);
  }

  // const onLoad = React.useCallback(function callback(map) {
  //   setMapCenter({
  //     lat: parseFloat(sessionStorage.getItem('loc_lat')),
  //     lng: parseFloat(sessionStorage.getItem('loc_lng'))
  //   })

  //   const bounds = new window.google.maps.LatLngBounds();
  //   map.fitBounds(bounds);

  // }, [])

  const onLoad = useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds();
    map.fitBounds(bounds);
    setMap(map)

  }, [])

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null)
  }, [])

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
    
    // Get latitude and longitude using the Google Geocoding API
    let locationDetails = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${place}&key=AIzaSyAKQm69QiWowY9VPExD9xjJBN68FeAeEA0`);
    const locationLat = locationDetails.data.results[0].geometry.location.lat
    const locationLng = locationDetails.data.results[0].geometry.location.lng

    console.log(locationDetails);

    console.log(locationLat);
    console.log(locationLng);

    setMapCenter({
      lat: locationLat,
      lng: locationLng
    })
  }; 

  // Default
  const breakpointColumnsObj = {
    default: 5,
    991: 4,
    768: 3,
    500: 2
  };

  const PrettoSlider = withStyles({
    root: {
      color: '#444',
      height: 8,
    },
    thumb: {
      height: 24,
      width: 24,
      backgroundColor: '#fff',
      border: '2px solid currentColor',
      marginTop: -8,
      marginLeft: -12,
      '&:focus, &:hover, &$active': {
        boxShadow: 'inherit',
      },
    },
    active: {},
    valueLabel: {
      left: 'calc(-50% + 4px)',
    },
    track: {
      height: 8,
      borderRadius: 4,
    },
    rail: {
      height: 8,
      borderRadius: 4,
    },
  })(Slider);

  const [userLocationName, setUserLocationName] = useState('');
  const [mapHasBeenCentered, setMapHasBeenCentered] = useState(false);

  const [loading, setLoading] = useState(false);
  const [expandMap, setExpandMap] = useState(false);

  const [posters, setPosters] = useState([]);
  const [allGenres, setAllGenres] = useState([]);

  const [posterInfo, setPosterInfo] = useState([]);

  const [postersToReview, setPostersToReview] = useState(false);
  
  const [posterDetailOpened, setPosterDetailOpened] = useState(false);
  const [filterOpened, setFilterOpen] = useState(false);

  // Google API
  const [locationDistances, setLocationDistances] = useState([]);
  const [locationPermission, setLocationPermission] = useState(false);
  
  // Search
  const [searchResults, setSearchResults] = useState([]);
  const [searchResultsAmount, setSearchResultsAmount] = useState([]);
  
  const [searchedTitle, setSearchedTitle] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedPrice, setSelectedPrice] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedRadius, setSelectedRadius] = useState(10);
  const [changingLocation, setChangingLocation] = useState(0);
  const [selectedDateFrom, setSelectedDateFrom] = useState(moment().format("YYYY-MM-DD"));
  const [selectedDateTo, setSelectedDateTo] = useState(moment().format("YYYY-MM-DD"));

  const [dateFilterChanged, setDateFilterChanged] = useState(false);
  const today = new Date();

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
    setSelectedDateFrom(value);
    setDateFilterChanged(true);
  };
  const handleDateToFilter = (date, value) => {
    setSelectedDateTo(value);
    setDateFilterChanged(true);
  };

  const handleOpenFilter = () => {
    mapHasBeenCentered === false ? (
      centerTheMap()
     ) : (
       setMapHasBeenCentered(true)
     )
    
    filterOpened ? (
      setFilterOpen(false)
     ) 
     : 
     ( 
       setFilterOpen(true)
     )
  }

  const marks = [
    {
      value: 0,
      label: '0km',
    },
    {
      value: 5,
      label: '5km',
    },
    {
      value: 10,
      label: '10km',
    },
    {
      value: 20,
      label: '20 km',
    },
    {
      value: 50,
      label: '50 km',
    },
    {
      value: 100,
      label: '100 km',
    },
  ];

  function valuetext(value) {
    return `${value} km`;
  }

  // ==============

  //  GEOLOCATION
 
  // ==============
  function success(pos) {
    var crd = pos.coords;

    sessionStorage.setItem('location_crd', `{ lat: ${crd.latitude}, lng: ${crd.longitude} }`);
    sessionStorage.setItem('loc_lat', parseFloat(crd.latitude));
    sessionStorage.setItem('loc_lng', parseFloat(crd.longitude));

    if (sessionStorage.getItem("location") === null) {
      sessionStorage.setItem('location', crd.latitude + ',' + crd.longitude);
    }

    // setUserLocation(crd.latitude + ',' + crd.longitude);

    // setLocation({
    //   lat: crd.latitude,
    //   lng: crd.longitude
    // })
  }
  
  function errors(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }
  
  function refreshPage() {
    window.location.reload(false);
  }

  useEffect(() => {
    
    if (navigator.geolocation) {
      navigator.permissions
        .query({ name: "geolocation" }) 
        .then(function (result) {
          if (result.state === "granted") {
            setLocationPermission(true)
            //If granted then you can directly call your function here
            navigator.geolocation.getCurrentPosition(success);
          } else if (result.state === "prompt") {
            navigator.geolocation.getCurrentPosition(success, errors);
          } else if (result.state === "denied") {
            //If denied then you have to show instructions to enable location
            setLocationPermission(false)
          }
          result.onchange = function () {
            console.log(result.state); 
            refreshPage();
          };
        });
    } else {
      alert("Sorry Not available!");
    }
  }, []);
  // ================

  //  END GEOLOCATION

  // ================
  const getDistance = (posterID, origin, destination, radius) => {
    let origins = origin;
    let destinations = destination;
    let meters = radius * 1000

    axios.post('/api/maps/distance', {origins, destinations})
      .then(res => res.data)
      .then(data => {
        console.log(data);
        if (data < meters) {
          setLocationDistances(locationDistances => [...locationDistances, posterID]);
        }
      })
      .catch(err => console.log(`unable to get distances, ${err}`))
  }

  const getLocation = () => { 
    const latlng = sessionStorage.getItem("location");

    axios.post('/api/maps/location', {latlng})
      .then(res => res.data)
      .then(data => {
        setUserLocationName(data);
      })
      .catch(err => console.log(`unable to get distances, ${err}`))
  }

  useEffect(() => {
    setLocationDistances([]);

    posters.forEach(poster => {
      if (poster.location_lat) {
        getDistance(poster._id, [`${mapCenter.lat},${mapCenter.lng}`], [`${poster.location_lat},${poster.location_lng}`], selectedRadius)
      }
    })
    
  }, [mapCenter, selectedRadius]);

  const getFilteredPosters = () => {

    console.log(locationDistances);

    const results = posters.filter(poster => {

      return (

        poster.title.toString().toLowerCase().indexOf(searchedTitle.toLowerCase()) > -1 &&
        poster.genre.toLowerCase().indexOf(selectedGenre.toLowerCase()) > -1 &&
        ( selectedPrice !== '' ? poster.price < parseInt(selectedPrice) : poster.price < 9999 ) &&
        ( dateFilterChanged ? moment(poster.date).format("YYYY-MM-DD") < moment(selectedDateTo).format("YYYY-MM-DD") : poster.title.toString().toLowerCase().indexOf(searchedTitle.toLowerCase()) > -1 ) && 
        ( dateFilterChanged ? moment(poster.date).format("YYYY-MM-DD") > moment(selectedDateFrom).format("YYYY-MM-DD") : poster.title.toString().toLowerCase().indexOf(searchedTitle.toLowerCase()) > -1 ) &&
        ( locationDistances.length ? locationDistances.includes(poster._id) : poster.title.toString().toLowerCase().indexOf(searchedTitle.toLowerCase()) > -1 )
      )

    });

    if (results) {
      setLoading(false);
    }

    setSearchResultsAmount(results.length);
    setSearchResults(results);

  };

  useEffect(async () => {

    setLoading(true);
    getFilteredPosters();

  }, [searchedTitle, selectedGenre, selectedPrice, posters, selectedDateFrom, selectedDateTo, locationDistances, selectedRadius]);

  const posterRef = useRef();
  const filterRef = useRef();

  useOutsideClick(posterRef, () => (
    posterDetailOpened ? setPosterDetailOpened(false) : null 
  ));

  const mouseUp = (event, value) => {
    setChangingLocation(2);
    setSelectedRadius(value);
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
      res.data.forEach(poster => { 
        date = moment(poster.date).locale('nl').format("YYYY-MM-DD");
        if (poster.accepted === true && date >= currentDate) {
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
    getLocation();
  }, []);

  const showPosterInfo = (id) => {
    // Get poster detail information
    axios.get(`/api/posters/${id}`)
    .then(res => {
      setPosterInfo(res.data);
      setPosterDetailOpened(true);
    });
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
    <>
      <div className={ posterDetailOpened ? 'slide-out slide-out-detail opened' : 'slide-out slide-out-detail'}>

        { posterInfo ?
        <>
          <div className="blurred-bg" onClick={() => setPosterDetailOpened(false)}></div>

          <FaTimes className="modal-close-btn" onClick={() => setPosterDetailOpened(false)} />

          <div className="modal-body detail-modal" refs={posterRef}>
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
                        <span className="topic">Genre: </span> <span className="genre">{ posterInfo.genre }</span>
                      </div>
                      <div>
                        <span className="topic">Price:</span> € <span className="price">{ posterInfo.price }</span>
                      </div>
                      <div>
                        <span className="topic">Locations:</span> <span className="location">{ posterInfo.location }</span>
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
          <AdminTools review={postersToReview} />
        : null }
        { posterDetailOpened ? null :
        <>
          <div className="filter-icon" style={{ top: '5%', zIndex: '3' }} onClick={handleOpenFilter}>
            { filterOpened ? 
             <FaTimes />
             : 
             <FaSearch />
            }
            
          </div>
          <SubmitButton action={postersToReview => setPostersToReview(postersToReview)} />
        </>
        }
        
        <div 
          className={ filterOpened ? expandMap ? 'filter-container active expanded' : 'filter-container active' : 'filter-container' }
        >
          <div className="body-click" onClick={handleOpenFilter}></div>
          <div className="filters">

            <div className="filter-results">
              <h3 style={{ marginTop: '0' }}>
                {searchResultsAmount} {searchResultsAmount === 1 ? 'event' : 'events'} matched your filters
              </h3>
            </div>

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
                refs={filterRef}
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
                refs={filterRef}
              >
                <MenuItem value="">
                  <em>Remove filter </em>
                </MenuItem>
                <MenuItem value='0'>Free</MenuItem>
                <MenuItem value='10'>10</MenuItem>
                <MenuItem value='20'>20</MenuItem>
                <MenuItem value='50'>50</MenuItem>
              </Select>
            </FormControl>
          
          {/* Location filter */}
          { locationPermission ?
          <>
            <div className="location-container">
              <Typography id="label">Radius (km){/*{ userLocationName ? ' - From ' + userLocationName : null }*/}</Typography>
              <PrettoSlider 
                valueLabelDisplay="auto" 
                aria-label="pretto slider" 
                getAriaValueText={valuetext}
                onChangeCommitted={mouseUp}
                onDrag={(e) => console.log(e)}
                refs={filterRef}
                defaultValue={selectedRadius} 
                step={0.5}
                marks
                min={0}
                max={30}
              />
            </div>
            <div className="places open">
              { 
                isLoaded ? (
                  <>
                    <GoogleMap
                      mapContainerStyle={containerStyle}
                      center={mapCenter}
                      zoom={15}
                      onLoad={onLoad}
                      onUnmount={onUnmount}
                      options={mapOptions}
                    >
                      <div class="widen-map" onClick={() => setExpandMap(!expandMap)}><FaExpand /></div>
                      <StandaloneSearchBox
                        // onLoad={onSearchboxLoad}
                        onPlacesChanged={onPlacesChanged}
                        ref={searchBox}  
                      >
                        <input
                          type="text"
                          placeholder="Search..."
                          style={{
                            boxSizing: `border-box`,
                            border: `1px solid transparent`,
                            width: `240px`,
                            height: `32px`,
                            padding: `0 12px`,
                            borderRadius: `3px`,
                            boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
                            fontSize: `14px`,
                            outline: `none`,
                            textOverflow: `ellipses`,
                            position: "absolute",
                            left: "50%",
                            marginLeft: "-120px"
                          }}
                        />
                      </StandaloneSearchBox>
                      {markers.map((marker, index) => {
                        return (
                          <Marker
                            position={{ lat: marker.lat, lng: marker.lng }}
                            options={markerOptions}
                            key={index}
                            onClick={(e) => {
                              console.log(e)
                              console.log(marker.id)
                              showPosterInfo(marker.id)
                            }}
                            title={marker.title}
                          /> 
                        )
                      })}
                      <Circle 
                        // optional
                        onLoad={onLoad2}
                        // optional
                        onUnmount={onUnmount2}
                        onDrag={(e) => console.log(e)}
                        onDragStart={(e) => console.log(e)}
                        onDragEnd={() => console.log('test')}
                        onRadiusChanged={(e) => {
                          console.log('radius changed ', selectedRadius);
                        }}
                        onClick={() => console.log('clicked')}
                        onMouseDown={() => console.log('mouse down')}
                        // required
                        center={mapCenter}
                        // required
                        options={options}
                        radius={selectedRadius * 1000}
                      />
                    </GoogleMap>
                  </>
                ) : <><h1>Test2</h1></>
               }
            </div>
          </>
          :
          <Tooltip title="Please allow location tracking before using this filter">
            <div className="location-container">
              {/* <FormControl variant="outlined"> */}
                {/* <InputLabel id="demo-simple-select-outlined-label">Location range</InputLabel> */}
                <Typography id="label">Location (km){ userLocationName ? ' - From ' + userLocationName : null }</Typography>
                <PrettoSlider 
                  valueLabelDisplay="auto" 
                  aria-label="pretto slider" 
                  defaultValue={selectedRadius} 
                  step={0.5}
                  marks
                  min={0}
                  max={30}
                  marks={marks}
                  getAriaValueText={valuetext}
                  onChangeCommitted={mouseUp}
                  refs={filterRef} 
                  disabled
                />
              {/* </FormControl> */}
            </div>
          </Tooltip>
          }
          
            {/* Date from filter */}
            <div className="date-container">
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <InputLabel id="demo-simple-select-outlined-label">Date from</InputLabel>
                <KeyboardDatePicker
                  className="date-picker"
                  id="date"
                  showTodayButton={true}
                  value={selectedDateFrom}
                  format="yyyy-MM-dd"
                  minDate={today}
                  onChange={handleDateFromFilter}
                  KeyboardButtonProps={{
                    'aria-label': 'change date',
                  }}
                  variant="outlined"
                  refs={filterRef}
                />
              </MuiPickersUtilsProvider>
            </div>
          
          {/* Date to filter */}
          <div className="date-container">
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
                refs={filterRef}
              />
            </MuiPickersUtilsProvider>
          </div>

          </div>
        </div>
        
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="my-masonry-grid poster-column"
          columnClassName="my-masonry-grid_column"
        >

        {
          loading ? <LoadingIcon /> :
          searchResults.map((poster, index) => (
            <div className="poster" onClick={() => showPosterInfo(poster._id)} key={poster._id}>
              <img src={poster.image} alt={poster.title} />
            </div>
          ))
        }

        </Masonry>


      </Container>
    </>
  )

}