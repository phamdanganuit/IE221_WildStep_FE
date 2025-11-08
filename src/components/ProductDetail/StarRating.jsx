import React from 'react';
import { FaStar } from 'react-icons/fa';

const StarRating = ({ rating = 0, maxRating = 5, size = "w-5 h-5", showRating = false }) => {
  return (
    <div className="flex items-center">
      {[...Array(maxRating)].map((_, index) => (
        <div
          key={index}
          className={`flex shrink-0 ${size} ${
            index < rating ? 'text-[#FFA439] fill-[#FFA439]' : 'text-gray-300'
          }`}
          aria-label={`${index + 1} star${index + 1 !== 1 ? 's' : ''}`}
        >
          <FaStar />
        </div>
      ))}
      {showRating && (
        <span className="ml-1 text-sm text-gray-600">{rating}</span>
      )}
    </div>
  );
};

export default StarRating;
