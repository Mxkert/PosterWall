import React, { useState } from 'react';
import { FaCloudUploadAlt } from 'react-icons/fa';

import './Tools.css';

import { SubmitForm } from '../forms/SubmitForm';

export const SubmitButton = () => {

  const [submitFormOpened, setOpenSubmitForm] = useState(false);

  return (
    <>
      <SubmitForm open={submitFormOpened} />

      <div className="upload-icon">
        <FaCloudUploadAlt onClick={() => setOpenSubmitForm(!submitFormOpened)} />
      </div>
    </>
  );
}