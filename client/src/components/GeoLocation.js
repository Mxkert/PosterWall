import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';

import LocationAutocomplete from 'location-autocomplete';

export const GeoLocation = () => {

  const containerStyle = {
    width: '400px',
    height: '400px'
  };
  
  const center = {
    lat: 51.99585388647266,
    lng: 4.197716419667051
  };

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyAKQm69QiWowY9VPExD9xjJBN68FeAeEA0'
  })

  const [map, setMap] = React.useState(null)
  const [location, setLocation]  = useState({});

  const [selectedLocation, setSelectedLocation] = useState('');

  const onLoad = React.useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds();
    map.fitBounds(bounds);
    setMap(map)
  }, [])

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null)
  }, [])

  const getDistance = () => {
    let destinations = ['50.1109221,8.6821267'];
    let origins = ['51.994037899999995,4.1954234999999995'];

    axios.post('/api/maps/distance', {origins, destinations})
      .then(res => res.data)
      .then(data => console.log(data))
      .catch(err => console.log(`unable to get distances, ${err}`))
  }

  function success(pos) {
    var crd = pos.coords;

    if (sessionStorage.getItem("location") === null) {
      sessionStorage.setItem('location', crd.latitude + ',' + crd.longitude);
    }

    setLocation({
      lat: crd.latitude,
      lng: crd.longitude
    })

    // axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${sessionStorage.getItem("location")}&key=AIzaSyAKQm69QiWowY9VPExD9xjJBN68FeAeEA0`)
    // .then(res => { 
    //   console.log(res.data.plus_code.compound_code);
    // });

    // axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=Naaldwijk, Nederland&key=AIzaSyAKQm69QiWowY9VPExD9xjJBN68FeAeEA0`)
    // .then(res => { 
    //   var lat = res.data.results[0].geometry.location.lat;
    //   var lng = res.data.results[0].geometry.location.lng;

    //   axios.get(`https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${crd.latitude},${crd.longitude}&destinations=${lat},${lng}&language=nl-NL&key=AIzaSyAKQm69QiWowY9VPExD9xjJBN68FeAeEA0`)
    //   .then(res => { 
    //     console.log(res.data);
    //   });
    // });

  }
  
  function errors(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }

  useEffect(() => {

    getDistance();
    
    if (navigator.geolocation) {
      navigator.permissions
        .query({ name: "geolocation" })
        .then(function (result) {
          if (result.state === "granted") {
            console.log(result.state);
            //If granted then you can directly call your function here
            navigator.geolocation.getCurrentPosition(success);
          } else if (result.state === "prompt") {
            navigator.geolocation.getCurrentPosition(success, errors);
          } else if (result.state === "denied") {
            //If denied then you have to show instructions to enable location
          }
          result.onchange = function () {
            console.log(result.state);
          };
        });
    } else {
      alert("Sorry Not available!");
    }
  }, []);

  function onDropdownSelect(component) {
    // this will give you access to the entire location object, including
    // the `place_id` and `address_components`
    const place = component.autocomplete.getPlace();
    const selectedPlace = place.formatted_address;
  
    // other awesome stuff
    setSelectedLocation(selectedPlace);
  }

  return (
    
  isLoaded ? (
    <>
      <LocationAutocomplete
        id="location"
        name="location"
        placeholder="Location"
        locationType="(regions)"
        googleAPIKey="AIzaSyAKQm69QiWowY9VPExD9xjJBN68FeAeEA0"
        onDropdownSelect={(e) => onDropdownSelect(e)}
      />

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={location}
        zoom={10}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
      </GoogleMap>
    </>
  ) : <></>
  )

}