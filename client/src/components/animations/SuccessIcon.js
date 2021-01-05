import React from 'react';
import Lottie from 'react-lottie';
import animationData from '../../assets/img/success.json';

const SuccessIcon = () => {

    const defaultOptions = {
      loop: false,
      autoplay: true,
      animationData: animationData,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
      }
    };

    return(
      <div className="animation-container">
        <Lottie options={defaultOptions}
        />
      </div>
    )

}

export default SuccessIcon