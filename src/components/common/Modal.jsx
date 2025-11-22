// src/components/common/Modal.jsx

import React from 'react';
import styles from './Modal.module.css';

const Modal = ({ isOpen, onClose, title, children }) => {
  // If the modal is not open, return null to avoid rendering
  if (!isOpen) {
    return null;
  }

  return (
    // The backdrop fades in/out
    <div className={styles.backdrop} onClick={onClose}>
      
      {/* The actual modal container slides in/out. 
          We stop propagation so clicks inside don't close the modal. */}
      <div 
        className={styles.modalContent} 
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.header}>
          <h2>{title}</h2>
          <button className={styles.closeButton} onClick={onClose}>
            &times;
          </button>
        </div>
        <div className={styles.body}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;