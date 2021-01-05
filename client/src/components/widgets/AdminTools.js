import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaTools, FaFileArchive, FaFileSignature } from 'react-icons/fa';

import './Tools.css';

export const AdminTools = () => {
  
  const [toolsActive, setToolsActive] = useState(false);

  const [amountToReview, setAmountToReview] = useState(0);

  // Get all posters and store them in an array
  const getPostersToReview = () => {
    // Get posters
    axios.get(`/api/posters/not-accepted`)
    .then(res => {
      let amount = 0;
      res.data.map(poster => {
        amount = amount + 1;
      });
      setAmountToReview(amount);
    });
  }

  // Get posters on page load
  useEffect(() => {
    getPostersToReview();
  }, []);

  return (
    <div className="admin-tools">
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
      </div>
      <div className='tool-icon' onClick={() => setToolsActive(!toolsActive)}>
        <FaTools />
      </div>
    </div>
  );
}