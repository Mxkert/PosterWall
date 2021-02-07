import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaTools, FaFileArchive, FaFileSignature, FaImage } from 'react-icons/fa';
import moment from 'moment';
import 'moment/locale/nl';

import './Tools.css';

// Hooks
import useOutsideClick from "../hooks/useOutsideClick";

export const AdminTools = (props) => {
  
  const [toolsActive, setToolsActive] = useState(false);

  const [amountToReview, setAmountToReview] = useState(0);
  // const [amountAvailablePosters, setAmountAvailablePosters] = useState(0);

  const adminRef = useRef();

  useOutsideClick(adminRef, () => (
    toolsActive ? setToolsActive(false) : null 
  ));

  // Get all posters and store them in an array
  const getPostersToReview = () => {
    // Get current date
    const currentDate = moment().locale('nl').format("YYYY-MM-DD");
    // Get posters
    axios.get(`/api/posters/`)
    .then(res => {
      let date = '';
      let amount = 0;
      // let available = 0;
      res.data.forEach(poster => {
        date = moment(poster.date).locale('nl').format("YYYY-MM-DD");
        if (poster.accepted === false && poster.rejected === false && date > currentDate) {
          amount++;
        } 
        // if (poster.accepted === true && date < currentDate) {
        //   available++;
        // } 
      });
      setAmountToReview(amount);
      // setAmountAvailablePosters(available);
    });
  }

  // Get posters on page load
  useEffect(() => {
    getPostersToReview();
  }, [props.review]);

  return (
    <div className="admin-tools" ref={adminRef}>
      <div className={toolsActive ? `tools active` : `tools`}>
        <div className="tool">
          <Link to="/review"><FaFileSignature /></Link>
          <span className="amount">{ amountToReview }</span>
          <div className="tool-label">
            <span>Review</span>
          </div>
        </div>
        <div className="tool">
          <Link to="/archive"><FaFileArchive /></Link>
          <div className="tool-label">
            <span>Archive</span>
          </div>
        </div>
        <div className="tool">
          <Link to="/"><FaImage /></Link>
          <div className="tool-label">
            <span>Events</span>
          </div>
        </div>
      </div>
      <div className='tool-icon' onClick={() => setToolsActive(!toolsActive)}>
        <FaTools />
      </div>
    </div>
  );
}