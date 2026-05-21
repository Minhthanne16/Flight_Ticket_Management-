import React, { useState, useEffect, useRef } from 'react';
import '../../css/Picker/PassengerPicker.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

function PassengerPicker() {
  const [isOpen, setIsOpen] = useState(false);

  const [passengers, setPassengers] = useState({
    adult: 1,
    child: 0,
    infant: 0
  });

  const pickerRef = useRef(null);

  const updateCount = (type, step) => {
    setPassengers(prev => ({
      ...prev,
      [type]: Math.max(type === 'adult' ? 1 : 0, prev[type] + step)
    }));
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

    document.addEventListener('mousedown', handleClickOutside);

    return () =>
      document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const total =
    passengers.adult +
    passengers.child +
    passengers.infant;

  const getDisplayText = () => {
    const details = [];

    if (passengers.adult > 0)
      details.push(
        `${passengers.adult} Adult${passengers.adult > 1 ? 's' : ''}`
      );

    if (passengers.child > 0)
      details.push(
        `${passengers.child} Child${passengers.child > 1 ? 'ren' : ''}`
      );

    if (passengers.infant > 0)
      details.push(
        `${passengers.infant} Infant${passengers.infant > 1 ? 's' : ''}`
      );

    return `${total} Passenger${total > 1 ? 's' : ''}${
      details.length ? ` (${details.join(', ')})` : ''
    }`;
  };

  return (
    <div className="passenger-picker-container" ref={pickerRef}>
      <i className="fa fa-users passenger-icon" aria-hidden="true"></i>
      <div
        className="select-display"
        onClick={() => setIsOpen(prev => !prev)}
      >
        <span className="display-text">{getDisplayText()}</span>
        <span className={`arrow-icon ${isOpen ? 'up' : 'down'}`}>
          ▼
        </span>
      </div>

      {isOpen && (
        <div className="passenger-dropdown">
          <PassengerRow
            label="Adult"
            desc="(12 and over)"
            count={passengers.adult}
            onUpdate={(step) => updateCount('adult', step)}
          />

          <PassengerRow
            label="Child"
            desc="(2 - 11)"
            count={passengers.child}
            onUpdate={(step) => updateCount('child', step)}
          />

          <PassengerRow
            label="Infant"
            desc="(Under 2)"
            count={passengers.infant}
            onUpdate={(step) => updateCount('infant', step)}
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
        onClick={() => onUpdate(-1)}
        className="count-btn"
      >
        -
      </button>

      <span className="count-value">{count}</span>

      <button
        type="button"
        onClick={() => onUpdate(1)}
        className="count-btn"
      >
        +
      </button>
    </div>

    <div className="passenger-label">
      <strong>{label}</strong> <small>{desc}</small>
    </div>
  </div>
);

export default PassengerPicker;