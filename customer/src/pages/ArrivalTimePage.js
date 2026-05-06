import '../App.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useApp } from '../context/AppContext';

const availableArrivalTimes = [
  '08:15',
  '08:30',
  '08:45',
  '09:00',
  '09:15',
  '09:30',
  '09:45',
  '10:00',
  '10:15',
  '10:30',
  '10:45',
  '11:00',
  '11:15',
  '11:30',
  '11:45',
  '12:00',
  '12:15',
  '12:30',
  '12:45',
  '13:00',
  '13:15',
  '13:30',
  '13:45',
  '14:00',
  '14:15',
  '14:30',
  '14:45',
  '15:00'
];

function ArrivalTimePage() {
  const navigate = useNavigate();
  const { arrivalTime, setArrivalTime } = useApp();
  const [selectedTime, setSelectedTime] = useState(arrivalTime || '');

  function handleContinue() {
    if (!selectedTime) return;
    setArrivalTime(selectedTime);
    navigate('/order');
  }

  return (
    <main className="arrival-time-page">
      <Navbar />

      <section className="arrival-time-card">
        <h1>When does your train arrive?</h1>
        <p>Select your station arrival time so we can prepare your order for collection.</p>

        <div className="arrival-time-grid">
          {availableArrivalTimes.map(time => (
            <button
              key={time}
              className={selectedTime === time ? 'selected' : ''}
              onClick={() => setSelectedTime(time)}
            >
              {time}
            </button>
          ))}
        </div>

        <button
          className="confirm-button"
          onClick={handleContinue}
          disabled={!selectedTime}
        >
          Continue to Menu
        </button>
      </section>
    </main>
  );
}

export default ArrivalTimePage;