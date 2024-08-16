// EventModal.js
import React from 'react';
import Modal from 'react-modal';

const EventModal = ({ event, isOpen, onClose }) => {
  if (!event) return null;

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose}>
      <h2>{event.name}</h2>
      <p>Date: {new Date(event.localDate).toLocaleDateString()}</p>
      <p>Time: {event.localTime}</p>
      <button onClick={onClose}>Close</button>
    </Modal>
  );
};

export default EventModal;
