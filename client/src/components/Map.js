import React, { useState, useRef } from 'react'
import axios from 'axios';
import { GoogleMap, useJsApiLoader, Circle, Marker, StandaloneSearchBox } from '@react-google-maps/api';

const containerStyle = {
  width: '400px',
  height: '400px'
};

export const Map = () => {

  const [centerMap, setCenterMap] = React.useState({});

  const [mapCenter, setMapCenter]  = useState({});

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyAKQm69QiWowY9VPExD9xjJBN68FeAeEA0",
    libraries: ['places']
  })

  const [map, setMap] = React.useState(null)

  const onLoad = React.useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds();
    map.fitBounds(bounds);
    setMap(map)
  }, [])

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null)
  }, [])

  const searchBox = useRef(null);

  const onPlacesChanged = async () => {
    const place = searchBox.current.state.searchBox.gm_accessors_.places.Ke.formattedPrediction;
    console.log(place);
    
    // Get latitude and longitude using the Google Geocoding API
    let locationDetails = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${place}&key=AIzaSyAKQm69QiWowY9VPExD9xjJBN68FeAeEA0`);
    const locationLat = locationDetails.data.results[0].geometry.location.lat
    const locationLng = locationDetails.data.results[0].geometry.location.lng

    console.log(locationLat);
    console.log(locationLng);

    setMapCenter({
      lat: locationLat,
      lng: locationLng
    })
  };
  
  function handleLoad() {
    console.log('test');
  }

  const centerTheMap = () => {
    setCenterMap({lat: -3.745, lng: -38.523});
  }

  return isLoaded ? (
    <>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={centerMap} 
        zoom={13}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        <StandaloneSearchBox
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
        { /* Child components, such as markers, info windows, etc. */ }
        <></>
      </GoogleMap>
      <button onClick={() => centerTheMap()}>Center</button>
    </>
  ) : <><h1>Test2</h1></>
}