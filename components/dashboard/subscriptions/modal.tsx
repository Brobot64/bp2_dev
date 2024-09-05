// Modal.js
import React, { useEffect, useRef } from 'react';
import style from '../../all.module.css';

type ModalProps = {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
};

const Modal: React.FC<ModalProps> = ({ children, isOpen, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className={style.modalOverlay}>
      <div className={style.modal} ref={modalRef}>
        <button className={style.modalCloseButton} onClick={onClose}>×</button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
