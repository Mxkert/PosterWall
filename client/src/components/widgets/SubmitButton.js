import React, { useState, useEffect } from 'react';
import { FaPlus } from 'react-icons/fa';

import './Tools.css';

import { SubmitForm } from '../forms/SubmitForm';

export const SubmitButton = (props) => {

  const [submitFormOpened, setOpenSubmitForm] = useState(false);

  const [addedPoster, setAddedPoster] = useState(false);

  useEffect(() => {
    if (addedPoster) {
      props.action(true);
    }
  }, [addedPoster]);

  return (
    <>
      <SubmitForm open={submitFormOpened} action={addedPoster => setAddedPoster(addedPoster)} />

      <div className="upload-icon" onClick={() => setOpenSubmitForm(!submitFormOpened)}>
        <FaPlus />
      </div>
    </>
  );
}