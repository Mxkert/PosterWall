import React, { useState, useEffect } from 'react';
import axios from 'axios';

export const GeoLocation = () => {

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

  return (
    <h1>Test</h1>
  )

}