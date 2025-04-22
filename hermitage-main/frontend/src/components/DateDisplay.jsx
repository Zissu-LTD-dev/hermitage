// src/components/DateDisplay.js
import React from 'react';
import PropTypes from 'prop-types';
import { dateFormatter } from '../utils/dateFormatter';

const DateDisplay = ({ timestamp, type = 'full', className = '' }) => {
  const getFormattedDate = () => {
    switch (type) {
      case 'date':
        return dateFormatter.getDateOnly(timestamp);
      case 'time':
        return dateFormatter.getTimeOnly(timestamp);
      default:
        return dateFormatter.getFullDateTime(timestamp);
    }
  };

  return (
    <>
      {getFormattedDate()}
    </>
  );
};

// הגדרת PropTypes לבדיקת טיפוסים
DateDisplay.propTypes = {
  timestamp: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['full', 'date', 'time']),
  className: PropTypes.string
};

// ערכי ברירת מחדל
DateDisplay.defaultProps = {
  type: 'full',
  className: ''
};

export default DateDisplay;