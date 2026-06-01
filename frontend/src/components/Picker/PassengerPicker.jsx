import React, { useState, useEffect, useRef } from 'react';
import '../../css/Picker/PassengerPicker.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

function PassengerPicker({ setPassengers }) {

  const [isOpen, setIsOpen] = useState(false);
  const pickerRef = useRef(null);

  const [counts, setCounts] = useState({
    adult: 1,
    child: 0
  });

  useEffect(() => {

    const total =
      counts.adult +
      counts.child;

    setPassengers(total);

  }, [counts, setPassengers]);

  const updateCount = (
    type,
    step
  ) => {

    setCounts(prev => {

      const minValue =
        type === 'adult'
        ? 1
        : 0;

      const newValue = Math.max(
        minValue,
        prev[type] + step
      );

      return {
        ...prev,
        [type]: newValue
      };

    });

  };

  useEffect(() => {

    const handleClickOutside = (e) => {

      if (
        pickerRef.current &&
        !pickerRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }

    };

    document.addEventListener(
      'mousedown',
      handleClickOutside
    );

    return () =>
      document.removeEventListener(
        'mousedown',
        handleClickOutside
      );

  }, []);

  const totalPassengers =
    counts.adult +
    counts.child;

  const getDisplayText = () => {

    const details = [];

    if (counts.adult > 0) {

      details.push(
        `${counts.adult} Adult${
          counts.adult > 1
            ? 's'
            : ''
        }`
      );

    }

    if (counts.child > 0) {

      details.push(
        `${counts.child} ${
          counts.child > 1
            ? 'Children'
            : 'Child'
        }`
      );

    }

    return `${totalPassengers} Passenger${
      totalPassengers > 1
        ? 's'
        : ''
    } (${details.join(', ')})`;

  };

  return (

    <div
      className="passenger-picker-container"
      ref={pickerRef}
    >

      <i
        className="fa fa-users passenger-icon"
      />

      <div
        className="select-display"
        onClick={() =>
          setIsOpen(prev => !prev)
        }
      >

        <span className="display-text">
          {getDisplayText()}
        </span>

        <span
          className={`arrow-icon ${
            isOpen
              ? 'up'
              : 'down'
          }`}
        >
          ▼
        </span>

      </div>

      {isOpen && (

        <div className="passenger-dropdown">

          <PassengerRow
            label="Adult"
            desc="(12 and over)"
            count={counts.adult}
            onUpdate={(step) =>
              updateCount(
                'adult',
                step
              )
            }
          />

          <PassengerRow
            label="Child"
            desc="(2 - 11)"
            count={counts.child}
            onUpdate={(step) =>
              updateCount(
                'child',
                step
              )
            }
          />

        </div>

      )}

    </div>

  );
}

const PassengerRow = ({
  label,
  desc,
  count,
  onUpdate
}) => (

  <div className="passenger-row">

    <div className="counter-group">

      <button
        type="button"
        className="count-btn"
        onClick={() =>
          onUpdate(-1)
        }
      >
        -
      </button>

      <span className="count-value">
        {count}
      </span>

      <button
        type="button"
        className="count-btn"
        onClick={() =>
          onUpdate(1)
        }
      >
        +
      </button>

    </div>

    <div className="passenger-label">

      <strong>
        {label}
      </strong>

      <small>
        {desc}
      </small>

    </div>

  </div>

);

export default PassengerPicker;