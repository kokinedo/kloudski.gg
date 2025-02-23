import React from 'react';
import '../styles/MovingBanner.css';

const MovingBanner = () => {
  const bannerText = "107 108 111 • o72 • 01101011 01101100 01101111 01110101 01100100 01110011 01101011 01101001 • 6B 6C 6F 75 64 73 6B 69 • ";
  
  // Repeat the text 3 times to ensure continuous flow
  const repeatedText = `${bannerText} ${bannerText} ${bannerText}`;

  return (
    <div className="banner-container">
      <div className="moving-text">
        {repeatedText}
      </div>
    </div>
  );
};

export default MovingBanner; 