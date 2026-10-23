import React from 'react';

/**
 * Reusable layout container for pages and sections
 */
const Container = ({ children, className = '', ...props }) => {
  return (
    <div className={`container-page ${className}`} {...props}>
      {children}
    </div>
  );
};

export default Container;
