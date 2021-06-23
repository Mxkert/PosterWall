import React from 'react';
import LocationAutocomplete from 'location-autocomplete';
 
const LocationField = props => (
  <LocationAutocomplete
    onChange={() => {}} 
    // onDropdownSelect={() => {}}
    googleAPIKey='AIzaSyAKQm69QiWowY9VPExD9xjJBN68FeAeEA0'
    className="location"
    {...props}
  />
);
 
export default LocationField;