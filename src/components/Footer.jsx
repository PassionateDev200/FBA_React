import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-dark text-white text-center py-3 mt-5">
      <div className="container">
        <small>&copy; {new Date().getFullYear()} Eden Web, Inc. All rights reserved.</small>
      </div>
    </footer>
  );
};

export default Footer;
